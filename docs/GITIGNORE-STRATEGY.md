# Git Ignore Configuration

## Estrategia Implementada

He creado una estrategia de `.gitignore` en **múltiples niveles**:

1. **Root `.gitignore`** - Archivos generales del proyecto
2. **Backend `.gitignore`** - Específico para Node.js/Lambda
3. **Frontend `.gitignore`** - Específico para Vite/React
4. **Terraform `.gitignore`** - Específico para infraestructura

---

## Archivos que NO se suben a GitHub

### 🔒 Archivos Sensibles (CRÍTICO)

#### Root
- `.env`, `.env.local`, `.env.*.local` - Variables de entorno con secretos
- `*.bkp`, `*.backup` - Archivos de respaldo que pueden contener datos sensibles

#### Backend
- `.env` - Contiene `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`
- `dynamodb-data/` - Datos locales de DynamoDB

#### Terraform
- `*.tfstate`, `*.tfstate.backup` - **Estado de Terraform** (contiene IDs de recursos, ARNs, etc.)
- `*.tfvars` - Variables que pueden contener secretos
- `lambda.zip` - Paquete de despliegue (se genera automáticamente)

### 📦 Dependencias y Build Artifacts

- `node_modules/` - Dependencias de Node.js (se reinstalan con `pnpm install`)
- `dist/` - Código compilado (se regenera con `pnpm build`)
- `.terraform/` - Plugins y módulos de Terraform (se reinstalan con `terraform init`)
- `.terraform.lock.hcl` - Lock file de Terraform (opcional, algunos lo commitean)

### 🧪 Test Coverage

- `coverage/` - Reportes de cobertura de tests
- `.nyc_output/` - Datos de cobertura de NYC

### 💻 IDE y Sistema Operativo

- `.vscode/`, `.idea/` - Configuraciones de IDEs
- `.DS_Store` - Archivos de macOS
- `Thumbs.db` - Archivos de Windows
- `*.log` - Archivos de log

---

## Archivos que SÍ se suben

### ✅ Código Fuente
- Todo el código en `src/`
- Archivos de configuración: `package.json`, `tsconfig.json`, etc.
- Tests: `*.test.ts`, `*.test.tsx`

### ✅ Configuración de Infraestructura
- `terraform/*.tf` - Definiciones de infraestructura
- `backend/template.yaml` - Configuración de SAM (si se usa)

### ✅ Documentación
- `README.md`
- `docs/*.md`
- `.env.example` - Ejemplo de variables de entorno (SIN valores reales)

### ✅ Archivos de Lock
- `pnpm-lock.yaml` - Para reproducibilidad de dependencias
- `package-lock.json` o `yarn.lock` (si se usan)

---

## ⚠️ Archivos Actuales que DEBERÍAN Eliminarse

Estos archivos están actualmente en el proyecto pero NO deberían subirse a GitHub:

### Terraform
- `terraform.tfstate` - **CRÍTICO**: Contiene IDs de recursos AWS
- `terraform.tfstate.backup` - Backup del estado
- `lambda.zip` - Paquete compilado
- `.terraform/` - Directorio de plugins

### Backend
- `backend/.env` - Si contiene valores reales
- `backend/dynamodb-data/` - Datos locales

### Frontend  
- `frontend/.env` - Si contiene valores reales
- `frontend/dist/` - Build de producción

---

## 🔧 Comandos para Limpiar

Para eliminar archivos que ya están trackeados por Git pero ahora están en `.gitignore`:

```bash
# Eliminar del tracking de Git (pero mantener localmente)
git rm --cached terraform/terraform.tfstate
git rm --cached terraform/terraform.tfstate.backup
git rm --cached terraform/lambda.zip
git rm -r --cached terraform/.terraform
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit los cambios
git add .gitignore backend/.gitignore frontend/.gitignore terraform/.gitignore
git commit -m "chore: add comprehensive .gitignore files"
```

---

## 📝 Recomendaciones

1. **Nunca commitear archivos `.env`** con valores reales
2. **Siempre incluir `.env.example`** con las variables necesarias pero sin valores
3. **Terraform state** debería estar en S3 con locking en DynamoDB (para equipos)
4. **Secrets** deben estar en AWS Secrets Manager, no en código
5. **Revisar antes de cada commit** con `git status` para verificar que no se suben archivos sensibles
