import os
from confluent_kafka import Producer, Consumer, KafkaException, KafkaError
import json
import time
from bd import create_connection, update_order_status

# Configuración del productor
producer_config = {
    'bootstrap.servers': os.getenv('KAFKA_BROKER')
}
producer = Producer(producer_config)

# Configuración del consumidor
consumer_config = {
    'bootstrap.servers': os.getenv('KAFKA_BROKER'),
    'group.id': 'order-processing-group',
    'auto.offset.reset': 'earliest'
}
consumer = Consumer(consumer_config)

# Tópicos y estados
topics = ['RECEIVED', 'PREPARED', 'DELIVERED', 'COMPLETED']
status_order = ['RECEIVED', 'PREPARED', 'DELIVERED', 'COMPLETED']

# Intervalo de tiempo en segundos
process_interval = 1  # Cambia este valor según tus necesidades

# Función para producir mensajes
def produce_message(topic, message):
    try:
        producer.produce(topic, value=json.dumps(message).encode('utf-8'))
        producer.flush()
        print(f"Mensaje producido al tópico {topic} con ID de orden {message['bd_id']} ✅")
    except Exception as e:
        print(f"Error al producir el mensaje: {e}")

# Función para consumir mensajes
def consume_messages():
    consumer.subscribe([topics[0]])  # Empezamos consumiendo del primer tópico (RECEIVED)
    connection = create_connection()
    if not connection:
        print("❌ Unable to connect to the database.")
        return

    try:
        while True:
            msg = consumer.poll(timeout=10.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    raise KafkaException(msg.error())
            message = json.loads(msg.value().decode('utf-8'))
            print(f"Mensaje consumido: {message}")
            process_and_produce_message(connection, message)
    except Exception as e:
        print(f"Error al consumir el mensaje: {e}")
    finally:
        consumer.close()
        connection.close()

# Función para procesar y producir mensajes
def process_and_produce_message(conn, order):
    for i in range(len(topics) - 1):
        current_status = order['status']
        next_status = get_next_status(current_status)
        order['status'] = next_status
        next_topic = topics[i + 1]

        # Actualizar el estado de la orden en la base de datos
        updated = update_order_status(conn, order['bd_id'], next_status)
        if not updated:
            print(f"❌ Failed to update order {order['bd_id']} to status {next_status}.")
            return
        
        print(f"Procesando orden: {order['bd_id']} 🛠️, nuevo estado: {order['status']}")
        produce_message(next_topic, order)
        time.sleep(process_interval)  # Espera X segundos antes de cambiar al siguiente estado

# Obtener el siguiente estado
def get_next_status(current_status):
    current_index = status_order.index(current_status)
    if current_index < len(status_order) - 1:
        return status_order[current_index + 1]
    return current_status

if __name__ == "__main__":
    consume_messages()
