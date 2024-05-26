from confluent_kafka import Producer
import json
from bd import create_connection, insert_order

# Configuración del productor
producer_config = {
    'bootstrap.servers': 'localhost:9092'
}
producer = Producer(producer_config)

# Función para producir mensajes
def produce_message(topic, message):
    try:
        producer.produce(topic, value=json.dumps(message).encode('utf-8'))
        producer.flush()
        print(f"Mensaje producido: {message}")
    except Exception as e:
        print(f"Error al producir el mensaje: {e}")

if __name__ == "__main__":
    # Conectar a la base de datos
    connection = create_connection()
    if not connection:
        print("Unable to connect to the database.")
        exit(1)

    # Crear y enviar órdenes
    for i in range(10):
        product_name = "Producto" + str(i+1)
        price = 100
        email = "example@example.com"
        status = "RECEIVED"

        # Insertar orden en la base de datos y obtener el bd_id
        order_id = insert_order(connection, product_name, price, email, status)
        if order_id:
            # Crear el mensaje con el bd_id
            test_message = {
                "bd_id": order_id,
                "product_name": product_name,
                "price": price,
                "status": status
            }
            # Enviar el mensaje al tópico 'RECEIVED'
            produce_message('RECEIVED', test_message)
        else:
            print(f"Failed to insert order for {product_name}")

    # Cerrar la conexión a la base de datos
    connection.close()
