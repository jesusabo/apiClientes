/**
 * Application Layer - Update Customer Use Case
 * 
 * Role: Update an existing customer's information
 * Use Case: Update customer
 * Endpoint: PUT /customers/:id
 * 
 * This use case updates customer information while maintaining business rules.
 * Follows the Single Responsibility Principle (SOLID).
 */

import { Customer } from '../domain/Customer';
import { CustomerRepository } from '../domain/CustomerRepository';

export interface UpdateCustomerInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerOutput {
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

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: UpdateCustomerInput): Promise<UpdateCustomerOutput> {
    if (!input.id || input.id.trim() === '') {
      throw new Error('Customer ID is required');
    }

    // Retrieve existing customer
    const customer = await this.customerRepository.findById(input.id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Business Rule: If email is being updated, ensure it's not already in use
    if (input.email && input.email !== customer.email) {
      const existingByEmail = await this.customerRepository.findByEmail(input.email);
      if (existingByEmail) {
        throw new Error('A customer with this email already exists');
      }
    }

    // Update customer information (domain validation happens here)
    customer.updateInfo(
      input.name,
      input.email,
      input.phone,
      input.address
    );

    // Persist changes
    const updatedCustomer = await this.customerRepository.save(customer);

    return this.toOutput(updatedCustomer);
  }

  private toOutput(customer: Customer): UpdateCustomerOutput {
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
