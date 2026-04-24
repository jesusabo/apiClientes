/**
 * Application Layer - Delete Customer Use Case
 * 
 * Role: Delete a customer from the system
 * Use Case: Delete customer
 * Endpoint: DELETE /customers/:id
 * 
 * This use case handles the deletion of customers following business rules.
 * Follows the Single Responsibility Principle (SOLID).
 */

import { CustomerRepository } from '../domain/CustomerRepository';

export interface DeleteCustomerInput {
  id: string;
}

export interface DeleteCustomerOutput {
  success: boolean;
  message: string;
}

export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: DeleteCustomerInput): Promise<DeleteCustomerOutput> {
    if (!input.id || input.id.trim() === '') {
      throw new Error('Customer ID is required');
    }

    // Business Rule: Verify customer exists before attempting deletion
    const customer = await this.customerRepository.findById(input.id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Business Rule: Could add additional rules here, e.g.,
    // - Check if customer has pending orders
    // - Check if customer has outstanding payments
    // - Only allow deletion if status is INACTIVE

    const deleted = await this.customerRepository.delete(input.id);

    if (!deleted) {
      throw new Error('Failed to delete customer');
    }

    return {
      success: true,
      message: 'Customer deleted successfully'
    };
  }
}
