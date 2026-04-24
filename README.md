# 🚀 Customer Management API

API REST completa para gestión de clientes con agente inteligente, construida con Node.js, Express.js y TypeScript siguiendo principios de Arquitectura Limpia y SOLID.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Testing](#testing)
- [Endpoints API](#endpoints-api)
- [Agente Inteligente](#agente-inteligente)
- [Despliegue](#despliegue)
- [Documentación](#documentación)

## ✨ Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar clientes
- 🤖 **Agente Inteligente**: Interacción mediante lenguaje natural
- 🏗️ **Arquitectura Limpia**: Separación clara de capas (Domain, Application, Infrastructure)
- 🔒 **Seguridad**: Helmet, CORS, rate limiting, sanitización de inputs
- 🧪 **Testing**: Pruebas unitarias e integración con Jest
- 📝 **Validación**: DTOs con validaciones robustas
- 🐳 **Docker**: Containerización lista para producción
- ☁️ **Cloud Ready**: Configuración para Azure Web App
- 📚 **Documentación**: Arquitectura y diagramas incluidos

## 🏛️ Arquitectura

```
src/
├── services/
│   └── customer/
│       ├── domain/          # Entidades y reglas de negocio
│       ├── application/     # Casos de uso
│       ├── infrastructure/  # Repositorios e implementaciones
│       ├── controllers/     # Controladores HTTP
│       ├── dto/            # Data Transfer Objects
│       └── index.ts        # Entry point del servicio
├── agent/
│   ├── intents/            # Clasificación de intenciones
│   ├── orchestrator/       # Orquestación del agente
│   ├── adapters/           # Adaptadores HTTP
│   └── index.ts           # Entry point del agente
├── shared/
│   └── middleware/         # Middleware compartido
├── config/                 # Configuración
└── server.ts              # Punto de entrada principal
```

## 📦 Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **TypeScript**: v5.0 o superior (instalado automáticamente)

## 🔧 Instalación

1. **Clonar o descargar el proyecto**

```bash
cd customer-management-api
```

2. **Instalar dependencias**

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- Express.js (framework web)
- TypeScript (tipado estático)
- Jest (testing)
- Helmet, CORS, express-rate-limit (seguridad)
- Y todas las dependencias de desarrollo

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

El servidor iniciará en `http://localhost:3000` con hot-reload activado.

### Modo Producción

```bash
# Compilar TypeScript a JavaScript
npm run build

# Ejecutar la versión compilada
npm start
```

### Verificar que el servidor está corriendo

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "environment": "development",
  "timestamp": "2026-04-23T22:00:00.000Z",
  "uptime": 123.456
}
```

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests en modo watch

```bash
npm run test:watch
```

### Ver cobertura de código

```bash
npm run test:coverage
```

### Tests incluidos

- ✅ Tests unitarios de casos de uso
- ✅ Tests de integración de endpoints REST
- ✅ Tests del flujo agente → API

## 📡 Endpoints API

### Base URL

```
http://localhost:3000/api
```

### Customers Endpoints

#### 1. Listar todos los clientes

```http
GET /api/customers
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado (active, inactive)
- `limit` (opcional): Número de resultados (default: 10)
- `offset` (opcional): Paginación (default: 0)

**Respuesta:**
```json
{
  "customers": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Juan Pérez",
      "documentNumber": "12345678",
      "email": "juan@example.com",
      "phone": "987654321",
      "address": "Av. Principal 123",
      "status": "active",
      "createdAt": "2026-04-23T22:00:00.000Z",
      "updatedAt": "2026-04-23T22:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### 2. Obtener cliente por ID

```http
GET /api/customers/:id
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Juan Pérez",
  "documentNumber": "12345678",
  "email": "juan@example.com",
  "phone": "987654321",
  "address": "Av. Principal 123",
  "status": "active",
  "createdAt": "2026-04-23T22:00:00.000Z",
  "updatedAt": "2026-04-23T22:00:00.000Z"
}
```

#### 3. Crear nuevo cliente

```http
POST /api/customers
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "documentNumber": "12345678",
  "email": "juan@example.com",
  "phone": "987654321",
  "address": "Av. Principal 123"
}
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Juan Pérez",
  "documentNumber": "12345678",
  "email": "juan@example.com",
  "phone": "987654321",
  "address": "Av. Principal 123",
  "status": "active",
  "createdAt": "2026-04-23T22:00:00.000Z",
  "updatedAt": "2026-04-23T22:00:00.000Z"
}
```

#### 4. Actualizar cliente

```http
PUT /api/customers/:id
Content-Type: application/json
```

**Body (todos los campos opcionales):**
```json
{
  "name": "Juan Pérez Actualizado",
  "email": "nuevo@example.com",
  "phone": "999888777",
  "address": "Nueva Dirección 456"
}
```

#### 5. Eliminar cliente

```http
DELETE /api/customers/:id
```

**Respuesta:**
```json
{
  "message": "Customer deleted successfully"
}
```

## 🤖 Agente Inteligente

El agente inteligente permite interactuar con el sistema usando lenguaje natural en español.

### Endpoint

```http
POST /api/agent
Content-Type: application/json
```

### Ejemplos de uso

#### Crear un cliente

```json
{
  "input": "Registra un cliente llamado Juan Pérez con DNI 12345678, email juan@example.com, teléfono 987654321 y dirección Av. Principal 123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cliente \"Juan Pérez\" creado exitosamente con ID: 550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "documentNumber": "12345678",
    "email": "juan@example.com",
    "phone": "987654321",
    "address": "Av. Principal 123",
    "status": "active",
    "createdAt": "2026-04-23T22:00:00.000Z",
    "updatedAt": "2026-04-23T22:00:00.000Z"
  },
  "intent": "CREATE_CUSTOMER"
}
```

#### Buscar un cliente

```json
{
  "input": "Busca cliente con id 550e8400-e29b-41d4-a716-446655440000"
}
```

#### Listar clientes

```json
{
  "input": "Lista todos los clientes"
}
```

```json
{
  "input": "Muestra los clientes activos"
}
```

#### Actualizar un cliente

```json
{
  "input": "Actualiza cliente con id 550e8400-e29b-41d4-a716-446655440000 nombre María González"
}
```

#### Eliminar un cliente

```json
{
  "input": "Elimina el cliente con id 550e8400-e29b-41d4-a716-446655440000"
}
```

### Intenciones soportadas

- ✅ `CREATE_CUSTOMER`: Crear nuevo cliente
- ✅ `GET_CUSTOMER`: Obtener cliente específico
- ✅ `LIST_CUSTOMERS`: Listar clientes
- ✅ `UPDATE_CUSTOMER`: Actualizar cliente
- ✅ `DELETE_CUSTOMER`: Eliminar cliente
- ❓ `UNKNOWN`: Intención no reconocida

## 🐳 Docker

### Construir imagen

```bash
docker build -t customer-management-api .
```

### Ejecutar contenedor

```bash
docker run -p 3000:3000 customer-management-api
```

### Docker Compose (próximamente)

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

## ☁️ Despliegue

### Azure Web App

Sigue la guía completa en [AZURE_QUICKSTART.md](./AZURE_QUICKSTART.md)

**Pasos rápidos:**

1. Crear Web App en Azure Portal
2. Configurar CI/CD con GitHub Actions (archivo incluido)
3. Push a rama `main` para desplegar automáticamente

Ver [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) para instrucciones detalladas.

## 📚 Documentación

### Documentación técnica

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagramas de arquitectura y secuencia
- [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) - Guía completa de despliegue en Azure
- [AZURE_QUICKSTART.md](./AZURE_QUICKSTART.md) - Guía rápida de Azure

### Principios aplicados

- ✅ **SOLID**: Responsabilidad única, Open/Closed, Liskov, Segregación de interfaces, Inversión de dependencias
- ✅ **Clean Architecture**: Separación de capas, independencia de frameworks
- ✅ **DRY**: Don't Repeat Yourself
- ✅ **KISS**: Keep It Simple, Stupid
- ✅ **YAGNI**: You Aren't Gonna Need It

### Seguridad (OWASP)

- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **CORS**: Control de acceso entre orígenes
- ✅ **Rate Limiting**: Prevención de ataques DDoS
- ✅ **Input Sanitization**: Prevención de XSS e inyección
- ✅ **Error Handling**: Manejo seguro de errores sin exponer información sensible

## 🛠️ Scripts disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con hot-reload
npm run build        # Compila TypeScript a JavaScript
npm start            # Ejecuta versión compilada

# Testing
npm test             # Ejecuta todos los tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Genera reporte de cobertura

# Linting (si se configura)
npm run lint         # Verifica código
npm run lint:fix     # Corrige problemas automáticamente
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autor

Desarrollado como demostración de arquitectura limpia y buenas prácticas en Node.js/TypeScript.

## 📞 Soporte

Para preguntas o problemas:
- Abre un issue en el repositorio
- Consulta la documentación en la carpeta `/docs`

## 🗺️ Roadmap

- [ ] Integración con base de datos real (MongoDB/PostgreSQL)
- [ ] Autenticación y autorización (JWT)
- [ ] Websockets para notificaciones en tiempo real
- [ ] Integración con servicios externos
- [ ] Dashboard administrativo
- [ ] Métricas y monitoring (Prometheus/Grafana)
- [ ] API Gateway
- [ ] Microservicios

---

**¡Gracias por usar Customer Management API!** 🚀
