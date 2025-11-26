# DynamoDB Local

## 🚀 Desarrollo Local

### 1. Levantar DynamoDB Local
```bash
cd backend
docker-compose up -d
```

Esto iniciará:
- **DynamoDB Local** en `http://localhost:8000`
- **DynamoDB Admin UI** en `http://localhost:8001` (interfaz web para ver datos)

### 2. Crear la tabla
```bash
./init-dynamodb.sh
```

### 3. Configurar variables de entorno
El archivo `.env` ya está configurado para desarrollo local. Si no existe, cópialo desde `.env.example`:
```bash
cp .env.example .env
```

### 4. Verificar que funciona
Abre en tu navegador: **http://localhost:8001**

---

## 📋 Comandos útiles

### Ver todas las tablas
```bash
aws dynamodb list-tables \
  --endpoint-url http://localhost:8000 \
  --region us-east-1
```

### Ver todos los items de la tabla
```bash
aws dynamodb scan \
  --table-name solicitudes-local \
  --endpoint-url http://localhost:8000 \
  --region us-east-1
```

### Insertar un item de prueba
```bash
aws dynamodb put-item \
  --table-name solicitudes-local \
  --item '{
    "id": {"S": "test-123"},
    "name": {"S": "Juan Pérez"},
    "email": {"S": "juan@example.com"},
    "amount": {"N": "5000"},
    "type": {"S": "Préstamo"},
    "comments": {"S": "Solicitud de prueba"},
    "createdAt": {"S": "2025-11-24T18:56:00Z"}
  }' \
  --endpoint-url http://localhost:8000 \
  --region us-east-1
```

### Detener DynamoDB Local
```bash
docker-compose down
```

### Detener y eliminar datos
```bash
docker-compose down -v
rm -rf dynamodb-data
```

---

## 🔧 Configuración del Backend

El backend está configurado para usar DynamoDB Local automáticamente cuando `USE_LOCAL_DYNAMODB=true` en el archivo `.env`.

**Variables de entorno importantes:**
- `USE_LOCAL_DYNAMODB`: `true` para local, `false` o vacío para AWS
- `DYNAMODB_ENDPOINT`: URL de DynamoDB Local (default: `http://localhost:8000`)
- `TABLE_NAME`: Nombre de la tabla (local: `solicitudes-local`, AWS: `Solicitudes`)
- `JWT_SECRET`: Secret para firmar tokens JWT

---

## 🌐 URLs

- **DynamoDB Local**: http://localhost:8000
- **Admin UI**: http://localhost:8001
- **Datos persistentes**: `./dynamodb-data/`

---

## 📦 Estructura

```
backend/
├── docker-compose.yml      # Configuración de Docker
├── init-dynamodb.sh        # Script de inicialización
├── dynamodb-data/          # Datos persistentes (creado automáticamente)
├── .env                    # Variables de entorno (local)
├── .env.example            # Template de variables de entorno
└── README-DYNAMODB.md      # Esta guía
```
