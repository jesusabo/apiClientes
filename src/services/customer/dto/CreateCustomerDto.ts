/**
 * DTO Layer - Create Customer DTO
 * 
 * Role: Data Transfer Object for customer creation with validation
 * Use Case: Create customer
 * Endpoint: POST /customers
 * 
 * This DTO validates incoming data for customer creation.
 * Follows the Interface Segregation Principle (SOLID).
 */

export interface CreateCustomerDto {
  name: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export class CreateCustomerDtoValidator {
  static validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string');
    } else if (data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (data.name.trim().length > 100) {
      errors.push('Name must not exceed 100 characters');
    }

    // Validate documentNumber
    if (!data.documentNumber || typeof data.documentNumber !== 'string') {
      errors.push('Document number is required and must be a string');
    } else if (data.documentNumber.trim().length < 5) {
      errors.push('Document number must be at least 5 characters long');
    } else if (data.documentNumber.trim().length > 20) {
      errors.push('Document number must not exceed 20 characters');
    }

    // Validate email
    if (!data.email || typeof data.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Email must be a valid email address');
      }
    }

    // Validate phone
    if (!data.phone || typeof data.phone !== 'string') {
      errors.push('Phone is required and must be a string');
    } else if (data.phone.trim().length < 7) {
      errors.push('Phone must be at least 7 characters long');
    } else if (data.phone.trim().length > 20) {
      errors.push('Phone must not exceed 20 characters');
    }

    // Validate address
    if (!data.address || typeof data.address !== 'string') {
      errors.push('Address is required and must be a string');
    } else if (data.address.trim().length < 5) {
      errors.push('Address must be at least 5 characters long');
    } else if (data.address.trim().length > 200) {
      errors.push('Address must not exceed 200 characters');
    }

    // Validate status (optional)
    if (data.status !== undefined) {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
      if (!validStatuses.includes(data.status)) {
        errors.push('Status must be one of: ACTIVE, INACTIVE, SUSPENDED');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
