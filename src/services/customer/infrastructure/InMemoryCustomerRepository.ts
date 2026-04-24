/**
 * Infrastructure Layer - In-Memory Customer Repository
 * 
 * Role: Concrete implementation of CustomerRepository interface using in-memory storage
 * Use Cases: All customer operations
 * Endpoint: All /customers endpoints
 * 
 * This implementation uses a Map for in-memory storage.
 * In production, this would be replaced with a database implementation (MongoDB, PostgreSQL, etc.)
 * Follows the Dependency Inversion Principle (SOLID).
 */

import { Customer, CustomerProps } from '../domain/Customer';
import { CustomerRepository, CustomerFilters } from '../domain/CustomerRepository';

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Map<string, CustomerProps> = new Map();

  async save(customer: Customer): Promise<Customer> {
    const props = customer.toObject();
    this.customers.set(props.id, { ...props });
    return Customer.reconstitute(props);
  }

  async findById(id: string): Promise<Customer | null> {
    const props = this.customers.get(id);
    if (!props) {
      return null;
    }
    return Customer.reconstitute(props);
  }

  async findByDocumentNumber(documentNumber: string): Promise<Customer | null> {
    for (const props of this.customers.values()) {
      if (props.documentNumber === documentNumber) {
        return Customer.reconstitute(props);
      }
    }
    return null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    for (const props of this.customers.values()) {
      if (props.email === email) {
        return Customer.reconstitute(props);
      }
    }
    return null;
  }

  async findAll(filters?: CustomerFilters): Promise<Customer[]> {
    let customers = Array.from(this.customers.values());

    // Apply status filter
    if (filters?.status) {
      customers = customers.filter(c => c.status === filters.status);
    }

    // Apply search term filter (search in name, email, or document number)
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.documentNumber.toLowerCase().includes(term)
      );
    }

    // Sort by createdAt (most recent first)
    customers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || customers.length;
    customers = customers.slice(offset, offset + limit);

    return customers.map(props => Customer.reconstitute(props));
  }

  async delete(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.customers.has(id);
  }

  // Utility method for testing purposes
  clear(): void {
    this.customers.clear();
  }

  // Utility method to get count
  count(): number {
    return this.customers.size;
  }
}
