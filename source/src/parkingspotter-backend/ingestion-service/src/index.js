require("dotenv").config();
const amqp = require("amqplib");
const { sequelize, User, Parking } = require("./models");
const { startReservationsChecker } = require("./utils/reservationsChecker");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let reservationChannel;
let channel;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    const opt = {
      credentials: require("amqplib").credentials.plain(
        process.env.RABBITMQ_DEFAULT_USER,
        process.env.RABBITMQ_DEFAULT_PASS
      ),
    };
    const connection = await amqp.connect("amqp://rabbitmq", opt);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");

    const exchange = "sensor_exchange";
    const queueName = process.env.RABBITMQ_QUEUE || "parking_events";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchange, queueName);
    console.log("Sensor channel ready");

    reservationChannel = await connection.createChannel();
    await reservationChannel.assertExchange("reservation_exchange", "fanout", { durable: true });
    console.log("Reservation channel ready");

    startReservationsChecker(channel);
    console.log("Waiting for sensor messages...");

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        const { uniqueCode, parkingId, event } = data;

        // Get parking
        const parking = await Parking.findByPk(parkingId);
        if (!parking) {
          console.warn("Parking not found:", parkingId);
          channel.ack(msg);
          return;
        }

        // Authenticate operator
        const operator = await User.findOne({ where: { id: parking.operatorId } });
        if (!operator) {
          console.warn("Invalid User");
          channel.ack(msg);
          return;
        } else {
          if(operator.uniqueCode != uniqueCode) {
            console.warn("Invalid User Unique Code:", uniqueCode);
            channel.ack(msg);
            return;
          }
        }

        // Adjust spots based on event type
        if (event === "enter" && parking.occupiedSpots < parking.totalSpots) {
          parking.occupiedSpots += 1;
        } else if (event === "exit" && parking.occupiedSpots > 0) {
          parking.occupiedSpots -= 1;
        }

        await parking.save();

        console.log(
          `Updated parking ${parkingId} (operator ${operator.name}): ${parking.occupiedSpots}/${parking.totalSpots} occupied`
        );
        channel.ack(msg);
      } catch (err) {
        console.error("Error processing message:", err);
        channel.nack(msg, false, false); // discard bad message
      }
    });
  } catch (err) {
    console.error("Error spawning ingestion service:", err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Ingestion service API running on port 3000");
  });
}

app.post("/reservation", async (req, res) => {
  try {
    if (!reservationChannel) return res.status(500).send("RabbitMQ not connected");

    const { reservationId, parkingId, type } = req.body;
    if (!reservationId || !parkingId || !type) return res.status(400).send("Missing fields");

    const message = { reservationId, parkingId, type, timestamp: Date.now() };

    reservationChannel.publish(
      "reservation_exchange",
      "",
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    console.log("Published reservation event:", message);
    res.status(200).json({ status: "ok", message });
  } catch (err) {
    console.error("Error publishing reservation:", err);
    res.status(500).send("Internal Server Error");
  }
});


start();
