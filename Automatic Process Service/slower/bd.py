import psycopg2
from psycopg2 import OperationalError
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import time
import os

# Configuración de la conexión usando variables de entorno
db_config = {
    'host': os.getenv('DB_HOST', 'pgdb_tarea2'),  # Usar 'pgdb_tarea2'
    'port': os.getenv('DB_PORT', '5432'),  # Usar '5432'
    'database': os.getenv('DB_NAME', 'tienda'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

# Función para manejar las notificaciones
def handle_notices(conn):
    for notice in conn.notices:
        print(f"💬 Notice: {notice}")
    conn.notices.clear()  # Limpiar las notificaciones después de manejarlas

# Función para manejar los errores
def handle_error(err):
    print(f"❌ Database error: {err}")

# Función para conectarse a la base de datos
def create_connection():
    try:
        conn = psycopg2.connect(**db_config)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        conn.set_client_encoding('UTF8')
        print("✅ Connection successful")
        return conn
    except OperationalError as err:
        handle_error(err)
        return None

# Función para ejecutar una consulta
def execute_query(conn, query, params=None):
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, params)
            handle_notices(conn)  # Manejar las notificaciones después de ejecutar la consulta
            if cursor.description:
                result = cursor.fetchall()
                print(f"🔍 Query result: {result}")
            else:
                conn.commit()
                print("✅ Query executed successfully")
    except Exception as err:
        handle_error(err)

# Función para actualizar el estado de una orden
def update_order_status(conn, order_id, new_status):
    retry_attempts = 5
    for attempt in range(retry_attempts):
        try:
            update_query = """
            UPDATE "order"
            SET "status" = %s
            WHERE bd_id = %s;
            """
            with conn.cursor() as cursor:
                cursor.execute(update_query, (new_status, order_id))
                handle_notices(conn)  # Manejar las notificaciones después de ejecutar la consulta
                conn.commit()
                print(f"🔄 Order {order_id} status updated to {new_status}")
            return True
        except OperationalError as err:
            handle_error(err)
            print(f"🔄 Retrying... ({attempt + 1}/{retry_attempts})")
            time.sleep(1)  # Esperar antes de reintentar
    print(f"❌ Failed to update order {order_id} after {retry_attempts} attempts.")
    return False

def insert_order(conn, product_name, price, email, status):
    insert_query = """
    INSERT INTO "order" (product_name, price, email, "status")
    VALUES (%s, %s, %s, %s) RETURNING bd_id;
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute(insert_query, (product_name, price, email, status))
            order_id = cursor.fetchone()[0]
            handle_notices(conn)  # Manejar las notificaciones después de ejecutar la consulta
            conn.commit()
            print(f"🆕 Order inserted with id {order_id}")
            return order_id
    except Exception as err:
        handle_error(err)
        return None

# Ejemplo de uso
# if __name__ == "__main__":
#     connection = create_connection()
#     if connection:
#         # Ejecutar una consulta de ejemplo
#         example_query = "SELECT * FROM product LIMIT 5;"
#         execute_query(connection, example_query)
        
#         # Actualizar el estado de una orden de ejemplo
#         order_id = 1
#         new_status = "DELIVERED"
#         update_order_status(connection, order_id, new_status)
        
#         connection.close()
