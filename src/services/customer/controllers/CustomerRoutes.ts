/**
 * Routes Layer - Customer Routes
 * 
 * Role: Define Express routes for customer operations
 * Use Cases: All customer CRUD operations
 * Endpoints: All /customers endpoints
 * 
 * This file configures Express routes and connects them to the controller.
 */

import { Router } from 'express';
import { CustomerController } from './CustomerController';

export class CustomerRoutes {
  private router: Router;

  constructor(private readonly customerController: CustomerController) {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    /**
     * @route   GET /customers
     * @desc    Get all customers
     * @access  Public
     */
    this.router.get('/', (req, res) => this.customerController.list(req, res));

    /**
     * @route   GET /customers/:id
     * @desc    Get customer by ID
     * @access  Public
     */
    this.router.get('/:id', (req, res) => this.customerController.getById(req, res));

    /**
     * @route   POST /customers
     * @desc    Create a new customer
     * @access  Public
     */
    this.router.post('/', (req, res) => this.customerController.create(req, res));

    /**
     * @route   PUT /customers/:id
     * @desc    Update customer by ID
     * @access  Public
     */
    this.router.put('/:id', (req, res) => this.customerController.update(req, res));

    /**
     * @route   DELETE /customers/:id
     * @desc    Delete customer by ID
     * @access  Public
     */
    this.router.delete('/:id', (req, res) => this.customerController.delete(req, res));
  }

  getRouter(): Router {
    return this.router;
  }
}
