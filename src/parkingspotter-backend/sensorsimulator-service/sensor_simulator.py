import pika
import json
import time
import random
import os

# Load env (or set manually)
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE", "parking_events")

# Operator and Parking IDs (from DB)
OPERATOR_ID = 1
PARKING_ID = 101
SECRET_CODE = "MY_UNIQUE_SECRET_123456789"  # you fetch this from dashboard normally

def connect():
    """Connect to RabbitMQ."""
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT)
    )
    channel = connection.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
    return connection, channel

def send_event(channel, event_type):
    """Send entry/exit event."""
    message = {
        "operatorId": OPERATOR_ID,
        "parkingId": PARKING_ID,
        "secretCode": SECRET_CODE,  # auth token
        "event": event_type,        # "enter" or "exit"
        "timestamp": int(time.time())
    }
    channel.basic_publish(
        exchange="",
        routing_key=RABBITMQ_QUEUE,
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2)  # persistent
    )
    print(f" [x] Sent {message}")

def simulate():
    connection, channel = connect()
    try:
        while True:
            # Random choice: enter or exit
            event = random.choice(["enter", "exit"])
            send_event(channel, event)

            # Random delay between events (1–5 seconds)
            time.sleep(random.randint(1, 5))
    except KeyboardInterrupt:
        print("Simulation stopped")
    finally:
        connection.close()

if __name__ == "__main__":
    simulate()
