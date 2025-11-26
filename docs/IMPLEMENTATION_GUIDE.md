# Guía de Implementación y Lectura del Código

Este documento sirve como guía para entender qué se hizo en el proyecto y cómo está estructurado el código.

## 1. Estructura del Proyecto

El proyecto está dividido en tres carpetas principales para mantener una separación clara de responsabilidades:

- **`/backend`**: Contiene la lógica del servidor (AWS Lambda) escrita en Node.js y TypeScript.
- **`/frontend`**: Contiene la aplicación web (React) escrita con Vite y TypeScript.
- **`/terraform`**: Contiene la configuración de Infraestructura como Código (IaC) para desplegar todo en AWS.

---

## 2. Backend (`/backend`)

El backend es "Serverless", lo que significa que no hay un servidor Express corriendo todo el tiempo. En su lugar, usamos una función **AWS Lambda** que se despierta cuando recibe una petición.

- **`src/index.ts`**: Es el punto de entrada.
  - La función `handler` recibe un `event` de API Gateway.
  - Analiza el método HTTP (`GET` o `POST`) y la ruta (`/solicitudes`).
  - **POST**: Crea una nueva solicitud. Genera un ID único (uuid) y guarda el objeto en DynamoDB.
  - **GET**: Lista todas las solicitudes. Verifica que exista el header `Authorization` para seguridad básica.
- **`package.json`**: Incluye un script `build` que usa `esbuild`. Esto es importante porque AWS Lambda necesita un archivo JavaScript empaquetado, no TypeScript suelto.

## 3. Frontend (`/frontend`)

Una aplicación React moderna creada con Vite.

- **`src/api.ts`**: Configuración de `axios`.
  - Lee la URL de la API de las variables de entorno (`VITE_API_URL`).
  - Tiene un "interceptor" que agrega automáticamente el token de administrador si el usuario está logueado.
- **`src/pages/`**:
  - **`FormPage.tsx`**: Formulario público. Envía datos al backend.
  - **`LoginPage.tsx`**: Simula un login guardando un token en `localStorage`.
  - **`AdminPage.tsx`**: Panel protegido. Carga las solicitudes desde el backend.
- **`src/App.tsx`**: Configura las rutas (`/`, `/login`, `/admin`).

## 4. Infraestructura (`/terraform`)

Aquí es donde ocurre la magia de AWS sin tocar la consola web.

- **`main.tf`**: Configuración general y provider de AWS.
- **`backend.tf`**:
  - `aws_dynamodb_table`: Crea la tabla "Solicitudes".
  - `aws_lambda_function`: Sube el código de `backend/dist` a AWS.
  - `aws_apigatewayv2_api`: Crea la URL pública que conecta internet con tu Lambda.
- **`frontend.tf`**:
  - `aws_s3_bucket`: Un "disco" en la nube para guardar tus archivos HTML/JS/CSS.
  - `aws_cloudfront_distribution`: Una red de entrega (CDN) para que tu web cargue rápido y tenga HTTPS.

---

## Resumen del Flujo de Datos

1. El usuario entra a la web (CloudFront -> S3).
2. Llena el formulario y da click en "Enviar".
3. El Frontend hace un `POST` a la URL de API Gateway.
4. API Gateway despierta a la Lambda.
5. La Lambda guarda los datos en DynamoDB.
6. (Para Admin) El admin entra, la Lambda lee de DynamoDB y devuelve los datos.
