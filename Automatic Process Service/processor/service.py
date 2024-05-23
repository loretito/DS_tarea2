from confluent_kafka import Producer, Consumer, KafkaException, KafkaError
import json
import time

# Configuración del productor
producer_config = {
    'bootstrap.servers': 'localhost:9092'
}
producer = Producer(producer_config)

# Configuración del consumidor
consumer_config = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'order-processing-group',
    'auto.offset.reset': 'earliest'
}

# Definir los tópicos y sus estados
topics = ['creada', 'recibida', 'preparada', 'entregada', 'finalizada']
status_order = ['creada', 'recibida', 'preparada', 'entregada', 'finalizada']

# Función para producir mensajes
def produce_message(topic, message):
    producer.produce(topic, value=json.dumps(message).encode('utf-8'))
    producer.flush()

# Función para consumir mensajes
def consume_message(topic):
    consumer = Consumer(consumer_config)
    consumer.subscribe([topic])
    while True:
        msg = consumer.poll(timeout=10.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                raise KafkaException(msg.error())
        return json.loads(msg.value().decode('utf-8'))

# Función para procesar el mensaje
def process_order(order):
    current_status = order['status']
    next_status = get_next_status(current_status)
    order['status'] = next_status
    return order

# Obtener el siguiente estado
def get_next_status(current_status):
    current_index = status_order.index(current_status)
    if current_index < len(status_order) - 1:
        return status_order[current_index + 1]
    return current_status

# Loop principal de procesamiento
def main():
    while True:
        for i in range(len(topics) - 1):
            topic = topics[i]
            order = consume_message(topic)
            if order:
                print(f"Procesando orden: {order['id']}, estado actual: {order['status']}")
                order = process_order(order)
                print(f"Nuevo estado: {order['status']}")
                time.sleep(5)  # Espera X segundos (puedes ajustar el tiempo según tus necesidades)
                next_topic = topics[i + 1]
                produce_message(next_topic, order)

if __name__ == "__main__":
    main()
