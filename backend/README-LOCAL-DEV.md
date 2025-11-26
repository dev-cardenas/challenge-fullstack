# Desarrollo Local del Backend

## 🚀 Opciones para ejecutar el backend localmente

El backend está diseñado para **AWS Lambda**, no como servidor tradicional. Aquí están tus opciones:

---

## ✅ Opción 1: AWS SAM Local (Recomendado)

### Instalación de SAM CLI

**macOS:**
```bash
brew install aws-sam-cli
```

**Verificar instalación:**
```bash
sam --version
```

### Ejecutar el backend localmente

```bash
# 1. Asegúrate de que DynamoDB Local esté corriendo
docker-compose up -d

# 2. Ejecutar SAM Local
pnpm run sam:start
```

Esto iniciará:
- **API Gateway local** en `http://localhost:3001`
- **Lambda ejecutándose** en contenedor Docker
- **Conectado a DynamoDB Local** en puerto 8000

### Probar los endpoints

```bash
# Login
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Crear solicitud
curl -X POST http://localhost:3001/solicitudes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "monto": 1000,
    "tipo": "Préstamo",
    "comentarios": "Test"
  }'

# Listar solicitudes (requiere JWT)
curl http://localhost:3001/solicitudes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```


## 🔗 Conectar el frontend

Una vez que SAM Local esté corriendo en `http://localhost:3001`, actualiza el frontend:

```bash
# frontend/.env
VITE_API_URL=http://localhost:3001
```

Luego reinicia el frontend:
```bash
cd frontend
pnpm run dev
```

¡Y listo! Frontend + Backend + DynamoDB todo local 🎉
