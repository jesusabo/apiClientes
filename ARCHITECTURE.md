# Architecture Documentation

This document provides visual representations of the system architecture using Mermaid diagrams.

## 📐 System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Frontend/Client]
        B[Agent Interface]
    end
    
    subgraph "API Gateway"
        C[Express Server]
        D[Security Middleware]
        E[Rate Limiter]
    end
    
    subgraph "Interface Layer"
        F[Customer Controller]
        G[Agent Controller]
    end
    
    subgraph "Application Layer"
        H[CreateCustomerUseCase]
        I[GetCustomerUseCase]
        J[ListCustomersUseCase]
        K[UpdateCustomerUseCase]
        L[DeleteCustomerUseCase]
    end
    
    subgraph "Agent Intelligence"
        M[Intent Classifier]
        N[Agent Orchestrator]
    end
    
    subgraph "Domain Layer"
        O[Customer Entity]
        P[CustomerRepository Interface]
    end
    
    subgraph "Infrastructure Layer"
        Q[InMemoryCustomerRepository]
        R[(Database)]
    end
    
    A -->|HTTP Request| C
    B -->|Natural Language| C
    C --> D
    D --> E
    E --> F
    E --> G
    
    F --> H
    F --> I
    F --> J
    F --> K
    F --> L
    
    G --> M
    M --> N
    N --> H
    N --> I
    N --> J
    N --> K
    N --> L
    
    H --> O
    I --> O
    J --> O
    K --> O
    L --> O
    
    H --> P
    I --> P
    J --> P
    K --> P
    L --> P
    
    P --> Q
    Q --> R
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#fff4e1
    style E fill:#fff4e1
    style F fill:#ffe1f5
    style G fill:#ffe1f5
    style H fill:#e1ffe1
    style I fill:#e1ffe1
    style J fill:#e1ffe1
    style K fill:#e1ffe1
    style L fill:#e1ffe1
    style M fill:#f5e1ff
    style N fill:#f5e1ff
    style O fill:#ffe1e1
    style P fill:#ffe1e1
    style Q fill:#e1e1ff
    style R fill:#e1e1ff
```

## 🔄 Clean Architecture Layers

```mermaid
graph LR
    subgraph "External"
        A[HTTP Requests]
        B[Database]
    end
    
    subgraph "Infrastructure Layer"
        C[Controllers]
        D[Repository Impl]
        E[External APIs]
    end
    
    subgraph "Application Layer"
        F[Use Cases]
        G[DTOs]
    end
    
    subgraph "Domain Layer"
        H[Entities]
        I[Business Rules]
        J[Interfaces]
    end
    
    A --> C
    C --> F
    F --> H
    F --> J
    D --> J
    D --> B
    H --> I
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#ffe1e1
    style D fill:#ffe1e1
    style E fill:#ffe1e1
    style F fill:#e1ffe1
    style G fill:#e1ffe1
    style H fill:#f5e1ff
    style I fill:#f5e1ff
    style J fill:#f5e1ff
```

## 📊 Create Customer - Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant CreateUseCase
    participant Customer
    participant Repository
    participant Database
    
    Client->>Controller: POST /customers
    Note over Client,Controller: Request Body:<br/>{name, documentNumber, email, phone, address}
    
    Controller->>Controller: Validate DTO
    
    Controller->>CreateUseCase: execute(data)
    
    CreateUseCase->>Repository: findByDocumentNumber(documentNumber)
    Repository->>Database: Query by document
    Database-->>Repository: null
    Repository-->>CreateUseCase: null
    
    CreateUseCase->>Repository: findByEmail(email)
    Repository->>Database: Query by email
    Database-->>Repository: null
    Repository-->>CreateUseCase: null
    
    CreateUseCase->>Customer: new Customer(...)
    Note over Customer: Validate business rules
    Customer-->>CreateUseCase: customer instance
    
    CreateUseCase->>Repository: save(customer)
    Repository->>Database: INSERT customer
    Database-->>Repository: success
    Repository-->>CreateUseCase: saved customer
    
    CreateUseCase-->>Controller: customer
    Controller-->>Client: 201 Created + customer data
```

## 🔍 Get Customer - Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant GetUseCase
    participant Repository
    participant Database
    
    Client->>Controller: GET /customers/:id
    
    Controller->>GetUseCase: execute(id)
    
    GetUseCase->>Repository: findById(id)
    Repository->>Database: SELECT WHERE id = ?
    
    alt Customer Found
        Database-->>Repository: customer data
        Repository-->>GetUseCase: customer
        GetUseCase-->>Controller: customer
        Controller-->>Client: 200 OK + customer data
    else Customer Not Found
        Database-->>Repository: null
        Repository-->>GetUseCase: null
        GetUseCase-->>Controller: throw Error
        Controller-->>Client: 404 Not Found
    end
```

## 📋 List Customers - Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant ListUseCase
    participant Repository
    participant Database
    
    Client->>Controller: GET /customers?status=active
    
    Controller->>ListUseCase: execute(filters)
    
    ListUseCase->>Repository: findAll(filters)
    Repository->>Database: SELECT * WHERE status = ?
    Database-->>Repository: customer array
    Repository-->>ListUseCase: customers[]
    
    ListUseCase-->>Controller: {customers, total}
    Controller-->>Client: 200 OK + list data
```

## ✏️ Update Customer - Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UpdateUseCase
    participant Customer
    participant Repository
    participant Database
    
    Client->>Controller: PUT /customers/:id
    Note over Client,Controller: Request Body:<br/>{name?, email?, phone?, address?}
    
    Controller->>UpdateUseCase: execute(id, data)
    
    UpdateUseCase->>Repository: findById(id)
    Repository->>Database: SELECT WHERE id = ?
    
    alt Customer Found
        Database-->>Repository: customer data
        Repository-->>UpdateUseCase: customer
        
        UpdateUseCase->>Customer: update(data)
        Note over Customer: Validate and apply changes
        Customer-->>UpdateUseCase: updated customer
        
        UpdateUseCase->>Repository: update(customer)
        Repository->>Database: UPDATE customer
        Database-->>Repository: success
        Repository-->>UpdateUseCase: updated customer
        
        UpdateUseCase-->>Controller: customer
        Controller-->>Client: 200 OK + customer data
    else Customer Not Found
        Database-->>Repository: null
        Repository-->>UpdateUseCase: null
        UpdateUseCase-->>Controller: throw Error
        Controller-->>Client: 404 Not Found
    end
```

## 🗑️ Delete Customer - Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant DeleteUseCase
    participant Repository
    participant Database
    
    Client->>Controller: DELETE /customers/:id
    
    Controller->>DeleteUseCase: execute(id)
    
    DeleteUseCase->>Repository: findById(id)
    Repository->>Database: SELECT WHERE id = ?
    
    alt Customer Found
        Database-->>Repository: customer data
        Repository-->>DeleteUseCase: customer
        
        DeleteUseCase->>Repository: delete(id)
        Note over Repository: Soft Delete:<br/>status = 'inactive'
        Repository->>Database: UPDATE status = 'inactive'
        Database-->>Repository: success
        Repository-->>DeleteUseCase: void
        
        DeleteUseCase-->>Controller: void
        Controller-->>Client: 200 OK + success message
    else Customer Not Found
        Database-->>Repository: null
        Repository-->>DeleteUseCase: null
        DeleteUseCase-->>Controller: throw Error
        Controller-->>Client: 404 Not Found
    end
```

## 🤖 Agent Interaction - Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant AgentController
    participant IntentClassifier
    participant Orchestrator
    participant UseCase
    participant Repository
    
    Client->>AgentController: POST /agent
    Note over Client,AgentController: {"query": "registra un cliente..."}
    
    AgentController->>IntentClassifier: classify(query)
    Note over IntentClassifier: NLP Processing:<br/>- Extract intent<br/>- Extract entities
    IntentClassifier-->>AgentController: {intent, entities}
    
    AgentController->>Orchestrator: process(intent, entities)
    
    alt CREATE_CUSTOMER
        Orchestrator->>UseCase: CreateCustomerUseCase.execute()
    else GET_CUSTOMER
        Orchestrator->>UseCase: GetCustomerUseCase.execute()
    else LIST_CUSTOMERS
        Orchestrator->>UseCase: ListCustomersUseCase.execute()
    else UPDATE_CUSTOMER
        Orchestrator->>UseCase: UpdateCustomerUseCase.execute()
    else DELETE_CUSTOMER
        Orchestrator->>UseCase: DeleteCustomerUseCase.execute()
    end
    
    UseCase->>Repository: repository operation
    Repository-->>UseCase: result
    UseCase-->>Orchestrator: result
    
    Orchestrator-->>AgentController: {success, message, data}
    AgentController-->>Client: Natural language response
```

## 🔐 Security Flow

```mermaid
graph TD
    A[HTTP Request] --> B{Rate Limit?}
    B -->|Exceeded| C[429 Too Many Requests]
    B -->|OK| D[Helmet Security Headers]
    D --> E[CORS Check]
    E -->|Invalid Origin| F[403 Forbidden]
    E -->|Valid| G[Input Sanitization]
    G --> H[XSS Prevention]
    H --> I[SQL Injection Prevention]
    I --> J[Controller Handler]
    J --> K{Error?}
    K -->|Yes| L[Error Handler]
    K -->|No| M[Success Response]
    L --> N[Log Error]
    N --> O[Safe Error Response]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1e1
    style D fill:#e1ffe1
    style E fill:#fff4e1
    style F fill:#ffe1e1
    style G fill:#e1ffe1
    style H fill:#e1ffe1
    style I fill:#e1ffe1
    style J fill:#f5e1ff
    style K fill:#fff4e1
    style L fill:#ffe1e1
    style M fill:#e1f5ff
    style N fill:#ffe1e1
    style O fill:#ffe1e1
```

## 📦 Component Dependencies

```mermaid
graph TD
    A[server.ts] --> B[Express App]
    B --> C[Security Middleware]
    B --> D[Customer Routes]
    B --> E[Agent Routes]
    
    D --> F[Customer Controller]
    E --> G[Agent Controller]
    
    F --> H[Use Cases]
    G --> I[Intent Classifier]
    G --> J[Orchestrator]
    
    J --> H
    
    H --> K[Domain Entities]
    H --> L[Repository Interface]
    
    L --> M[Repository Implementation]
    M --> N[Data Storage]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1e1
    style D fill:#e1ffe1
    style E fill:#e1ffe1
    style F fill:#f5e1ff
    style G fill:#f5e1ff
    style H fill:#ffe1f5
    style I fill:#e1e1ff
    style J fill:#e1e1ff
    style K fill:#fff4e1
    style L fill:#fff4e1
    style M fill:#ffe1e1
    style N fill:#e1f5ff
```

## 🎯 Use Case Dependencies

```mermaid
graph LR
    subgraph "Use Cases"
        A[CreateCustomerUseCase]
        B[GetCustomerUseCase]
        C[ListCustomersUseCase]
        D[UpdateCustomerUseCase]
        E[DeleteCustomerUseCase]
    end
    
    subgraph "Domain"
        F[Customer Entity]
        G[CustomerRepository]
    end
    
    A --> F
    A --> G
    B --> G
    C --> G
    D --> F
    D --> G
    E --> G
    
    style A fill:#e1ffe1
    style B fill:#e1ffe1
    style C fill:#e1ffe1
    style D fill:#e1ffe1
    style E fill:#e1ffe1
    style F fill:#f5e1ff
    style G fill:#f5e1ff
```

## 🧠 Agent Intelligence Flow

```mermaid
graph TD
    A[Natural Language Query] --> B[Intent Classifier]
    B --> C{Intent Type}
    
    C -->|CREATE| D[Extract: name, DNI, email, phone]
    C -->|GET| E[Extract: DNI or ID]
    C -->|LIST| F[Extract: filters]
    C -->|UPDATE| G[Extract: ID, fields to update]
    C -->|DELETE| H[Extract: DNI or ID]
    
    D --> I[Orchestrator]
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[Map to Use Case]
    J --> K[Execute Use Case]
    K --> L[Format Response]
    L --> M[Natural Language Reply]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1e1
    style D fill:#e1ffe1
    style E fill:#e1ffe1
    style F fill:#e1ffe1
    style G fill:#e1ffe1
    style H fill:#e1ffe1
    style I fill:#f5e1ff
    style J fill:#f5e1ff
    style K fill:#ffe1f5
    style L fill:#e1e1ff
    style M fill:#e1f5ff
```

## 📝 Data Flow

```mermaid
graph LR
    A[Request] --> B[DTO]
    B --> C[Validation]
    C --> D[Use Case]
    D --> E[Domain Entity]
    E --> F[Repository]
    F --> G[Database]
    G --> F
    F --> D
    D --> H[Response DTO]
    H --> I[HTTP Response]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1e1
    style D fill:#e1ffe1
