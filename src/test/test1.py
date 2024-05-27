import requests
import random
from bd import create_connection, get_product_by_id

# URL del endpoint para enviar las órdenes
url = 'http://localhost:4000/delivery-request'

# Función para enviar una solicitud POST con la orden
def send_order(order):
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=order, headers=headers)
    if response.status_code == 201:
        print(f"✅ Orden enviada exitosamente: {order}")
    else:
        print(f"❌ Error al enviar la orden: {response.status_code} - {response.text}")

if __name__ == "__main__":
    # Conectar a la base de datos
    connection = create_connection()
    if not connection:
        print("Unable to connect to the database.")
        exit(1)

    # Número de órdenes a crear y enviar
    num_orders = 1000

    for _ in range(num_orders):
        random_id = random.randint(1, 7641540)
        product = get_product_by_id(connection, random_id)
        if product:
            order = {
                "name": product['name'],
                "price": product['price'],
                "email": "Hola@Hola.com"
            }
            send_order(order)
        else:
            print(f"Producto con id {random_id} no encontrado")

    # Cerrar la conexión a la base de datos
    connection.close()
