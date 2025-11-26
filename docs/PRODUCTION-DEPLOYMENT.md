# Guía de Despliegue en Producción

## 🔐 Mejoras de Seguridad Implementadas

Este proyecto ahora usa AWS Secrets Manager para secretos JWT y configuración CORS adecuada para producción.

---

## 📋 Prerrequisitos

1. **AWS CLI configurado** con credenciales apropiadas
2. **Terraform instalado** (v1.0+)
3. **Node.js 18+** y pnpm instalados
4. **Backend compilado**: Ejecutar `pnpm run build` en `/backend`

---

## 🚀 Pasos de Despliegue

### 1. Compilar el Backend

```bash
cd backend
pnpm install
pnpm run build
```

Esto crea `dist/index.js` que Terraform empaquetará.

### 2. Configurar el Secreto JWT

Tienes dos opciones:

#### Opción A: Usar el valor por defecto (solo para pruebas)
```bash
cd terraform
terraform init
terraform apply
```

El secreto JWT por defecto es: `change-this-in-production-use-secrets-manager`

#### Opción B: Usar secreto personalizado (recomendado)
```bash
cd terraform
terraform init
terraform apply -var="jwt_secret=TU_SECRETO_SUPER_SEGURO_AQUI"
```

**Generar un secreto seguro:**
```bash
openssl rand -base64 32
```

### 3. Desplegar la Infraestructura

```bash
terraform apply
```

Revisa el plan y escribe `yes` para confirmar.

### 4. Anotar las Salidas

Después del despliegue, Terraform mostrará:

```
api_endpoint = "https://xxxxxx.execute-api.us-east-1.amazonaws.com"
cloudfront_url = "https://xxxxxx.cloudfront.net"
website_url = "xxxxxx.cloudfront.net"
s3_bucket_name = "your-project-frontend-bucket"
```

### 5. Compilar y Subir el Frontend

```bash
cd frontend

# Crear .env.production con el endpoint de la API
echo "VITE_API_URL=<api_endpoint_from_terraform>" > .env.production

# Compilar el frontend
pnpm run build

# Subir a S3
aws s3 sync dist/ s3://<s3_bucket_name_from_terraform> --delete
```

### 6. Invalidar el Caché de CloudFront

```bash
# Obtener el ID de distribución de CloudFront
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items[0]=='<website_url>'].Id" \
  --output text)

# Crear invalidación
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🔒 Características de Seguridad

### 1. **AWS Secrets Manager**
- Secreto JWT almacenado de forma segura en Secrets Manager
- Lambda tiene permisos IAM para leer el secreto
- El secreto se cachea en Lambda para rendimiento
- Ventana de recuperación de 7 días si se elimina accidentalmente

### 2. **Configuración CORS**
- Headers CORS apropiados en API Gateway
- Soporta header `Authorization` para JWT
- Solicitudes preflight (OPTIONS) manejadas correctamente
- Caché de 24 horas para preflight CORS

### 3. **Políticas IAM**
- Lambda tiene permisos mínimos:
  - Lectura/Escritura solo a la tabla DynamoDB
  - Lectura del secreto JWT solo desde Secrets Manager
  - CloudWatch Logs para debugging

---

## 🔧 Configuración Post-Despliegue

### Actualizar CORS para Producción (Recomendado)

Por defecto, CORS permite todos los orígenes (`*`). Para producción, restringe esto:

1. Editar `terraform/backend.tf`:
```hcl
cors_configuration {
  allow_origins = ["https://tu-dominio-cloudfront.cloudfront.net"]
  # ... resto de la configuración
}
```

2. Aplicar cambios:
```bash
terraform apply
```

### Rotar el Secreto JWT

Para rotar el secreto JWT:

```bash
# Actualizar el secreto en Secrets Manager
aws secretsmanager update-secret \
  --secret-id your-project-jwt-secret \
  --secret-string "NUEVO_SECRETO_AQUI"

# Reiniciar Lambda (obtendrá el nuevo secreto en el próximo cold start)
aws lambda update-function-configuration \
  --function-name your-project-api \
  --environment Variables={FORCE_RESTART=true}
```

---

## 📊 Monitoreo

### Ver Logs de Lambda

```bash
aws logs tail /aws/lambda/your-project-api --follow
```

### Ver Items de DynamoDB

```bash
aws dynamodb scan \
  --table-name your-project-solicitudes \
  --region us-east-1
```

### Verificar Valor del Secreto (para debugging)

```bash
aws secretsmanager get-secret-value \
  --secret-id your-project-jwt-secret \
  --query SecretString \
  --output text
```

---

## 🧹 Limpieza

Para destruir todos los recursos:

```bash
cd terraform
terraform destroy
```

**Advertencia:** Esto eliminará:
- Tabla DynamoDB (y todos los datos)
- Bucket S3 (y todos los archivos)
- Distribución CloudFront
- Función Lambda
- API Gateway
- Secreto de Secrets Manager (después de ventana de recuperación de 7 días)

---

## 🐛 Solución de Problemas

### Errores CORS

**Síntoma:** El navegador muestra error CORS al llamar a la API

**Soluciones:**
1. Verificar que la configuración CORS de API Gateway incluye el header `authorization`
2. Verificar que la URL de CloudFront está en `allow_origins` (si está restringido)
3. Revisar la consola del navegador para detalles específicos del error CORS

### Errores JWT

**Síntoma:** Login retorna 401 o la verificación del token falla

**Soluciones:**
1. Verificar que el secreto JWT está configurado correctamente en Secrets Manager
2. Verificar que Lambda tiene permisos para leer el secreto
3. Ver logs de Lambda para errores de verificación JWT

### Errores DynamoDB

**Síntoma:** Errores 500 al crear/leer solicitudes

**Soluciones:**
1. Verificar que Lambda tiene permisos DynamoDB
2. Verificar que el nombre de la tabla coincide en Terraform y variables de entorno de Lambda
3. Ver logs de Lambda para errores de DynamoDB

---

## 📝 Variables de Entorno

### Variables de Entorno de Lambda (configuradas por Terraform)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `TABLE_NAME` | Nombre de la tabla DynamoDB | `my-project-solicitudes` |
| `JWT_SECRET_ARN` | ARN del secreto JWT en Secrets Manager | `arn:aws:secretsmanager:...` |

### Variables de Entorno del Frontend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | Endpoint de API Gateway | `https://xxx.execute-api.us-east-1.amazonaws.com` |

---

## ✅ Lista de Verificación

Después del despliegue, verificar:

- [ ] El frontend carga en la URL de CloudFront
- [ ] Se puede enviar el formulario (POST /solicitudes)
- [ ] Se puede iniciar sesión con admin/admin123
- [ ] Se pueden ver solicitudes en el panel de admin (GET /solicitudes)
- [ ] El token JWT se almacena en localStorage
- [ ] Logout limpia el JWT y redirige al login
- [ ] CORS funciona desde el dominio de CloudFront
- [ ] Los logs de Lambda no muestran errores
- [ ] La tabla DynamoDB contiene los datos enviados
