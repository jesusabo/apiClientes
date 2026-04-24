/**
 * Customer Service - Main Entry Point
 * 
 * Role: Initialize and export customer service dependencies
 * - Creates repository instance
 * - Creates use cases
 * - Creates controller
 * - Exports configured routes
 */

import { Router } from 'express';
import { InMemoryCustomerRepository } from './infrastructure/InMemoryCustomerRepository';
import { CreateCustomerUseCase } from './application/CreateCustomerUseCase';
import { GetCustomerUseCase } from './application/GetCustomerUseCase';
import { ListCustomersUseCase } from './application/ListCustomersUseCase';
import { UpdateCustomerUseCase } from './application/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from './application/DeleteCustomerUseCase';
import { CustomerController } from './controllers/CustomerController';
import { CustomerRoutes } from './controllers/CustomerRoutes';

// Initialize repository
const customerRepository = new InMemoryCustomerRepository();

// Initialize use cases
const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
const getCustomerUseCase = new GetCustomerUseCase(customerRepository);
const listCustomersUseCase = new ListCustomersUseCase(customerRepository);
const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
const deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);

// Initialize controller
const customerController = new CustomerController(
  createCustomerUseCase,
  getCustomerUseCase,
  listCustomersUseCase,
  updateCustomerUseCase,
  deleteCustomerUseCase
);

// Initialize routes
const customerRoutes = new CustomerRoutes(customerController);

// Export router
export default customerRoutes.getRouter();
