/**
 * Agent Layer - Agent Orchestrator
 * 
 * Role: Orchestrate the execution of use cases based on classified intents
 * Use Cases: All customer operations via natural language
 * 
 * This orchestrator maps intents to use cases and handles the conversation flow.
 * It provides a natural language interface to the backend system.
 */

import { Intent, IntentClassifier } from '../intents/IntentClassifier';
import { CreateCustomerUseCase } from '../../services/customer/application/CreateCustomerUseCase';
import { GetCustomerUseCase } from '../../services/customer/application/GetCustomerUseCase';
import { ListCustomersUseCase } from '../../services/customer/application/ListCustomersUseCase';
import { UpdateCustomerUseCase } from '../../services/customer/application/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '../../services/customer/application/DeleteCustomerUseCase';
import { CustomerRepository } from '../../services/customer/domain/CustomerRepository';

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  intent?: Intent;
  confidence?: number;
}

export class AgentOrchestrator {
  private intentClassifier: IntentClassifier;
  private createCustomerUseCase: CreateCustomerUseCase;
  private getCustomerUseCase: GetCustomerUseCase;
  private listCustomersUseCase: ListCustomersUseCase;
  private updateCustomerUseCase: UpdateCustomerUseCase;
  private deleteCustomerUseCase: DeleteCustomerUseCase;

  constructor(customerRepository: CustomerRepository) {
    this.intentClassifier = new IntentClassifier();
    this.createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    this.getCustomerUseCase = new GetCustomerUseCase(customerRepository);
    this.listCustomersUseCase = new ListCustomersUseCase(customerRepository);
    this.updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    this.deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);
  }

  /**
   * Process natural language input and execute appropriate action
   */
  async process(input: string): Promise<AgentResponse> {
    try {
      // Classify intent
      const classified = this.intentClassifier.classify(input);

      // Handle based on intent
      switch (classified.intent) {
        case Intent.CREATE_CUSTOMER:
          return await this.handleCreateCustomer(classified.entities);

        case Intent.GET_CUSTOMER:
          return await this.handleGetCustomer(classified.entities);

        case Intent.LIST_CUSTOMERS:
          return await this.handleListCustomers(classified.entities);

        case Intent.UPDATE_CUSTOMER:
          return await this.handleUpdateCustomer(classified.entities);

        case Intent.DELETE_CUSTOMER:
          return await this.handleDeleteCustomer(classified.entities);

        case Intent.UNKNOWN:
        default:
          return {
            success: false,
            message: 'No pude entender tu solicitud. Por favor, intenta de nuevo con una acción clara como: "registra un cliente", "busca cliente por DNI", "lista todos los clientes", etc.',
            intent: Intent.UNKNOWN,
            confidence: classified.confidence
          };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
  }

  private async handleCreateCustomer(entities: Record<string, any>): Promise<AgentResponse> {
    try {
      // Validate required entities
      const missingFields: string[] = [];
      if (!entities.name) missingFields.push('nombre');
      if (!entities.documentNumber) missingFields.push('documento/DNI');
      if (!entities.email) missingFields.push('email');
      if (!entities.phone) missingFields.push('teléfono');

      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Para crear un cliente necesito los siguientes datos: ${missingFields.join(', ')}. Por ejemplo: "Registra un cliente llamado Juan con DNI 12345678, email juan@email.com, teléfono 987654321 y dirección Av. Principal 123"`,
          intent: Intent.CREATE_CUSTOMER
        };
      }

      // Set default address if not provided
      if (!entities.address) {
        entities.address = 'No especificada';
      }

      const result = await this.createCustomerUseCase.execute({
        name: entities.name,
        documentNumber: entities.documentNumber,
        email: entities.email,
        phone: entities.phone,
        address: entities.address
      });

      return {
        success: true,
        message: `Cliente "${result.name}" creado exitosamente con ID: ${result.id}`,
        data: result,
        intent: Intent.CREATE_CUSTOMER
      };
    } catch (error: any) {
      return {
        success: false,
        message: `No se pudo crear el cliente: ${error.message}`,
        intent: Intent.CREATE_CUSTOMER
      };
    }
  }

  private async handleGetCustomer(entities: Record<string, any>): Promise<AgentResponse> {
    try {
      let customer = null;

      // Try to find by ID first
      if (entities.id) {
        customer = await this.getCustomerUseCase.execute({ id: entities.id });
      }
      else {
        return {
          success: false,
          message: 'Para buscar un cliente necesito el ID. Por ejemplo: "busca cliente con id abc-123"',
          intent: Intent.GET_CUSTOMER
        };
      }

      return {
        success: true,
        message: `Cliente encontrado: ${customer.name}`,
        data: customer,
        intent: Intent.GET_CUSTOMER
      };
    } catch (error: any) {
      return {
        success: false,
        message: `No se pudo encontrar el cliente: ${error.message}`,
        intent: Intent.GET_CUSTOMER
      };
    }
  }

  private async handleListCustomers(entities: Record<string, any>): Promise<AgentResponse> {
    try {
      const result = await this.listCustomersUseCase.execute({
        status: entities.status,
        limit: entities.limit || 10,
        offset: entities.offset || 0
      });

      let message = `Se encontraron ${result.total} cliente(s)`;
      if (entities.status) {
        message += ` con estado ${entities.status}`;
      }
      if (result.customers.length < result.total) {
        message += `. Mostrando ${result.customers.length}`;
      }

      return {
        success: true,
        message,
        data: {
          customers: result.customers,
          total: result.total
        },
        intent: Intent.LIST_CUSTOMERS
      };
    } catch (error: any) {
      return {
        success: false,
        message: `No se pudo listar los clientes: ${error.message}`,
        intent: Intent.LIST_CUSTOMERS
      };
    }
  }

  private async handleUpdateCustomer(entities: Record<string, any>): Promise<AgentResponse> {
    try {
      if (!entities.id) {
        return {
          success: false,
          message: 'Para actualizar un cliente necesito el ID. Por ejemplo: "actualiza cliente con id abc-123 nombre Juan Pérez"',
          intent: Intent.UPDATE_CUSTOMER
        };
      }

      // Build update object with available fields
      const updateData: any = { id: entities.id };
      if (entities.name) updateData.name = entities.name;
      if (entities.email) updateData.email = entities.email;
      if (entities.phone) updateData.phone = entities.phone;
      if (entities.address) updateData.address = entities.address;

      if (Object.keys(updateData).length === 1) {
        return {
          success: false,
          message: 'Necesito al menos un campo para actualizar (nombre, email, teléfono o dirección)',
          intent: Intent.UPDATE_CUSTOMER
        };
      }

      const result = await this.updateCustomerUseCase.execute(updateData);

      return {
        success: true,
        message: `Cliente "${result.name}" actualizado exitosamente`,
        data: result,
        intent: Intent.UPDATE_CUSTOMER
      };
    } catch (error: any) {
      return {
        success: false,
        message: `No se pudo actualizar el cliente: ${error.message}`,
        intent: Intent.UPDATE_CUSTOMER
      };
    }
  }

  private async handleDeleteCustomer(entities: Record<string, any>): Promise<AgentResponse> {
    try {
      if (!entities.id) {
        return {
          success: false,
          message: 'Para eliminar un cliente necesito el ID. Por ejemplo: "elimina cliente con id abc-123"',
          intent: Intent.DELETE_CUSTOMER
        };
      }

      const result = await this.deleteCustomerUseCase.execute({ id: entities.id });

      return {
        success: true,
        message: result.message,
        data: result,
        intent: Intent.DELETE_CUSTOMER
      };
    } catch (error: any) {
      return {
        success: false,
        message: `No se pudo eliminar el cliente: ${error.message}`,
        intent: Intent.DELETE_CUSTOMER
      };
    }
  }
}
