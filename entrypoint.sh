#!/bin/sh

# Script de entrada para servir la aplicación con puerto dinámico
PORT=${PORT:-80}

echo "🚀 Starting serve on port $PORT..."
exec serve -s build -l $PORT
