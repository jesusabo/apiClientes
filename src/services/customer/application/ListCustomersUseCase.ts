/**
 * Application Layer - List Customers Use Case
 * 
 * Role: Retrieve all customers with optional filtering
 * Use Case: List customers
 * Endpoint: GET /customers
 * 
 * This use case retrieves a list of customers, supporting filtering and pagination.
 * Follows the Single Responsibility Principle (SOLID).
 */

import { Customer } from '../domain/Customer';
import { CustomerRepository, CustomerFilters } from '../domain/CustomerRepository';

export interface ListCustomersInput {
  status?: string;
  limit?: number;
  offset?: number;
  searchTerm?: string;
}

export interface ListCustomersOutput {
  customers: CustomerOutput[];
  total: number;
}

export interface CustomerOutput {
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

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: ListCustomersInput = {}): Promise<ListCustomersOutput> {
    const filters: CustomerFilters = {
      status: input.status,
      limit: input.limit || 100,
      offset: input.offset || 0,
      searchTerm: input.searchTerm
    };

    const customers = await this.customerRepository.findAll(filters);

    return {
      customers: customers.map(c => this.toOutput(c)),
      total: customers.length
    };
  }

  private toOutput(customer: Customer): CustomerOutput {
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
