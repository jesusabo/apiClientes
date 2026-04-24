/**
 * Agent Layer - Main Entry Point
 * 
 * Role: Initialize and export agent service dependencies
 * - Creates intent classifier
 * - Creates agent orchestrator
 * - Creates agent controller
 * - Exports configured routes
 */

import { InMemoryCustomerRepository } from '../services/customer/infrastructure/InMemoryCustomerRepository';
import { AgentOrchestrator } from './orchestrator/AgentOrchestrator';
import { AgentController } from './adapters/AgentController';
import { createAgentRoutes } from './adapters/AgentRoutes';

// Get shared repository instance
// Note: In production, this should use dependency injection or a shared service container
const customerRepository = new InMemoryCustomerRepository();

// Initialize agent orchestrator
const agentOrchestrator = new AgentOrchestrator(customerRepository);

// Initialize agent controller
const agentController = new AgentController(agentOrchestrator);

// Export router
export default createAgentRoutes(agentController);
