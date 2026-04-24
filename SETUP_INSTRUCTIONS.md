# 📥 Instrucciones de Configuración Inicial

## ⚠️ Requisito: Instalar Node.js

Para ejecutar este proyecto, necesitas tener **Node.js** y **npm** instalados en tu sistema.

### 🔧 Instalación de Node.js en Windows

#### Opción 1: Descarga directa (Recomendado)

1. Visita: https://nodejs.org/
2. Descarga la versión **LTS (Long Term Support)** - Recomendada para la mayoría de usuarios
3. Ejecuta el instalador descargado (`.msi`)
4. Sigue el asistente de instalación:
   - ✅ Acepta los términos de licencia
   - ✅ Mantén la ruta de instalación predeterminada
   - ✅ Asegúrate de marcar la opción "Add to PATH"
   - ✅ Opcionalmente, marca "Automatically install necessary tools"
5. Reinicia tu terminal (PowerShell o CMD)

#### Opción 2: Usando Chocolatey (si lo tienes instalado)

```powershell
choco install nodejs-lts
```

#### Opción 3: Usando Winget (Windows Package Manager)

```powershell
winget install OpenJS.NodeJS.LTS
```

### ✅ Verificar la instalación

Abre una **nueva terminal** (PowerShell o CMD) y ejecuta:

```bash
node --version
```

Deberías ver algo como: `v18.x.x` o superior

```bash
npm --version
```

Deberías ver algo como: `v9.x.x` o superior

---

## 🚀 Pasos siguientes (después de instalar Node.js)

Una vez que Node.js esté instalado, sigue estos pasos:

### 1. Abrir una nueva terminal

**Importante:** Cierra y abre una nueva terminal para que los cambios en el PATH surtan efecto.

### 2. Navegar al proyecto

```bash
cd C:\Users\jbringas\Desktop\customer-management-api
```

### 3. Instalar dependencias

```bash
npm install
```

Este comando descargará e instalará todas las dependencias necesarias (~150 MB).

### 4. Compilar el proyecto

```bash
npm run build
```

Este comando compilará TypeScript a JavaScript en la carpeta `dist/`.

### 5. Ejecutar tests

```bash
npm test
```

Verifica que todos los tests pasen correctamente.

### 6. Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en: http://localhost:3000

### 7. Verificar que funciona

Abre tu navegador o usa curl/Postman:

```
GET http://localhost:3000/health
```

Deberías recibir:
```json
{
  "status": "healthy",
  "environment": "development",
  "timestamp": "...",
  "uptime": ...
}
```

---

## 🎯 Comandos rápidos

Una vez configurado, usa estos comandos:

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm run build
npm start

# Testing
npm test
npm run test:watch
npm run test:coverage
```

---

## 🐳 Alternativa: Usar Docker (si tienes Docker instalado)

Si tienes Docker instalado, puedes ejecutar el proyecto sin instalar Node.js:

```bash
# Construir la imagen
docker build -t customer-management-api .

# Ejecutar el contenedor
docker run -p 3000:3000 customer-management-api
```

El servidor estará disponible en: http://localhost:3000

---

## ❓ Solución de problemas

### "npm" no se reconoce como comando

**Solución:** 
1. Asegúrate de haber instalado Node.js
2. Reinicia tu terminal
3. Si el problema persiste, cierra y abre VS Code completamente

### Error de permisos al instalar

**Solución:**
- Ejecuta PowerShell como Administrador
- O usa: `npm install --no-optional`

### Puerto 3000 ya está en uso

**Solución:**
```bash
# Cambiar el puerto (Windows)
$env:PORT=3001; npm run dev

# O editar directamente src/server.ts y cambiar el PORT
```

### Tests fallan

**Solución:**
1. Asegúrate de haber ejecutado `npm install` primero
2. Verifica que la compilación sea exitosa: `npm run build`
3. Revisa los logs de error para más detalles

---

## 📞 Soporte

Si tienes problemas con la instalación:

1. Verifica que Node.js esté correctamente instalado: `node --version`
2. Verifica que npm funcione: `npm --version`
3. Asegúrate de estar en la carpeta correcta del proyecto
4. Consulta la documentación completa en [README.md](./README.md)

---

**Una vez completada la instalación, consulta el [README.md](./README.md) para la documentación completa de la API.**
