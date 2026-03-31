#!/bin/bash

# Script para limpiar el historial de Git de referencias a Claude Code
# Esto crea una rama limpia que puedes pushear a GitHub
# Tu rama local original (main) permanece intacta

set -e

echo "=== Limpieza de historial Git para GitHub ==="
echo ""

# Guardar la rama actual
CURRENT_BRANCH=$(git branch --show-current)
echo "Rama actual: $CURRENT_BRANCH"

# Nombre de la rama limpia
CLEAN_BRANCH="clean-for-github"

# Verificar si ya existe la rama limpia
if git show-ref --verify --quiet refs/heads/$CLEAN_BRANCH; then
    echo "La rama $CLEAN_BRANCH ya existe. Eliminándola..."
    git branch -D $CLEAN_BRANCH
fi

# Crear rama limpia desde la actual
echo "Creando rama limpia: $CLEAN_BRANCH"
git checkout -b $CLEAN_BRANCH

# Backup del directorio .git-rewrite si existe
if [ -d ".git-rewrite" ]; then
    rm -rf .git-rewrite
fi

echo ""
echo "Reescribiendo commits para eliminar referencias a Claude Code..."
echo ""

# Usar filter-branch para reescribir los mensajes de commit
git filter-branch -f --msg-filter '
sed -e "/🤖 Generated with \[Claude Code\]/d" \
    -e "/Co-Authored-By: Claude/d" \
    -e "/^[[:space:]]*$/d" | \
sed -e :a -e "/^\n*$/{$d;N;ba;}"
' -- --all

echo ""
echo "=== Limpieza completada ==="
echo ""
echo "La rama '$CLEAN_BRANCH' contiene el historial limpio."
echo ""
echo "Para subir a GitHub, ejecuta:"
echo "  git push -f origin $CLEAN_BRANCH:main"
echo ""
echo "Para volver a tu rama original:"
echo "  git checkout $CURRENT_BRANCH"
echo ""
echo "IMPORTANTE: Tu rama '$CURRENT_BRANCH' local permanece intacta."
