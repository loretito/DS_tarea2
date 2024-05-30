# Tarea 2 Sistemas Distribuidos

Authors: César Muñoz and Loreto Ñancucheo

### Stack

<p align='left'>
  <a href='https://kafka.apache.org/' target='_blank'>
    <img src='https://img.shields.io/badge/kafka-FFFFFF?style=for-the-badge&logo=apachekafka&logoColor=%23000000' height='30'>
  </a>
  <a href='https://docs.docker.com/' target='_blank'>
    <img src='https://img.shields.io/badge/docker-0F3486?style=for-the-badge&logo=docker&link=https%3A%2F%2Fdocs.docker.com%2F' height='31'>
  </a>
</p>

<p align='left'>
  <a href='https://docs.nestjs.com/' target='_blank'>
    <img src='https://img.shields.io/badge/NestJS-0E0E10?style=for-the-badge&logo=nestjs&logoColor=%23EA2852' height='31'>
  </a>
  <a href='https://www.typescriptlang.org/docs/' target='_blank'>
    <img src='https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=%23FFFFFF' height='30'>
  </a>
  <a href='https://www.python.org/doc/' target='_blank'><img src='https://img.shields.io/badge/Python-265075?style=for-the-badge&logo=python&logoColor=%23ffffff&link=https%3A%2F%2Fwww.python.org%2Fdoc%2F' height='31'>
</p>

### Video

something...

### Setup

To install the necessary packages, run:

```bash
npm i
```

#### Docker

To bring up Docker Compose, use:

```bash
docker-compose up --scale automatic-processor-normal=3 --scale automatic-processor-slower=2 --build
```

To bring down Docker Compose, use:

```bash
docker-compose down -v
```

#### To run the app

To start the app, run:

```bash
npm run start
```

### Testing

Navigate to `src/test` and install the required Python packages:

```bash
pip install psycopg2-binary confluent_kafka
```

To run the tests, use: 

```bash
python3 order-creator.py
```

or 

```bash
python3 orders-every-1-sec.py
```


### Miscellaneous

something...
