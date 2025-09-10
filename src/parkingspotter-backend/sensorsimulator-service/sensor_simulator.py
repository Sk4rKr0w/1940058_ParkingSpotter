import pika
import json
import time
import random
import os
import threading

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE", "parking_events")
RABBITMQ_USER = os.getenv("RABBITMQ_DEFAULT_USER", "parkingspotter")
RABBITMQ_PASS = os.getenv("RABBITMQ_DEFAULT_PASS", "hude73e327eh")
UNIQUE_CODE = os.getenv("UNIQUE_CODE", "209c536855acc31c37d56bbaead558a5638f70da682ead9984a7e6ed50f901c9a63bcc388e086ad77b0e5f7e5bb81b4f53024cfe662a7d50141d3dc9c2561319")
PARKING_ID = int(os.getenv("PARKING_ID", "1"))
PARKING_MAX_PLACES = int(os.getenv("PARKING_MAX_PLACES", "10"))

maxPlaces = PARKING_MAX_PLACES
availablePlaces = PARKING_MAX_PLACES
reservations = {}

def create_connection():
    """Return a new RabbitMQ connection"""
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    for attempt in range(10):
        try:
            return pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=RABBITMQ_HOST,
                    port=RABBITMQ_PORT,
                    credentials=credentials
                )
            )
        except pika.exceptions.AMQPConnectionError:
            print(f" [!] RabbitMQ not ready, retrying {attempt+1}/10...")
            time.sleep(5)
    raise Exception("Could not connect to RabbitMQ after 10 retries")

def setup_publisher():
    """Connection and channel for publishing"""
    conn = create_connection()
    channel = conn.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
    channel.exchange_declare(exchange="sensor_exchange", exchange_type="direct", durable=True)
    return conn, channel

def setup_consumer():
    """Connection and channel for consuming"""
    conn = create_connection()
    channel = conn.channel()
    channel.exchange_declare(exchange="reservation_exchange", exchange_type="fanout", durable=True)
    result = channel.queue_declare(queue="", exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange="reservation_exchange", queue=queue_name)
    return conn, channel, queue_name

def send_event(channel, event_type):
    """Send entry/exit event"""
    global availablePlaces
    message = {
        "parkingId": PARKING_ID,
        "uniqueCode": UNIQUE_CODE,
        "event": event_type,
        "timestamp": int(time.time())
    }
    channel.basic_publish(
        exchange="sensor_exchange",
        routing_key=RABBITMQ_QUEUE,
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2)
    )
    print(f" [x] Sent {message}")

def on_reservation_event(ch, method, properties, body):
    global reservations, availablePlaces
    event = json.loads(body)
    parking_id = event["parkingId"]
    event_type = event["type"]

    if parking_id != PARKING_ID:
        return

    if event_type == "created":
        reservations.setdefault(parking_id, []).append(event)
        if availablePlaces > 0:
            availablePlaces -= 1
    elif event_type in ["cancelled", "expired"]:
        reservations[parking_id] = [
            r for r in reservations.get(parking_id, []) 
            if r["reservationId"] != event["reservationId"]
        ]
        if availablePlaces < maxPlaces:
            availablePlaces += 1

    print(f"[x] Updated reservations for parking {parking_id}: {len(reservations[parking_id])}")

def start_consumer(channel, queue_name):
    channel.basic_consume(queue=queue_name, on_message_callback=on_reservation_event, auto_ack=True)
    channel.start_consuming()
    print("Listening for reservation events...\n")

def simulate(pub_channel):
    global availablePlaces
    try:
        while True:
            event = random.choice(["enter", "exit"])
            if event == "enter" and availablePlaces > 0:
                availablePlaces -= 1
                send_event(pub_channel, event)
            elif event == "exit" and availablePlaces < maxPlaces:
                availablePlaces += 1
                send_event(pub_channel, event)

            print(f"Available places: {availablePlaces}/{maxPlaces}")
            time.sleep(random.randint(10, 20)) 
    except KeyboardInterrupt:
        print("Simulation stopped")

if __name__ == "__main__":
    pub_conn, pub_channel = setup_publisher()
    sub_conn, sub_channel, queue_name = setup_consumer()

    # Start receiving reservations
    t = threading.Thread(target=start_consumer, args=(sub_channel, queue_name), daemon=True)
    t.start()

    # Run enter/exit simulation
    simulate(pub_channel)

    pub_conn.close()
    sub_conn.close()