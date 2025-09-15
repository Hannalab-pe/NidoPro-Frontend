#!/bin/bash

# Script para verificar la configuración de variables de entorno
echo "🔍 Verificando configuración de variables de entorno..."
echo ""

# Verificar si existe .env
if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
else
    echo "❌ Archivo .env no encontrado"
fi

# Verificar VITE_API_URL
if [ -n "$VITE_API_URL" ]; then
    echo "✅ VITE_API_URL configurada: $VITE_API_URL"
else
    echo "❌ VITE_API_URL no configurada"
fi

# Verificar otras variables críticas
if [ -n "$VITE_CLOUDINARY_CLOUD_NAME" ]; then
    echo "✅ VITE_CLOUDINARY_CLOUD_NAME configurada"
else
    echo "❌ VITE_CLOUDINARY_CLOUD_NAME no configurada"
fi

if [ -n "$VITE_OPENAI_API_KEY" ]; then
    echo "✅ VITE_OPENAI_API_KEY configurada"
else
    echo "❌ VITE_OPENAI_API_KEY no configurada"
fi

echo ""
echo "📝 Recordatorio:"
echo "- Para desarrollo local: usa el archivo .env"
echo "- Para producción: configura las variables en Vercel Dashboard"
echo "- URL de producción debe apuntar a tu servidor backend real"