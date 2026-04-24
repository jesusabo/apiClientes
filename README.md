# Customer Management API

Complete backend system for customer management with REST API, Clean Architecture, intelligent agent, and comprehensive testing.

## 🎯 Project Overview

This system provides a robust backend for managing customers with the following capabilities:

- **CRUD Operations**: Create, Read, Update, and Delete customers via REST API
- **Clean Architecture**: Clear separation of concerns (Domain, Application, Infrastructure)
- **Intelligent Agent**: Natural language interface for system interaction
- **Security**: Helmet, CORS, rate limiting, and input sanitization
- **Testing**: Comprehensive unit and integration tests
- **SOLID Principles**: Maintainable and extensible codebase

## 📁 Project Structure

```
customer-management-api/
├── src/
│   ├── services/
│   │   └── customer/
│   │       ├── controllers/          # REST endpoint handlers
│   │       ├── domain/                # Business entities and rules
│   │       ├── application/           # Use cases (business logic)
│   │       ├── infrastructure/        # Data persistence
│   │       └── dto/                   # Data transfer objects
│   ├── agent/
│   │   ├── intents/                   # Natural language intent detection
│   │   ├── orchestrator/              # Agent workflow management
│   │   └── adapters/                  # Agent API interface
│   ├── shared/
│   │   └── middleware/                # Security and common middleware
│   ├── config/                        # Configuration files
│   └── server.ts                      # Application entry point
├── tests/
│   ├── unit/                          # Unit tests
│   └── integration/                   # Integration tests
├── package.json
├── tsconfig.json
└── jest.config.js
```

## 🏗️ Architecture

### Clean Architecture Layers

1. **Domain Layer** (`domain/`)
   - Pure business logic
   - No external dependencies
   - Contains entities and repository interfaces

2. **Application Layer** (`application/`)
   - Use cases (business workflows)
   - Coordinates domain objects
   - Independent of frameworks

3. **Infrastructure Layer** (`infrastructure/`)
   - External dependencies (database, APIs)
   - Repository implementations
   - Framework-specific code

4. **Interface Layer** (`controllers/`)
   - REST API endpoints
   - Request/response handling
   - Connects HTTP to use cases

## 📊 Data Model

### Customer Entity

```typescript
{
  id: string;              // Unique identifier (UUID)
  name: string;            // Customer full name
  documentNumber: string;  // National ID or document
  email: string;           // Email address (unique)
  phone: string;           // Phone number
  address: string;         // Physical address
  status: string;          // 'active' | 'inactive'
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Business Rules

- Name: Required, 2-100 characters
- Document Number: Required, unique, 8-20 characters
- Email: Required, unique, valid format
- Phone: Required, 7-20 characters
- Address: Required
- Status: Auto-set to 'active' on creation
- Soft Delete: Deletion marks as 'inactive'

## 🔌 REST API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Create Customer
```http
POST /customers
Content-Type: application/json

{
  "name": "Juan Pérez",
  "documentNumber": "12345678",
  "email": "juan@email.com",
  "phone": "987654321",
  "address": "Av. Principal 123"
}

Response: 201 Created
{
  "id": "uuid-here",
  "name": "Juan Pérez",
  "documentNumber": "12345678",
  "email": "juan@email.com",
  "phone": "987654321",
  "address": "Av. Principal 123",
  "status": "active",
  "createdAt": "2026-04-23T...",
  "updatedAt": "2026-04-23T..."
}
```

#### List Customers
```http
GET /customers?status=active

Response: 200 OK
{
  "customers": [...],
  "total": 10
}
```

#### Get Customer by ID
```http
GET /customers/:id

Response: 200 OK
{
  "id": "uuid-here",
  "name": "Juan Pérez",
  ...
}
```

#### Update Customer
```http
PUT /customers/:id
Content-Type: application/json

{
  "name": "Juan Pérez Updated",
  "phone": "999888777"
}

Response: 200 OK
{
  "id": "uuid-here",
  "name": "Juan Pérez Updated",
  "phone": "999888777",
  ...
}
```

#### Delete Customer
```http
DELETE /customers/:id

Response: 200 OK
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

## 🤖 Intelligent Agent

### Natural Language Interface

The agent provides a conversational interface to interact with the system.

#### Endpoint
```http
POST /agent
Content-Type: application/json

{
  "query": "registra un cliente llamado Juan con DNI 12345678"
}

Response: 200 OK
{
  "success": true,
  "message": "Cliente registrado exitosamente",
  "data": { ... }
}
```

### Supported Intents

| Intent | Example Queries |
|--------|----------------|
| CREATE_CUSTOMER | "registra un cliente", "crear cliente Juan" |
| GET_CUSTOMER | "busca cliente por DNI 12345678", "obtener cliente" |
| LIST_CUSTOMERS | "lista todos los clientes", "muestra clientes" |
| UPDATE_CUSTOMER | "actualiza cliente", "modifica datos" |
| DELETE_CUSTOMER | "elimina cliente", "borra cliente por DNI" |

### Flow

```
User Query → Intent Classifier → Orchestrator → Use Case → Repository → Response
```

## 🔐 Security

### Implemented Measures

1. **Helmet.js**
   - Security headers
   - XSS protection
   - Clickjacking prevention

2. **CORS**
   - Controlled cross-origin access
   - Configurable allowed origins

3. **Rate Limiting**
   - API: 100 requests per 15 minutes
   - Create endpoints: 10 requests per 15 minutes

4. **Input Sanitization**
   - SQL injection prevention
   - XSS attack prevention
   - HTML escaping

5. **Error Handling**
   - Centralized error management
   - No sensitive data leakage
   - Proper HTTP status codes

### OWASP Compliance

- Injection prevention
- Broken authentication handling
- Sensitive data exposure mitigation
- Security misconfiguration prevention
- XSS protection

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage
npm run test:coverage
```

### Test Coverage

- **Unit Tests**: Use cases, domain logic
- **Integration Tests**: Complete HTTP → Repository flow
- **Test Scenarios**: Success cases, validation errors, business rules

### Example Test

```typescript
describe('CreateCustomerUseCase', () => {
  it('should create a customer with valid data', async () => {
    const result = await createCustomerUseCase.execute({
      name: 'Juan Pérez',
      documentNumber: '12345678',
      email: 'juan@email.com',
      phone: '987654321',
      address: 'Av. Principal 123'
    });
    
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('active');
  });
});
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- npm >= 7

### Installation

```bash
# Clone the repository
cd customer-management-api

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📝 Usage Examples

### Using REST API

```bash
# Create customer
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "documentNumber": "12345678",
    "email": "juan@email.com",
    "phone": "987654321",
    "address": "Av. Principal 123"
  }'

# List customers
curl http://localhost:3000/customers

# Get by ID
curl http://localhost:3000/customers/{id}

# Update customer
curl -X PUT http://localhost:3000/customers/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Updated"}'

# Delete customer
curl -X DELETE http://localhost:3000/customers/{id}
```

### Using Agent Interface

```bash
# Natural language interaction
curl -X POST http://localhost:3000/agent \
  -H "Content-Type: application/json" \
  -d '{"query": "registra un cliente llamado María con DNI 87654321"}'

curl -X POST http://localhost:3000/agent \
  -H "Content-Type: application/json" \
  -d '{"query": "busca cliente por DNI 12345678"}'
```

## 🔄 Use Cases

### CreateCustomerUseCase
- Validates input data
- Checks for duplicates (document/email)
- Creates customer entity
- Persists to repository

### GetCustomerUseCase
- Retrieves customer by ID
- Returns 404 if not found

### ListCustomersUseCase
- Lists all customers
- Optional status filter
- Returns count and list

### UpdateCustomerUseCase
- Validates customer exists
- Updates allowed fields
- Maintains data integrity

### DeleteCustomerUseCase
- Soft delete (marks as inactive)
- Preserves data for auditing

## 🛠️ Development

### Adding New Features

1. **Domain**: Define entities and business rules
2. **Application**: Create use case
3. **Infrastructure**: Implement repository methods
4. **Controllers**: Add REST endpoint
5. **Tests**: Write unit and integration tests
6. **Agent**: Add intent if needed

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing

## 📦 Dependencies

### Production
- express: Web framework
- helmet: Security headers
- cors: CORS management
- express-rate-limit: Rate limiting
- joi: Input validation
- uuid: ID generation

### Development
- typescript: Type system
- jest: Testing framework
- supertest: HTTP testing
- @types/*: TypeScript definitions

## 🤝 Contributing

1. Follow Clean Architecture principles
2. Write tests for new features
3. Maintain SOLID principles
4. Document API changes
5. Use meaningful commit messages

## 📄 License

ISC License

## 👥 Authors

Developed as a demonstration of Clean Architecture, SOLID principles, and modern backend development practices.

## 📞 Support

For issues or questions, please refer to the code documentation and test examples.

---

**Note**: This system uses an in-memory repository by default. For production, implement a persistent repository (MongoDB, PostgreSQL, etc.) following the same interface.
