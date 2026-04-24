/**
 * Agent Layer - Agent Routes
 * 
 * Role: Define routes for agent natural language interface
 * Endpoint: POST /agent
 */

import { Router } from 'express';
import { AgentController } from './AgentController';

export function createAgentRoutes(agentController: AgentController): Router {
  const router = Router();

  router.post('/', (req, res) => agentController.process(req, res));

  return router;
}
