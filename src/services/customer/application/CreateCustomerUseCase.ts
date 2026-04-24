/**
 * Application Layer - Create Customer Use Case
 * 
 * Role: Orchestrate the creation of a new customer
 * Use Case: Create customer
 * Endpoint: POST /customers
 * 
 * This use case encapsulates the business logic for creating a new customer,
 * ensuring that business rules are enforced and data is validated.
 * Follows the Single Responsibility Principle (SOLID).
 */

import { Customer, CustomerStatus } from '../domain/Customer';
import { CustomerRepository } from '../domain/CustomerRepository';
import { v4 as uuidv4 } from 'uuid';

export interface CreateCustomerInput {
  name: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  status?: CustomerStatus;
}

export interface CreateCustomerOutput {
  id: string;
  name: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: CreateCustomerInput): Promise<CreateCustomerOutput> {
    // Business Rule: Check if document number already exists
    const existingByDocument = await this.customerRepository.findByDocumentNumber(
      input.documentNumber
    );
    if (existingByDocument) {
      throw new Error('A customer with this document number already exists');
    }

    // Business Rule: Check if email already exists
    const existingByEmail = await this.customerRepository.findByEmail(input.email);
    if (existingByEmail) {
      throw new Error('A customer with this email already exists');
    }

    // Create customer entity (domain validation happens here)
    const customer = Customer.create(
      uuidv4(),
      input.name,
      input.documentNumber,
      input.email,
      input.phone,
      input.address,
      input.status || CustomerStatus.ACTIVE
    );

    // Persist customer
    const savedCustomer = await this.customerRepository.save(customer);

    // Return output DTO
    return this.toOutput(savedCustomer);
  }

  private toOutput(customer: Customer): CreateCustomerOutput {
    return {
      id: customer.id,
      name: customer.name,
      documentNumber: customer.documentNumber,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }
}
