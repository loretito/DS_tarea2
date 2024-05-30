import requests
import random
import time
from bd import create_connection, get_product_by_id
from datetime import datetime

# URL del endpoint para enviar las órdenes
url = 'http://localhost:4000/delivery-request'

num_orders = 500

# Función para enviar una solicitud POST con la orden
def send_order(order, num):
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=order, headers=headers)
    current_time = datetime.now().strftime("%H:%M:%S")
    if response.status_code == 201:
        print(f"✅ {current_time} - Orden enviada exitosamente: {num}")
    else:
        print(f"❌ {current_time} - Error al enviar la orden: {response.status_code} - {response.text}")
    
if __name__ == "__main__":
    # Conectar a la base de datos
    connection = create_connection()
    if not connection:
        print("Unable to connect to the database.")
        exit(1)

    for _ in range (num_orders):
        random_id = random.randint(1, 7641540)
        product = get_product_by_id(connection, random_id)
        if product:
            order = {
                "name": product['name'],
                "price": product['price'],
                "email": "tarea2sdtester@gmail.com"
            }
            send_order(order, _+1)
        else:
            print(f"Producto con id {random_id} no encontrado")

    connection.close()
