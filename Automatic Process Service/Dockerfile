# Usa una imagen base de Python
FROM python:3.9-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo requirements.txt en el directorio de trabajo
COPY requirements.txt ./

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente de la aplicación en el contenedor
COPY bd.py .
COPY processor.py .
COPY entrypoint.sh .  

# Copiar el script de entrada

# Dar permisos de ejecución al script de entrada
RUN chmod +x entrypoint.sh

# Configurar el script de entrada
ENTRYPOINT ["./entrypoint.sh"]

# Comando para ejecutar el script processor.py
CMD ["python", "-u", "processor.py"]