#!/bin/bash

echo "🔍 Verificando configuración de API en producción..."
echo ""

# Verificar VITE_API_URL
if [ -n "$VITE_API_URL" ]; then
    echo "✅ VITE_API_URL configurada: $VITE_API_URL"

    # Verificar si es localhost (problema)
    if [[ $VITE_API_URL == *"localhost"* ]]; then
        echo "❌ ERROR: VITE_API_URL apunta a localhost - esto no funciona en producción!"
        echo "   Necesitas configurar la URL real de tu backend en Vercel Dashboard"
    else
        echo "✅ VITE_API_URL parece correcta (no es localhost)"
    fi
else
    echo "❌ VITE_API_URL no configurada - usando fallback localhost"
fi

echo ""
echo "📋 Checklist para producción:"
echo "□ Configurar VITE_API_URL en Vercel Dashboard"
echo "□ Verificar que el backend esté corriendo"
echo "□ Configurar CORS en el backend"
echo "□ Redeploy en Vercel"
echo "□ Probar evaluaciones y cursos"

echo ""
echo "🔗 URL de Vercel Dashboard:"
echo "https://vercel.com/dashboard → Tu proyecto → Settings → Environment Variables"