--Product Names|Price
--Termometro infrarrojo de Grado Medico Berrcom JXB-178|588.99
--Escudo Antibacterial Toallitas Húmedas, 1 Paquete con 50 Toallitas, Protección y Limpieza para tu Piel|29.9
--Termómetro para adultos bebé, termómetro digital oral, visualización grande LED, termómetro de temperatura corporal con función de alarma de fiebre y memoria, apto para cavidad oral, axila, recto.|178.0
--EUREKA Aspiradora, Giratorio ligero-nes210, Negro (Dark Black), 1-(Pack), 1, 1|926.76

CREATE TABLE IF NOT EXISTS product (
    bd_id SERIAL PRIMARY KEY,
    "name" TEXT,
    price INT
);

CREATE TABLE IF NOT EXISTS "order" (
    bd_id SERIAL PRIMARY KEY,
    product_name TEXT,
    price INT,
    email VARCHAR(255),
    "status" VARCHAR(10)
);

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

COPY product ("name", price)
FROM '/docker-entrypoint-initdb.d/02-dataset.csv' DELIMITER '|' CSV HEADER;

--SELECT count(*) FROM product;