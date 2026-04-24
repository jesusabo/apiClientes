/**
 * Unit Tests - CreateCustomerUseCase
 * 
 * Tests the business logic for creating customers
 * Covers: success cases, validation errors, duplicate detection
 */

import { CreateCustomerUseCase } from '../../src/services/customer/application/CreateCustomerUseCase';
import { CustomerRepository } from '../../src/services/customer/domain/CustomerRepository';
import { Customer } from '../../src/services/customer/domain/Customer';

describe('CreateCustomerUseCase', () => {
  let createCustomerUseCase: CreateCustomerUseCase;
  let mockRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDocumentNumber: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    createCustomerUseCase = new CreateCustomerUseCase(mockRepository);
  });

  describe('Success Cases', () => {
    it('should create a customer with valid data', async () => {
      const input = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      mockRepository.findByDocumentNumber.mockResolvedValue(null);
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.save.mockImplementation(async (customer: Customer) => customer);

      const result = await createCustomerUseCase.execute(input);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(input.name);
      expect(result.documentNumber).toBe(input.documentNumber);
      expect(result.email).toBe(input.email);
      expect(result.phone).toBe(input.phone);
      expect(result.address).toBe(input.address);
      expect(result.status).toBe('active');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Errors', () => {
    it('should throw error if name is empty', async () => {
      const input = {
        name: '',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      await expect(createCustomerUseCase.execute(input)).rejects.toThrow('Name is required');
    });

    it('should throw error if documentNumber is empty', async () => {
      const input = {
        name: 'Juan Pérez',
        documentNumber: '',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      await expect(createCustomerUseCase.execute(input)).rejects.toThrow('Document number is required');
    });

    it('should throw error if email is invalid', async () => {
      const input = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'invalid-email',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      await expect(createCustomerUseCase.execute(input)).rejects.toThrow('Invalid email format');
    });

    it('should throw error if phone is empty', async () => {
      const input = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '',
        address: 'Av. Principal 123',
      };

      await expect(createCustomerUseCase.execute(input)).rejects.toThrow('Phone is required');
    });
  });

  describe('Business Rules', () => {
    it('should throw error if document number already exists', async () => {
      const input = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      const existingCustomer = new Customer(
        'existing-id',
        'Existing Customer',
        '12345678',
        'existing@email.com',
        '111111111',
        'Address'
      );

      mockRepository.findByDocumentNumber.mockResolvedValue(existingCustomer);

      await expect(createCustomerUseCase.execute(input)).rejects.toThrow(
        'Customer with document number 12345678 already exists'
      );
    });

    it('should throw error if email already exists', async () => {
      const input = {
        name: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@email.com',
        phone: '987654321',
        address: 'Av. Principal 123',
      };

      const existingCustomer = new Customer(
        'existing-id',
        'Existing Customer',
        '87654321',
        'juan@email.com',
        '111111111',
        'Address'
      );

      mockRepository.findByDocumentNumber.mockResolvedValue(null);
      mockRepository.findByEmail.mockResolvedValue(existingCustomer);

      await expect(createCustomerUseCase.execute(input)).rejects.toThrow(
        'Customer with email juan@email.com already exists'
      );
    });
  });
});
