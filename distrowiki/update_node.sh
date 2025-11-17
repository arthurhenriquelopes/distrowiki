#!/bin/bash

# Carregar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar e usar Node 20
echo "Instalando Node 20 LTS..."
nvm install 20
nvm use 20
nvm alias default 20

# Verificar versões
echo ""
echo "Versões instaladas:"
node -v
npm -v

echo ""
echo "✅ Node atualizado com sucesso!"
echo "Execute agora: npm install && npm run dev"
