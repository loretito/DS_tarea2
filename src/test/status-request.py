import requests
import random
import time
import matplotlib.pyplot as plt

# Configuración del script
X = 1  # Rango mínimo de IDs
Y = 500  # Rango máximo de IDs
A = 3  # Número de consultas a realizar

# Función para hacer una consulta y medir el tiempo
def make_request(id):
    url = f'http://localhost:4000/status/{id}'
    start_time = time.time()
    response = requests.get(url)
    elapsed_time = time.time() - start_time
    return response, elapsed_time

# Variables para almacenar los resultados
times = []
kafka_count = 0
db_count = 0
not_found_count = 0

# Realizar las consultas
for i in range(A):
    random_id = random.randint(X, Y)
    print(f'Making request number {i+1} for ID: {random_id}')
    response, elapsed_time = make_request(random_id)
    times.append((i + 1, elapsed_time))
    
    print(f'Time: {elapsed_time:.2f} seconds')
    print(f'Response: {response.json()}\n')
    
    if response.status_code == 200:
        if "Kafka" in response.json()['message']:
            kafka_count += 1
        elif "database" in response.json()['message']:
            db_count += 1
    elif response.status_code == 404:
        not_found_count += 1

# Calcular el tiempo promedio
average_time = sum(time for _, time in times) / len(times)

# Crear gráficos
plt.figure(figsize=(12, 6))

# Gráfico de dispersión
low_times = [(num, time) for num, time in times if time <= 10]
medium_times = [(num, time) for num, time in times if 10 < time <= 40]
high_times = [(num, time) for num, time in times if time > 40]

plt.subplot(1, 2, 1)
if low_times:
    plt.scatter(*zip(*low_times), color='#4793AF', label='0-10 sec')
if medium_times:
    plt.scatter(*zip(*medium_times), color='#FFC470', label='10-40 sec')
if high_times:
    plt.scatter(*zip(*high_times), color='#DD5746', label='>40 sec')

plt.xlabel('Request Number')
plt.ylabel('Response Time (sec)')
plt.title('Response Time for Each Request')
plt.axhline(y=average_time, color='gray', linestyle='--', label=f'Average time: {average_time:.2f} sec')
plt.legend()

# Gráfico de donut
labels = [f'Kafka - {kafka_count}', f'Database - {db_count}', f'Not Found - {not_found_count}']
sizes = [kafka_count, db_count, not_found_count]
colors = ['#028391', '#F6DCAC', '#FEAE6F']

plt.subplot(1, 2, 2)
wedges, texts, autotexts = plt.pie(sizes, colors=colors, startangle=140, wedgeprops=dict(width=0.3), autopct='%1.1f%%')

# Agregar leyendas personalizadas
for i, a in enumerate(autotexts):
    a.set_text(f'{labels[i]}\n{a.get_text()}')

plt.title('Response Distribution')

# Mostrar el tiempo promedio en la consola
print(f'Average response time: {average_time:.2f} seconds')

# Mostrar los gráficos
plt.tight_layout()
plt.show()
