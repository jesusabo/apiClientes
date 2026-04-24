/**
 * Integration Tests - Customer REST Endpoints
 * 
 * Tests the complete flow: HTTP → Controller → Use Case → Repository
 * Covers all CRUD operations and error scenarios
 */

import request from 'supertest';
import express, { Express } from 'express';
import { InMemoryCustomerRepository } from '../../src/services/customer/infrastructure/InMemoryCustomerRepository';
import { CustomerController } from '../../src/services/customer/controllers/CustomerController';
import { createCustomerRoutes } from '../../src/services/customer/controllers/CustomerRoutes';

describe('Customer REST Endpoints', () => {
  let app: Express;
  let repository: InMemoryCustomerRepository;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    const controller = new CustomerController(repository);
    
    app = express();
    app.use(express.json());
    app.use('/customers', createCustomerRoutes(controller));
  });

  describe('POST /customers', () => {
    it('should create a new customer with valid data', async () => {
      const customerData = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      const response = await request(app)
        .post('/customers')
        .send(customerData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(customerData.name);
      expect(response.body.documentNumber).toBe(customerData.documentNumber);
      expect(response.body.status).toBe('active');
    });

    it('should return 400 if required fields are missing', async () => {
      const customerData = {
        name: 'Juan Pérez',
        // Missing documentNumber, email, phone
      };

      const response = await request(app)
        .post('/customers')
        .send(customerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if email format is invalid', async () => {
      const customerData = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'invalid-email',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      const response = await request(app)
        .post('/customers')
        .send(customerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should return 400 if document number already exists', async () => {
      const customerData = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      // Create first customer
      await request(app).post('/customers').send(customerData);

      // Try to create duplicate
      const response = await request(app)
        .post('/customers')
        .send({ ...customerData, email: 'different@email.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('GET /customers', () => {
    it('should return an empty list when no customers exist', async () => {
      const response = await request(app)
        .get('/customers')
        .expect(200);

      expect(response.body.customers).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('should return all customers', async () => {
      // Create multiple customers
      const customers = [
        {
          name: 'Juan Pérez',
          documentNumber: '12345678',
          email: 'juan@email.com',
          phone: '987654321',
          address: 'Address 1',
        },
        {
          name: 'María García',
          documentNumber: '87654321',
          email: 'maria@email.com',
          phone: '912345678',
          address: 'Address 2',
        },
      ];

      for (const customer of customers) {
        await request(app).post('/customers').send(customer);
      }

      const response = await request(app)
        .get('/customers')
        .expect(200);

      expect(response.body.customers).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });

    it('should filter customers by status', async () => {
      // Create and then delete a customer
      const customerData = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Address 1',
      };

      const createResponse = await request(app).post('/customers').send(customerData);
      const customerId = createResponse.body.id;

      await request(app).delete(`/customers/${customerId}`);

      // Get only active customers
      const response = await request(app)
        .get('/customers?status=active')
        .expect(200);

      expect(response.body.customers).toHaveLength(0);
    });
  });

  describe('GET /customers/:id', () => {
    it('should return a customer by ID', async () => {
      const customerData = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      const createResponse = await request(app).post('/customers').send(customerData);
      const customerId = createResponse.body.id;

      const response = await request(app)
        .get(`/customers/${customerId}`)
        .expect(200);

      expect(response.body.id).toBe(customerId);
      expect(response.body.name).toBe(customerData.name);
    });

    it('should return 404 if customer not found', async () => {
      const response = await request(app)
        .get('/customers/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PUT /customers/:id', () => {
    it('should update a customer', async () => {
      const customerData = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      const createResponse = await request(app).post('/customers').send(customerData);
      const customerId = createResponse.body.id;

      const updateData = {
        name: 'Juan Pérez Updated',
        phone: '999888777',
      };

      const response = await request(app)
        .put(`/customers/${customerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.phone).toBe(updateData.phone);
      expect(response.body.email).toBe(customerData.email); // Unchanged
    });

    it('should return 404 if customer not found', async () => {
      const response = await request(app)
        .put('/customers/non-existent-id')
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /customers/:id', () => {
    it('should delete a customer (soft delete)', async () => {
      const customerData = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      const createResponse = await request(app).post('/customers').send(customerData);
      const customerId = createResponse.body.id;

      const response = await request(app)
        .delete(`/customers/${customerId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify customer is marked as inactive
      const getResponse = await request(app).get(`/customers/${customerId}`);
      expect(getResponse.body.status).toBe('inactive');
    });

    it('should return 404 if customer not found', async () => {
      const response = await request(app)
        .delete('/customers/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
