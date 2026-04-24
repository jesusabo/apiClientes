# 🔷 Despliegue en Azure Web App con Docker

Esta guía te muestra cómo desplegar la API de Customer Management en Azure Web App usando el contenedor Docker.

---

## 📋 Requisitos Previos

- Cuenta de Azure (https://azure.microsoft.com/free/)
- El código debe estar en un repositorio (GitHub, Azure DevOps, o Bitbucket)
- O tener el Dockerfile listo para subir a Azure Container Registry

---

## 🎯 Método 1: Despliegue con Azure Container Registry (RECOMENDADO)

Este método usa Azure Container Registry (ACR) para almacenar tu imagen Docker.

### Paso 1: Subir código a GitHub

1. Crea un repositorio en GitHub
2. Sube todo el proyecto `customer-management-api`

### Paso 2: Crear Azure Container Registry

1. **En Azure Portal** (https://portal.azure.com)
2. Click en "Create a resource"
3. Busca "Container Registry"
4. Click "Create"

**Configuración:**
```
- Registry name: customerapi (debe ser único)
- Subscription: Tu suscripción
- Resource group: Crear nuevo → "customer-api-rg"
- Location: East US (o el más cercano)
- SKU: Basic (gratis para comenzar)
```

5. Click "Review + create" → "Create"
6. Espera 1-2 minutos

### Paso 3: Habilitar Admin User en ACR

1. Ve a tu Container Registry creado
2. En el menú izquierdo → "Access keys"
3. Activa "Admin user"
4. **Copia y guarda:**
   - Login server: `customerapi.azurecr.io`
   - Username: `customerapi`
   - Password: `[tu-password]`

### Paso 4: Construir y Subir Imagen desde Azure Cloud Shell

1. En Azure Portal, click en el ícono de Cloud Shell (>_) arriba a la derecha
2. Selecciona "Bash"
3. Ejecuta estos comandos:

```bash
# Clonar tu repositorio
git clone https://github.com/TU_USUARIO/customer-management-api.git
cd customer-management-api

# Login en ACR
az acr login --name customerapi

# Construir imagen
az acr build --registry customerapi --image customer-api:v1 .
```

**Esto construye tu Docker image directamente en Azure, sin necesidad de Docker local.**

### Paso 5: Crear Azure Web App

1. En Azure Portal → "Create a resource"
2. Busca "Web App"
3. Click "Create"

**Configuración:**
```
Basics:
- Resource group: customer-api-rg (usar existente)
- Name: customer-management-api (debe ser único)
- Publish: Docker Container
- Operating System: Linux
- Region: East US
- Pricing plan: Free F1 (para pruebas)

Docker:
- Options: Single Container
- Image Source: Azure Container Registry
- Registry: customerapi
- Image: customer-api
- Tag: v1
```

4. Click "Review + create" → "Create"
5. Espera 2-3 minutos

### Paso 6: Configurar Variables de Entorno

1. Ve a tu Web App creada
2. En el menú izquierdo → "Configuration"
3. Click "New application setting"

Agregar:
```
NODE_ENV = production
PORT = 3000
WEBSITES_PORT = 3000
```

4. Click "Save" arriba
5. Click "Continue" cuando pregunte sobre restart

### Paso 7: Verificar Despliegue

1. En tu Web App → "Overview"
2. Copia la URL: `https://customer-management-api.azurewebsites.net`
3. Abre en navegador: `https://customer-management-api.azurewebsites.net/customers`

---

## 🎯 Método 2: Despliegue desde Docker Hub (Alternativo)

Si prefieres usar Docker Hub en lugar de Azure Container Registry:

### Paso 1: Construir imagen en Azure Cloud Shell

```bash
# En Azure Cloud Shell
git clone https://github.com/TU_USUARIO/customer-management-api.git
cd customer-management-api

# Login en Docker Hub
docker login -u TU_USUARIO_DOCKERHUB

# Construir imagen
docker build -t TU_USUARIO_DOCKERHUB/customer-api:v1 .

# Subir a Docker Hub
docker push TU_USUARIO_DOCKERHUB/customer-api:v1
```

### Paso 2: Crear Web App

En la configuración Docker, selecciona:
```
- Image Source: Docker Hub
- Access Type: Public
- Image and tag: TU_USUARIO_DOCKERHUB/customer-api:v1
```

---

## 🎯 Método 3: Despliegue Continuo con GitHub Actions

Automatiza el despliegue cada vez que hagas push a GitHub.

### Paso 1: Crear archivo de workflow

Crea `.github/workflows/azure-deploy.yml` en tu repositorio:

```yaml
name: Deploy to Azure Web App

on:
  push:
    branches: [ main ]

env:
  AZURE_WEBAPP_NAME: customer-management-api

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Log in to Azure Container Registry
      uses: azure/docker-login@v1
      with:
        login-server: customerapi.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - name: Build and push image
      run: |
        docker build -t customerapi.azurecr.io/customer-api:${{ github.sha }} .
        docker push customerapi.azurecr.io/customer-api:${{ github.sha }}
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        images: customerapi.azurecr.io/customer-api:${{ github.sha }}
```

### Paso 2: Configurar Secrets en GitHub

En tu repositorio GitHub:
1. Settings → Secrets and variables → Actions
2. Click "New repository secret"

Agregar:
```
REGISTRY_USERNAME: [tu ACR username]
REGISTRY_PASSWORD: [tu ACR password]
```

Ahora cada push a `main` desplegará automáticamente.

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

1. En tu Web App → "Log stream"
2. O usa Azure CLI:

```bash
az webapp log tail --name customer-management-api --resource-group customer-api-rg
```

### Configurar Application Insights (Opcional)

1. En tu Web App → "Application Insights"
2. Click "Turn on Application Insights"
3. Monitorea performance, errores, requests

---

## 🔧 Comandos Útiles Azure CLI

Si instalas Azure CLI localmente (opcional):

```bash
# Login
az login

# Ver Web Apps
az webapp list --output table

# Restart Web App
az webapp restart --name customer-management-api --resource-group customer-api-rg

# Ver logs
az webapp log tail --name customer-management-api --resource-group customer-api-rg

# Scale up (cambiar plan)
az appservice plan update --name <plan-name> --resource-group customer-api-rg --sku B1
```

---

## 💰 Costos Azure

### Free Tier (F1)
- ✅ Gratis
- ⚠️ 60 minutos CPU/día
- ⚠️ 1 GB RAM
- ✅ Suficiente para testing

### Basic Tier (B1)
- 💵 ~$13 USD/mes
- ✅ 1.75 GB RAM
- ✅ Sin límites CPU
- ✅ Custom domains

### Container Registry
- Basic: $5 USD/mes
- ✅ 10 GB storage
- ✅ Suficiente para varios proyectos

---

## 🧪 Probar la API Desplegada

```bash
# Listar clientes
curl https://customer-management-api.azurewebsites.net/customers

# Crear cliente
curl -X POST https://customer-management-api.azurewebsites.net/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "documentNumber": "12345678",
    "email": "juan@example.com",
    "phone": "999888777",
    "address": "Av. Principal 123"
  }'

# Agente inteligente
curl -X POST https://customer-management-api.azurewebsites.net/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "registra un cliente llamado María"
  }'
```

---

## 🔐 Seguridad Adicional para Azure

### 1. Restringir IPs (Opcional)

En Web App → "Networking" → "Access restriction"

### 2. Enable HTTPS Only

En Web App → "TLS/SSL settings" → "HTTPS Only" → ON

### 3. Agregar Variables de Entorno Seguras

En "Configuration" → "Application settings"

---

## 🚀 Resumen Rápido: Despliegue en 10 minutos

```
1. Crear Azure Container Registry (2 min)
2. Habilitar Admin User y copiar credenciales (1 min)
3. Usar Azure Cloud Shell para construir imagen (3 min)
4. Crear Web App con imagen de ACR (2 min)
5. Configurar PORT=3000 y WEBSITES_PORT=3000 (1 min)
6. Verificar URL: https://tu-app.azurewebsites.net/customers (1 min)
```

---

## ✅ Checklist de Despliegue

- [ ] Cuenta de Azure creada
- [ ] Código subido a GitHub
- [ ] Azure Container Registry creado
- [ ] Admin user habilitado en ACR
- [ ] Imagen construida con `az acr build`
- [ ] Web App creada con Docker
- [ ] Variables de entorno configuradas (PORT, WEBSITES_PORT, NODE_ENV)
- [ ] URL funcionando
- [ ] API probada con curl o Postman

---

## 🆘 Troubleshooting

### Error: "Application Error"

**Solución:**
1. Verifica logs: Web App → "Log stream"
2. Confirma WEBSITES_PORT=3000 en Configuration
3. Confirma que imagen se construyó correctamente

### Error: "Container didn't respond"

**Solución:**
1. En Configuration, verifica:
   ```
   WEBSITES_PORT = 3000
   PORT = 3000
   ```
2. Restart Web App

### Error: "ACR authentication failed"

**Solución:**
1. Ve a ACR → "Access keys"
2. Confirma que "Admin user" está habilitado
3. Recrea Web App con credenciales correctas

---

## 📞 Recursos Adicionales

- Azure Portal: https://portal.azure.com
- Azure Documentation: https://docs.microsoft.com/azure
- Azure Free Account: https://azure.microsoft.com/free/
- Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli

---

## 🎓 Resultado Final

Después de seguir esta guía tendrás:

- ✅ API corriendo en Azure Web App
- ✅ Docker container gestionado por Azure
- ✅ URL pública con HTTPS automático
- ✅ Logs y monitoreo en Azure Portal
- ✅ Escalabilidad según demanda
- ✅ Integración con Azure services
- ✅ Sin necesidad de Node.js o Docker local

**Tu API estará disponible 24/7 en: `https://customer-management-api.azurewebsites.net`**
