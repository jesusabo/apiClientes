/**
 * Application Layer - Get Customer Use Case
 * 
 * Role: Retrieve a single customer by ID
 * Use Case: Get customer
 * Endpoint: GET /customers/:id
 * 
 * This use case retrieves a specific customer by their unique identifier.
 * Follows the Single Responsibility Principle (SOLID).
 */

import { Customer } from '../domain/Customer';
import { CustomerRepository } from '../domain/CustomerRepository';

export interface GetCustomerInput {
  id: string;
}

export interface GetCustomerOutput {
  id: string;
  name: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: GetCustomerInput): Promise<GetCustomerOutput> {
    if (!input.id || input.id.trim() === '') {
      throw new Error('Customer ID is required');
    }

    const customer = await this.customerRepository.findById(input.id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return this.toOutput(customer);
  }

  private toOutput(customer: Customer): GetCustomerOutput {
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
