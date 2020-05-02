#!/bin/bash
echo 'Revisando e instalando dependencias...'
npm install
exec npm run dev
