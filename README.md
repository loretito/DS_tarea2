# Tarea 2 Sistemas Distribuidos

Autors: César Muñoz and Loreto Ñancucheo

### Stack

<p align='left'>
  <a href='https://kafka.apache.org/' target='_blank'>
    <img src='https://img.shields.io/badge/kafka-FFFFFF?style=for-the-badge&logo=apachekafka&logoColor=%23000000' height='30'>
  </a>
  <a href='https://docs.docker.com/' target='_blank'>
    <img src='https://img.shields.io/badge/docker-0F3486?style=for-the-badge&logo=docker&link=https%3A%2F%2Fdocs.docker.com%2F' height='32'>
  </a>
</p>

<p align='left'>
  <a href='https://docs.nestjs.com/' target='_blank'>
    <img src='https://img.shields.io/badge/NestJS-0E0E10?style=for-the-badge&logo=nestjs&logoColor=%23EA2852' height='32'>
  </a>
  <a href='https://www.typescriptlang.org/docs/' target='_blank'>
    <img src='https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=%23FFFFFF' height='30'>
  </a>
</p>

### Video

something...

### Setup

```bash
npm i
```

#### Docker

To bring up Docker Compose use:

```bash
docker-compose up -d
```

To bring down Docker Compose

```bash
docker-compose down -v
```

#### Producer

For producer operations:

```bash
npm run start
```

#### Consumer

```bash
a
```

<!-- #### Docker Partition

To inspect the Docker network and access Redis:

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis1
docker exec -it redis1 /bin/bash
redis-cli
cluster nodes
``` -->

### Testing

something...

### Miscellaneous

something...
