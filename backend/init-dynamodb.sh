#!/bin/bash

# Script para inicializar DynamoDB Local con la tabla de solicitudes

echo "🚀 Esperando a que DynamoDB Local esté listo..."
sleep 3

TABLE_NAME="solicitudes-local"
ENDPOINT="http://localhost:8000"

echo "🔍 Verificando si la tabla '$TABLE_NAME' ya existe..."

# Check if table exists
TABLE_EXISTS=$(aws dynamodb list-tables \
  --endpoint-url $ENDPOINT \
  --region us-east-1 \
  --no-cli-pager \
  --output json | grep -c "$TABLE_NAME")

if [ "$TABLE_EXISTS" -gt 0 ]; then
  echo "✅ La tabla '$TABLE_NAME' ya existe!"
else
  echo "📦 Creando tabla '$TABLE_NAME'..."
  
  aws dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url $ENDPOINT \
    --region us-east-1 \
    --no-cli-pager

  if [ $? -eq 0 ]; then
    echo "✅ Tabla '$TABLE_NAME' creada exitosamente!"
  else
    echo "⚠️  Error al crear la tabla"
    exit 1
  fi
fi

echo ""
echo "📊 Puedes ver la tabla en:"
echo "   - DynamoDB Admin UI: http://localhost:8001"
echo "   - AWS CLI: aws dynamodb scan --table-name $TABLE_NAME --endpoint-url $ENDPOINT"

echo ""
echo "🔍 Listando tablas disponibles:"
aws dynamodb list-tables \
  --endpoint-url $ENDPOINT \
  --region us-east-1 \
  --no-cli-pager
