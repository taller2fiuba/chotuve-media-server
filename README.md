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

