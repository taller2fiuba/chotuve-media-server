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

## Configuración
Toda la configuración del servidor de medios de Chotuve se realiza a través de variables de entorno. Aquellas variables definidas como "requeridas" deben tener un valor definido para poder iniciar el servidor y generarán un error en caso contrario.

### Básica
Las siguientes configuraciones son necesarias para la funcionalidad básica del servidor de autenticación de Chotuve.
- `MONGODB_URL`: Requerido. URL de la base de datos, en formato `esquema://host:puero/nombre_db`. El único esquema soportado es `mongodb` y sólo se garantiza el correcto funcionamiento con bases de datos Mongo. Ejemplo: `mongodb://localhost:27017/chotuve-media-dev`.
- `PORT`: Sólo productivo. Requerido. Puerto en el cual se aceptarán conexiones.

### Misceláneas
- `NODE_ENV`: Opcional. Entorno de Flask a utilizar. Valor por defecto: `development`. Debe configurarse manualmente a `production` en un entorno productivo.
- `TZ`: Recomendado. Entorno usado para determinar la zona horaria con la que se trabaja.

## Despliegue productivo

Para el despliegue productivo de la aplicación se provee un archivo `Dockerfile`. El mismo permitirá construir una imagen productiva de Docker del servidor de autenticación de Chotuve.

### Dependencias

Para el entorno productivo la única dependencia requerida es Docker. 

En caso de querer realizar una instalación sin Docker, se requieren las siguientes bibliotecas:

- NodeJS 13
- Express ^4.16.4
- Mongoose ^5.9.10
- Mongoose-paginate-v2 ^1.3.9
- axios ^0.19.2
- cors ^2.8.5
- pino ^6.2.1
- pino-http ^5.1.0
- pino-pretty ^4.0.0
- underscore ^1.10.2

### Ejemplo de despliegue productivo

En el siguiente ejemplo se lanzará una versión productiva de Chotuve Media Server con la siguiente configuración:
- Base de datos Mongo
- Aceptará conexiones en el puerto 5000.

```bash
~/chotuve-media-server$ docker build -t chotuve-media-server:latest .
...
Successfully tagged chotuve-media-server:latest
~/chotuve-media-server$ docker run \
    -e FLASK_ENV=production \
    -e DATABASE_URL="mongodb://localhost:27017/base_app" \
    -e PORT=5000 \
    --network="host" \
    -d \
    chotuve-media-server:latest
b51f513fc78cc222b32226d617b689a3960e4eb5b8f6d021dd6714163c14fb8b
~/chotuve-media-server$
```

> **IMPORTANTE**: No olvidar configurar la variable de ambiente `NODE_ENV` en `production` para hacer el despliegue productivo.

Ahora el servidor de autenticación estará corriendo y aceptando conexiones en `http://localhost:5000`.

## Desarrollo

Todo el proyecto está dockerizado de modo de poder desarrollar sin tener que instalar ninguna dependencia adicional más que Docker y Docker Compose.

Para esto se provee un conjunto de scripts para levantar el servidor de desarrollo y simplificar algunas tareas comunes:
- `bin/dev-compose`: Wrapper para `docker-compose`. El servidor de desarrollo utiliza un archivo `docker-compose.yml` que está ubicado en `bin/chotuve_app/docker-compose.yml`. Para evitar tener que indicar explícitamente la ruta a `docker-compose` en cada invocación se provee este script. Ejecutar `bin/dev-compose` es equivalente a ejecutar `docker-compose -f bin/chotuve_app/docker-compose.yml`.
- `bin/exec-dev`: Permite ejecutar un comando dentro del contenedor de desarrollo. Útil para cuando es necesario abrir un intérprete de Python o ejecutar un script de Flask dentro del contenedor. Requiere que el contenedor de desarrollo esté iniciado.
- `bin/run-unit-tests`: Corre el *linter* y las pruebas unitarias del proyecto dentro del contenedor de desarrollo. Requiere que el contenedor de desarrollo esté iniciado.

### Iniciar el servidor de desarrollo
El servidor de desarrollo tendrá acceso al código fuente del proyecto mediante un montaje de tipo *bind*, lo cual implica que cualquier cambio que se realice sobre el código impactará directamente sobre el servidor.

```bash
~/chotuve-media-server$ bin/dev-compose up
```

El servidor de desarrollo aceptará conexiones en `http://localhost:27080`.

Para iniciar el servidor en segundo plano o pasarle opciones extras a `docker-compose`, se pueden agregar al final de la línea de comandos, por ejemplo:

```bash
~/chotuve-media-server$ bin/dev-compose up -d
```

### Para detener el servidor de desarrollo

Si estaba corriendo interactivamente (en una terminal) `Ctrl-C`, si estaba corriendo
en segundo plano:

```bash
~/chotuve-media-server$ bin/dev-compose down
```

> Para detener el servidor y además borrar su base de datos, se puede ejecutar `dev-compose down -v`.

### Para correr las pruebas unitarias

```bash
~/chotuve-media-server$ bin/run-unit-tests
```

Puede ser necesario, eventualmente, correr alguna prueba específica o correr las pruebas sin correr el *linter*. Para esto se puede abrir un `bash` dentro del contenedor y ejecutar los comandos manualmente. Por ejemplo:

```bash
~/chotuve-media-server$ bin/exec-dev bash
root@chotuve:/var/www/app# cd src
root@chotuve:/var/www/app/src# nom run test
....
----------------------------------------------------------------------
Ran 4 tests in 0.294s

OK
root@chotuve:/var/www/app/src#
```

### Otros comandos

Al desarrollar se cuentan con varios comandos para usar através de npm, entre los principales se tiene:

- *npm run dev*: Levanta el servidor manual sin utilizar docker, por lo que se deben tener todas las variables necesarias configuradas.
- *npm run start*: Igualmente que `dev` pero levanta una versión de productiva.
- *npm run test*: Ejecuta las pruebas existentes en el proyecto.
- *npm run fix-lint*: Corre las correcciones a los errores mostrados por el linter.

## Base de datos

Se utiliza el ORM Mongoose y no se cuenta con un manejador de migraciones.

## Pruebas de aceptación

Este proyecto cuenta con pruebas de aceptación utilizando `behave`. Para correr las pruebas ver su documentación en [el repositorio de pruebas](https://github.com/taller2fiuba/chotuve-integration-tests).

Para simplificar las pruebas de aceptación se provee un archivo `docker-compose.yml` en la raíz del repositorio que permite levantar una imagen semi-productiva del proyecto y una base de datos PostgreSQL para el mismo.

Este archivo se puede utilizar también para levantar una versión productiva del servidor y la base de datos en una misma máquina, haciéndole algunos cambios a las variables de entorno.

Para que este archivo `docker-compose.yml` pueda funcionar correctamente se asume la existencia de una red de Docker denominada `chotuve` que permite conectar todos los servidores entre sí. 

En caso de que esta red no exista se puede crear con el siguiente comando:

```bash
$ docker network create -d bridge chotuve
```

No es necesario crear la red de Docker para correr las pruebas de aceptación, el script que corre las pruebas se encargará de crearla si no existiera.

## Integración continua

Se utiliza Travis CI como servidor de integración continua y despliegue automático a Heroku, bajo la siguiente configuración:
- En todas las ramas se corren las pruebas unitarias en cada commit.
- En los PR se corren las pruebas unitarias y además las pruebas de aceptación. Es necesario que el PR tenga una aprobación y que pase las pruebas **unitarias** para poder mergearlo a `master`.
- En `master` se corren las pruebas unitarias y de aceptación, y en caso de que todas las pruebas pasen se hace un deploy automático a Heroku.
