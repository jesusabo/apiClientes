/**
 * DTO Layer - Update Customer DTO
 * 
 * Role: Data Transfer Object for customer updates with validation
 * Use Case: Update customer
 * Endpoint: PUT /customers/:id
 * 
 * This DTO validates incoming data for customer updates.
 * All fields are optional to allow partial updates.
 * Follows the Interface Segregation Principle (SOLID).
 */

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export class UpdateCustomerDtoValidator {
  static validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // At least one field must be provided
    const hasAtLeastOneField = data.name || data.email || data.phone || data.address;
    if (!hasAtLeastOneField) {
      errors.push('At least one field must be provided for update');
    }

    // Validate name (if provided)
    if (data.name !== undefined) {
      if (typeof data.name !== 'string') {
        errors.push('Name must be a string');
      } else if (data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      } else if (data.name.trim().length > 100) {
        errors.push('Name must not exceed 100 characters');
      }
    }

    // Validate email (if provided)
    if (data.email !== undefined) {
      if (typeof data.email !== 'string') {
        errors.push('Email must be a string');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          errors.push('Email must be a valid email address');
        }
      }
    }

    // Validate phone (if provided)
    if (data.phone !== undefined) {
      if (typeof data.phone !== 'string') {
        errors.push('Phone must be a string');
      } else if (data.phone.trim().length < 7) {
        errors.push('Phone must be at least 7 characters long');
      } else if (data.phone.trim().length > 20) {
        errors.push('Phone must not exceed 20 characters');
      }
    }

    // Validate address (if provided)
    if (data.address !== undefined) {
      if (typeof data.address !== 'string') {
        errors.push('Address must be a string');
      } else if (data.address.trim().length < 5) {
        errors.push('Address must be at least 5 characters long');
      } else if (data.address.trim().length > 200) {
        errors.push('Address must not exceed 200 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
