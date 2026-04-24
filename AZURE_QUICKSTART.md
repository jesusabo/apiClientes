# ⚡ Azure Web App - Inicio Rápido

## 📦 Archivos Necesarios para Azure (Ya incluidos)

Tu proyecto **YA TIENE** todo lo necesario para Azure:

```
✅ Dockerfile                          # Define el contenedor Docker
✅ .dockerignore                       # Optimiza la imagen
✅ package.json                        # Configuración Node.js
✅ tsconfig.json                       # Configuración TypeScript
✅ AZURE_DEPLOYMENT.md                 # Guía completa paso a paso
✅ .github/workflows/azure-deploy.yml  # CI/CD automático (opcional)
```

---

## 🚀 Despliegue en 3 Pasos Simples

### **Paso 1: Subir a GitHub** (5 minutos)

1. Ve a: https://github.com/new
2. Nombre: `customer-management-api`
3. Click "Create repository"
4. Sube TODA la carpeta arrastrando archivos

### **Paso 2: Crear Recursos en Azure** (5 minutos)

1. **Azure Portal**: https://portal.azure.com
2. **Crear Container Registry**:
   - "Create a resource" → "Container Registry"
   - Registry name: `customerapi` (único)
   - Resource group: `customer-api-rg` (nuevo)
   - Location: East US
   - SKU: Basic
   - Click "Create"

3. **Habilitar Admin en ACR**:
   - Ve a tu Container Registry
   - "Access keys" → Activar "Admin user"
   - **Guarda**: username y password

### **Paso 3: Construir y Desplegar** (5 minutos)

1. **Azure Cloud Shell** (ícono >_ arriba)
2. Ejecuta:

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/customer-management-api.git
cd customer-management-api

# Login en ACR
az acr login --name customerapi

# Construir imagen Docker en Azure
az acr build --registry customerapi --image customer-api:v1 .
```

3. **Crear Web App**:
   - "Create a resource" → "Web App"
   - Name: `customer-management-api`
   - Publish: **Docker Container**
   - OS: **Linux**
   - Region: East US
   - Plan: Free F1
   - Docker:
     - Image Source: **Azure Container Registry**
     - Registry: customerapi
     - Image: customer-api
     - Tag: v1
   - Click "Create"

4. **Configurar Variables**:
   - Web App → "Configuration" → "Application settings"
   - Agregar:
     ```
     NODE_ENV = production
     PORT = 3000
     WEBSITES_PORT = 3000
     ```
   - Click "Save"

---

## ✅ Verificar Funcionamiento

Tu API estará disponible en:
```
https://customer-management-api.azurewebsites.net
```

**Probar endpoints:**

```bash
# Listar clientes
curl https://customer-management-api.azurewebsites.net/customers

# Crear cliente
curl -X POST https://customer-management-api.azurewebsites.net/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","documentNumber":"12345678","email":"juan@test.com","phone":"999888777","address":"Lima"}'

# Agente inteligente
curl -X POST https://customer-management-api.azurewebsites.net/agent \
  -H "Content-Type: application/json" \
  -d '{"message":"registra un cliente llamado María con DNI 87654321"}'
```

---

## 🔄 CI/CD Automático (Opcional)

Si quieres que Azure se actualice automáticamente cada vez que hagas cambios:

1. **En GitHub** → Settings → Secrets → Actions
2. Agregar secrets:
   ```
   REGISTRY_USERNAME: [tu ACR username]
   REGISTRY_PASSWORD: [tu ACR password]
   ```

3. **En Azure Web App** → Deployment Center
4. Descargar "Publish profile"
5. **En GitHub** → Settings → Secrets
6. Agregar:
   ```
   AZURE_WEBAPP_PUBLISH_PROFILE: [contenido del archivo]
   ```

Ahora cada `git push` desplegará automáticamente.

---

## 💰 Costos

- **Container Registry Basic**: $5/mes
- **Web App Free F1**: $0 (gratis, con límites)
- **Web App Basic B1**: $13/mes (sin límites)

**Para testing: Usa Free F1**

---

## 🆘 Problemas Comunes

### "Application Error"
→ Ve a Web App → "Log stream" para ver el error
→ Verifica que WEBSITES_PORT = 3000

### "Container didn't respond"
→ Confirma variables de entorno:
  - PORT = 3000
  - WEBSITES_PORT = 3000
  - NODE_ENV = production

### "ACR authentication failed"
→ Verifica que "Admin user" esté habilitado en ACR

---

## 📚 Documentación Completa

Lee `AZURE_DEPLOYMENT.md` para:
- Métodos alternativos (Docker Hub)
- Configuración avanzada
- Monitoreo y logs
- Seguridad adicional
- Troubleshooting detallado

---

## ✅ Checklist Rápido

- [ ] Código subido a GitHub
- [ ] Azure Container Registry creado
- [ ] Admin user habilitado en ACR
- [ ] Imagen construida con `az acr build`
- [ ] Web App creada (Docker Container, Linux)
- [ ] Variables de entorno configuradas
- [ ] API funcionando en: https://tu-app.azurewebsites.net/customers

---

## 🎯 Resumen

**Lo que tienes:**
- ✅ Dockerfile optimizado
- ✅ Configuración lista para Azure
- ✅ CI/CD con GitHub Actions
- ✅ Documentación completa

**Lo que necesitas hacer:**
1. Subir a GitHub
2. Crear ACR en Azure
3. Construir imagen con `az acr build`
4. Crear Web App
5. Configurar variables

**Tiempo total: 15 minutos**
