import pika
import json
import time
import random
import os

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE", "parking_events")
RABBITMQ_USER = os.getenv("RABBITMQ_DEFAULT_USER", "parking_events")
RABBITMQ_PASS = os.getenv("RABBITMQ_DEFAULT_PASS", "parking_events")
UNIQUE_CODE = os.getenv("UNIQUE_CODE", "parking_events")
PARKING_ID = int(os.getenv("PARKING_ID", "1"))

def connect():
    """Connect to RabbitMQ."""
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=credentials)
    )
    channel = connection.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
    return connection, channel

def send_event(channel, event_type):
    """Send entry/exit event."""
    message = {
        "parkingId": PARKING_ID,
        "uniqueCode": UNIQUE_CODE,  # auth token
        "event": event_type,        # "enter" or "exit"
        "timestamp": int(time.time())
    }
    channel.basic_publish(
        exchange="sensor_exchange",
        routing_key=RABBITMQ_QUEUE,
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2)
    )
    print(f" [x] Sent {message}")

def simulate():
    connection, channel = connect()
    try:
        while True:
            # Random choice: car enter or exit
            event = random.choice(["enter", "exit"])
            send_event(channel, event)

            # Random delay between events (30–60 seconds)
            time.sleep(random.randint(30, 60))
    except KeyboardInterrupt:
        print("Simulation stopped")
    finally:
        connection.close()

if __name__ == "__main__":
    simulate()
