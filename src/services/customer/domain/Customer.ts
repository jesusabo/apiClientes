/**
 * Domain Layer - Customer Entity
 * 
 * Role: Define the core business entity with validations and business rules
 * Use Cases: All customer-related operations (Create, Read, Update, Delete)
 * Endpoint: Used by all /customers endpoints
 * 
 * This entity represents the Customer aggregate root following DDD principles.
 * It contains all business logic and validation rules for the Customer domain.
 */

export interface CustomerProps {
  id: string;
  name: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export class Customer {
  private constructor(private props: CustomerProps) {
    this.validate();
  }

  // Factory method for creating new customers
  static create(
    id: string,
    name: string,
    documentNumber: string,
    email: string,
    phone: string,
    address: string,
    status: CustomerStatus = CustomerStatus.ACTIVE
  ): Customer {
    const now = new Date();
    return new Customer({
      id,
      name,
      documentNumber,
      email,
      phone,
      address,
      status,
      createdAt: now,
      updatedAt: now
    });
  }

  // Factory method for reconstituting from persistence
  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get documentNumber(): string {
    return this.props.documentNumber;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get address(): string {
    return this.props.address;
  }

  get status(): CustomerStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  updateInfo(name?: string, email?: string, phone?: string, address?: string): void {
    if (name) this.props.name = name;
    if (email) this.props.email = email;
    if (phone) this.props.phone = phone;
    if (address) this.props.address = address;
    this.props.updatedAt = new Date();
    this.validate();
  }

  activate(): void {
    if (this.props.status === CustomerStatus.ACTIVE) {
      throw new Error('Customer is already active');
    }
    this.props.status = CustomerStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    if (this.props.status === CustomerStatus.INACTIVE) {
      throw new Error('Customer is already inactive');
    }
    this.props.status = CustomerStatus.INACTIVE;
    this.props.updatedAt = new Date();
  }

  suspend(): void {
    this.props.status = CustomerStatus.SUSPENDED;
    this.props.updatedAt = new Date();
  }

  // Business rules validation
  private validate(): void {
    if (!this.props.id || this.props.id.trim() === '') {
      throw new Error('Customer ID is required');
    }

    if (!this.props.name || this.props.name.trim() === '') {
      throw new Error('Customer name is required');
    }

    if (this.props.name.length < 3) {
      throw new Error('Customer name must be at least 3 characters long');
    }

    if (!this.props.documentNumber || this.props.documentNumber.trim() === '') {
      throw new Error('Document number is required');
    }

    if (!this.isValidDocumentNumber(this.props.documentNumber)) {
      throw new Error('Invalid document number format');
    }

    if (!this.props.email || this.props.email.trim() === '') {
      throw new Error('Email is required');
    }

    if (!this.isValidEmail(this.props.email)) {
      throw new Error('Invalid email format');
    }

    if (!this.props.phone || this.props.phone.trim() === '') {
      throw new Error('Phone is required');
    }

    if (!this.isValidPhone(this.props.phone)) {
      throw new Error('Invalid phone format');
    }

    if (!this.props.address || this.props.address.trim() === '') {
      throw new Error('Address is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  }

  private isValidDocumentNumber(documentNumber: string): boolean {
    // Allow alphanumeric and basic separators
    const docRegex = /^[A-Za-z0-9\-]+$/;
    return docRegex.test(documentNumber) && documentNumber.length >= 5;
  }

  // Convert to plain object
  toObject(): CustomerProps {
    return {
      ...this.props
    };
  }
}
