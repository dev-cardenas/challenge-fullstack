# Guía de Despliegue y Ejecución

Sigue estos pasos para llevar la aplicación a producción en AWS.

## Prerrequisitos

Asegúrate de tener instalado:

1. **Node.js** (v18 o superior)
2. **Terraform**
3. **AWS CLI** configurado.

### ¿Cómo configuro las credenciales de AWS? (DynamoDB, Lambda, etc.)

Para que Terraform pueda crear recursos y tu código local pueda funcionar, necesitas credenciales.

1. Ve a la consola de AWS -> IAM -> Users -> Security credentials -> Create access key.
2. Obtendrás un `Access Key ID` y un `Secret Access Key`.
3. En tu terminal, ejecuta:

   ```bash
   aws configure
   ```

4. Pega tus llaves y elige la región `us-east-1` (o la que prefieras).

---

## Paso 1: Construir el Backend

Antes de desplegar, necesitamos convertir el TypeScript a JavaScript.

```bash
cd backend
npm install
npm run build
```

Esto creará una carpeta `dist` con un archivo `index.js`.

---

## Paso 2: Desplegar Infraestructura (Terraform)

Ahora crearemos los recursos en la nube.

```bash
cd ../terraform
terraform init
terraform apply
```

Escribe `yes` cuando te pregunte.
Al finalizar, Terraform te mostrará algo como:

```
Outputs:

api_endpoint = "https://xyz.execute-api.us-east-1.amazonaws.com"
s3_bucket_name = "fullstack-challenge-frontend-..."
website_url = "d12345.cloudfront.net"
```

**¡Guarda estos valores!** Los necesitarás.

---

## Paso 3: Configurar y Construir Frontend

1. Ve a la carpeta `frontend`.
2. Crea un archivo `.env` (o `.env.local`) basado en el output de Terraform:

   ```env
   VITE_API_URL=https://xyz.execute-api.us-east-1.amazonaws.com
   ```

   _(Asegúrate de usar la URL que te dio Terraform en `api_endpoint`)_

3. Instala dependencias y construye el proyecto:

   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

---

## Paso 4: Subir Frontend a AWS

Ahora subiremos los archivos generados (`frontend/dist`) al bucket S3 que creó Terraform.

```bash
# Reemplaza EL_NOMBRE_DE_TU_BUCKET con el valor de 's3_bucket_name' del paso 2
aws s3 sync dist/ s3://EL_NOMBRE_DE_TU_BUCKET
```

---

## ¡Listo

Ahora puedes acceder a tu aplicación usando la `website_url` (CloudFront) que te dio Terraform.

- **Público**: `https://d12345.cloudfront.net/`
- **Admin**: `https://d12345.cloudfront.net/login` (Usa el token: `secret-admin-token`)

---

## Ejecución Local (Desarrollo)

Si quieres probar cambios en el frontend sin desplegar a cada rato:

1. Asegúrate de que el Backend ya esté desplegado (Paso 1 y 2).
2. En `frontend/.env`, pon la URL de la API desplegada.
3. Corre:

   ```bash
   npm run dev
   ```

4. Abre `http://localhost:5173`.
