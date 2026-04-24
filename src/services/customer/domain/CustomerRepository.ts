/**
 * Domain Layer - Customer Repository Interface
 * 
 * Role: Define the contract for data persistence operations
 * Use Cases: Used by all application use cases for data access
 * Endpoint: Abstraction layer for all /customers endpoints
 * 
 * This interface follows the Repository pattern and Dependency Inversion Principle (SOLID).
 * The domain defines the contract, and infrastructure provides the implementation.
 */

import { Customer } from './Customer';

export interface CustomerRepository {
  /**
   * Save a new customer or update an existing one
   * @param customer - Customer entity to save
   * @returns Promise with the saved customer
   */
  save(customer: Customer): Promise<Customer>;

  /**
   * Find a customer by ID
   * @param id - Customer unique identifier
   * @returns Promise with the customer or null if not found
   */
  findById(id: string): Promise<Customer | null>;

  /**
   * Find a customer by document number
   * @param documentNumber - Customer document number
   * @returns Promise with the customer or null if not found
   */
  findByDocumentNumber(documentNumber: string): Promise<Customer | null>;

  /**
   * Find a customer by email
   * @param email - Customer email
   * @returns Promise with the customer or null if not found
   */
  findByEmail(email: string): Promise<Customer | null>;

  /**
   * Get all customers with optional filtering
   * @param filters - Optional filters for status, pagination, etc.
   * @returns Promise with array of customers
   */
  findAll(filters?: CustomerFilters): Promise<Customer[]>;

  /**
   * Delete a customer by ID
   * @param id - Customer unique identifier
   * @returns Promise with boolean indicating success
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a customer exists by ID
   * @param id - Customer unique identifier
   * @returns Promise with boolean indicating existence
   */
  exists(id: string): Promise<boolean>;
}

export interface CustomerFilters {
  status?: string;
  limit?: number;
  offset?: number;
  searchTerm?: string;
}
