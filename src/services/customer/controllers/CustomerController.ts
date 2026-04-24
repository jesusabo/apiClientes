/**
 * Controller Layer - Customer Controller
 * 
 * Role: HTTP request/response handling for customer operations
 * Use Cases: All customer CRUD operations
 * Endpoints: All /customers endpoints
 * 
 * This controller connects Express routes to use cases.
 * Follows the Dependency Inversion and Single Responsibility Principles (SOLID).
 */

import { Request, Response } from 'express';
import { CreateCustomerUseCase } from '../application/CreateCustomerUseCase';
import { GetCustomerUseCase } from '../application/GetCustomerUseCase';
import { ListCustomersUseCase } from '../application/ListCustomersUseCase';
import { UpdateCustomerUseCase } from '../application/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '../application/DeleteCustomerUseCase';
import { CreateCustomerDtoValidator } from '../dto/CreateCustomerDto';
import { UpdateCustomerDtoValidator } from '../dto/UpdateCustomerDto';

export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase
  ) {}

  /**
   * POST /customers - Create a new customer
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Validate input DTO
      const validation = CreateCustomerDtoValidator.validate(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          errors: validation.errors
        });
        return;
      }

      // Execute use case
      const result = await this.createCustomerUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  }

  /**
   * GET /customers/:id - Get a customer by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.getCustomerUseCase.execute({ id });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  }

  /**
   * GET /customers - List all customers with optional filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { status, limit, offset, searchTerm } = req.query;

      const result = await this.listCustomersUseCase.execute({
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        searchTerm: searchTerm as string
      });

      res.status(200).json({
        success: true,
        data: result.customers,
        total: result.total
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  }

  /**
   * PUT /customers/:id - Update a customer
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate input DTO
      const validation = UpdateCustomerDtoValidator.validate(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          errors: validation.errors
        });
        return;
      }

      // Execute use case
      const result = await this.updateCustomerUseCase.execute({
        id,
        ...req.body
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  }

  /**
   * DELETE /customers/:id - Delete a customer
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.deleteCustomerUseCase.execute({ id });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(res: Response, error: any): void {
    console.error('Controller Error:', error);

    // Handle known business errors
    if (error.message === 'Customer not found') {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (
      error.message.includes('already exists') ||
      error.message.includes('required') ||
      error.message.includes('invalid')
    ) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    // Handle unknown errors
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
