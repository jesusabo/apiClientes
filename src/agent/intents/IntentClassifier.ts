/**
 * Agent Layer - Intent Classifier
 * 
 * Role: Classify natural language input into specific intents
 * Use Cases: All customer operations via natural language
 * 
 * This classifier uses pattern matching to determine user intent.
 * In production, this could be replaced with an ML model or LLM integration.
 */

export enum Intent {
  CREATE_CUSTOMER = 'CREATE_CUSTOMER',
  GET_CUSTOMER = 'GET_CUSTOMER',
  LIST_CUSTOMERS = 'LIST_CUSTOMERS',
  UPDATE_CUSTOMER = 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER = 'DELETE_CUSTOMER',
  UNKNOWN = 'UNKNOWN'
}

export interface ClassifiedIntent {
  intent: Intent;
  confidence: number;
  entities: Record<string, any>;
}

export class IntentClassifier {
  /**
   * Classify user input into an intent
   */
  classify(input: string): ClassifiedIntent {
    const normalizedInput = input.toLowerCase().trim();

    // CREATE_CUSTOMER patterns
    if (this.matchesCreatePatterns(normalizedInput)) {
      return {
        intent: Intent.CREATE_CUSTOMER,
        confidence: 0.9,
        entities: this.extractCreateEntities(normalizedInput)
      };
    }

    // GET_CUSTOMER patterns
    if (this.matchesGetPatterns(normalizedInput)) {
      return {
        intent: Intent.GET_CUSTOMER,
        confidence: 0.9,
        entities: this.extractGetEntities(normalizedInput)
      };
    }

    // LIST_CUSTOMERS patterns
    if (this.matchesListPatterns(normalizedInput)) {
      return {
        intent: Intent.LIST_CUSTOMERS,
        confidence: 0.9,
        entities: this.extractListEntities(normalizedInput)
      };
    }

    // UPDATE_CUSTOMER patterns
    if (this.matchesUpdatePatterns(normalizedInput)) {
      return {
        intent: Intent.UPDATE_CUSTOMER,
        confidence: 0.9,
        entities: this.extractUpdateEntities(normalizedInput)
      };
    }

    // DELETE_CUSTOMER patterns
    if (this.matchesDeletePatterns(normalizedInput)) {
      return {
        intent: Intent.DELETE_CUSTOMER,
        confidence: 0.9,
        entities: this.extractDeleteEntities(normalizedInput)
      };
    }

    return {
      intent: Intent.UNKNOWN,
      confidence: 0.0,
      entities: {}
    };
  }

  private matchesCreatePatterns(input: string): boolean {
    const patterns = [
      /registr(a|ar|o)\s+(un\s+)?cliente/,
      /crear\s+(un\s+)?cliente/,
      /agregar\s+(un\s+)?cliente/,
      /añadir\s+(un\s+)?cliente/,
      /nuevo\s+cliente/,
      /create\s+customer/,
      /register\s+customer/,
      /add\s+customer/
    ];
    return patterns.some(pattern => pattern.test(input));
  }

  private matchesGetPatterns(input: string): boolean {
    const patterns = [
      /buscar\s+cliente/,
      /busca\s+cliente/,
      /obtener\s+cliente/,
      /consultar\s+cliente/,
      /ver\s+cliente/,
      /mostrar\s+cliente/,
      /(get|find|search)\s+customer/,
      /por\s+(dni|id|email)/
    ];
    return patterns.some(pattern => pattern.test(input));
  }

  private matchesListPatterns(input: string): boolean {
    const patterns = [
      /list(a|ar|o)\s+(todos\s+los\s+)?clientes/,
      /ver\s+(todos\s+los\s+)?clientes/,
      /mostrar\s+(todos\s+los\s+)?clientes/,
      /obtener\s+(todos\s+los\s+)?clientes/,
      /todos\s+los\s+clientes/,
      /list\s+(all\s+)?customers/,
      /get\s+all\s+customers/,
      /show\s+(all\s+)?customers/
    ];
    return patterns.some(pattern => pattern.test(input));
  }

  private matchesUpdatePatterns(input: string): boolean {
    const patterns = [
      /actualiz(a|ar|o)\s+cliente/,
      /modificar\s+cliente/,
      /editar\s+cliente/,
      /cambiar\s+(datos|información)\s+de\s+cliente/,
      /update\s+customer/,
      /modify\s+customer/,
      /edit\s+customer/
    ];
    return patterns.some(pattern => pattern.test(input));
  }

  private matchesDeletePatterns(input: string): boolean {
    const patterns = [
      /elimin(a|ar|o)\s+cliente/,
      /borrar\s+cliente/,
      /quitar\s+cliente/,
      /delete\s+customer/,
      /remove\s+customer/
    ];
    return patterns.some(pattern => pattern.test(input));
  }

  private extractCreateEntities(input: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract name
    const nameMatch = input.match(/llamado\s+([a-záéíóúñ\s]+)|named\s+([a-z\s]+)/i);
    if (nameMatch) {
      entities.name = (nameMatch[1] || nameMatch[2]).trim();
    }

    // Extract document number (DNI)
    const dniMatch = input.match(/(dni|documento|document)\s+(\d+)/i);
    if (dniMatch) {
      entities.documentNumber = dniMatch[2];
    }

    // Extract email
    const emailMatch = input.match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i);
    if (emailMatch) {
      entities.email = emailMatch[1];
    }

    // Extract phone
    const phoneMatch = input.match(/(teléfono|telefono|phone)\s+([\d\s\-+()]+)/i);
    if (phoneMatch) {
      entities.phone = phoneMatch[2].trim();
    }

    return entities;
  }

  private extractGetEntities(input: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract ID
    const idMatch = input.match(/id\s+([a-f0-9-]+)/i);
    if (idMatch) {
      entities.id = idMatch[1];
    }

    // Extract document number
    const dniMatch = input.match(/(dni|documento)\s+(\d+)/i);
    if (dniMatch) {
      entities.documentNumber = dniMatch[2];
    }

    // Extract email
    const emailMatch = input.match(/email\s+([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i);
    if (emailMatch) {
      entities.email = emailMatch[1];
    }

    return entities;
  }

  private extractListEntities(input: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract status filter
    const statusMatch = input.match(/(activos|inactivos|suspendidos|active|inactive|suspended)/i);
    if (statusMatch) {
      const statusMap: Record<string, string> = {
        'activos': 'ACTIVE',
        'active': 'ACTIVE',
        'inactivos': 'INACTIVE',
        'inactive': 'INACTIVE',
        'suspendidos': 'SUSPENDED',
        'suspended': 'SUSPENDED'
      };
      entities.status = statusMap[statusMatch[1].toLowerCase()];
    }

    // Extract limit
    const limitMatch = input.match(/(primeros|últimos|first|last)\s+(\d+)/i);
    if (limitMatch) {
      entities.limit = parseInt(limitMatch[2]);
    }

    return entities;
  }

  private extractUpdateEntities(input: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract ID
    const idMatch = input.match(/id\s+([a-f0-9-]+)/i);
    if (idMatch) {
      entities.id = idMatch[1];
    }

    // Extract new values (similar to create)
    const nameMatch = input.match(/(nombre|name)\s+([a-záéíóúñ\s]+)/i);
    if (nameMatch) {
      entities.name = nameMatch[2].trim();
    }

    const emailMatch = input.match(/email\s+([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i);
    if (emailMatch) {
      entities.email = emailMatch[1];
    }

    const phoneMatch = input.match(/(teléfono|telefono|phone)\s+([\d\s\-+()]+)/i);
    if (phoneMatch) {
      entities.phone = phoneMatch[2].trim();
    }

    return entities;
  }

  private extractDeleteEntities(input: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract ID
    const idMatch = input.match(/id\s+([a-f0-9-]+)/i);
    if (idMatch) {
      entities.id = idMatch[1];
    }

    // Extract document number
    const dniMatch = input.match(/(dni|documento)\s+(\d+)/i);
    if (dniMatch) {
      entities.documentNumber = dniMatch[2];
    }

    return entities;
  }
}
