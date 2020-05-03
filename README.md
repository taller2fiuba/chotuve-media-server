[![Build Status](https://travis-ci.com/taller2fiuba/chotuve-media-server.svg?token=QmhbESCXPe2HTNdVCFP9&branch=master)](https://travis-ci.com/taller2fiuba/chotuve-media-server)
[![Coverage Status](https://coveralls.io/repos/github/taller2fiuba/chotuve-media-server/badge.svg?branch=master)](https://coveralls.io/github/taller2fiuba/chotuve-media-server?branch=master)

# Chotuve Media Server

## Para iniciar el servidor de desarrollo

```bash
$ bin/dev-compose up
```
El servidor estará aceptando conexiones en http://localhost:27080/

## Para detener el servidor de desarrollo

```bash
$ bin/dev-compose stop
```

Para detener el servidor y eliminar los contenedores asociados

```bash
$ bin/dev-compose down
```
## Para correr los tests unitarios

`bin/run-unit-tests`

## Para arreglar automaticamente los errores de lint

`bin/npm run fix-lint`

## Para correr una versión productiva del Media server

Se puede levantar una versión productiva del Media server y su respectiva base de datos utilizando Docker Compose.
Para esto se asumirá la existencia de una red de Docker de tipo `bridge` llamada `chotuve`. Esta red debe ser creada antes de levantar el contendor con el siguiente comando:

```bash
$ docker network create -d bridge chotuve
```

Y luego levantar el servicio de la siguiente forma:

```bash
$ docker-compose build
$ docker-compose up -d
```

Esta red de Docker sólo se utiliza para cuando se levantan más de un servicio en la misma máquina. Si la máquina sólo va a
tener el Media server puede modificarse el `docker-compose.yml` eliminando esta red.
