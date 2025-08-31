require('dotenv').config();
const amqp = require("amqplib");

const { sequelize } = require('./models');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    // Create tables if they don't exist
    await sequelize.sync({ alter: true });

    const opt = {credentials: require('amqplib').credentials.plain(process.env.RABBITMQ_DEFAULT_USER, process.env.RABBITMQ_DEFAULT_PASS)};
    const connection = await amqp.connect("amqp://rabbitmq", opt);
    const channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");

    const exchange = "sensor_exchange";
    await channel.assertExchange(exchange, "fanout", { durable: true });

    const q = await channel.assertQueue("parking_events", { durable: true });
    channel.bindQueue(q.queue, exchange, "");

    console.log("Waiting for sensor messages...");

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        const { uniqueCode, parkingId, occupiedSpots } = data;

        // Authenticate operator
        const operator = await User.findOne({ where: { uniqueCode } });
        if (!operator) {
          console.warn("Invalid User Unique Code:", uniqueCode);
          channel.ack(msg);
          return;
        }

        // Update parking occupancy
        const parking = await Parking.findByPk(parkingId);
        if (!parking) {
          console.warn("Parking not found:", parkingId);
          channel.ack(msg);
          return;
        }

        parking.occupiedSpots = occupiedSpots;
        await parking.save();

        console.log(
          `Updated parking ${parkingId} (operator ${operator.name}): ${occupiedSpots} spots occupied`
        );
        channel.ack(msg);
      } catch (err) {
        console.error("Error processing message:", err);
        channel.nack(msg, false, false); // discard message
      }
    });
  } catch (err) {
    console.error('Error spawning ingestion service:', err);
    process.exit(1);
  }
}

start();
