# Usa una imagen base de Python
FROM python:latest

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo requirements.txt en el directorio de trabajo
COPY requirements.txt ./

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente de la aplicación en el contenedor
COPY service.py ./

# Comando para ejecutar la aplicación
CMD ["python", "-u", "service.py"]
