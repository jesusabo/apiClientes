/**
 * Agent Layer - Agent Controller
 * 
 * Role: Provide REST endpoint for natural language interaction
 * Endpoint: POST /agent
 * 
 * This controller receives natural language queries and returns
 * processed responses from the agent orchestrator.
 */

import { Request, Response } from 'express';
import { AgentOrchestrator } from '../orchestrator/AgentOrchestrator';

export class AgentController {
  constructor(private readonly agentOrchestrator: AgentOrchestrator) {}

  /**
   * Process natural language input
   * POST /agent
   */
  async process(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string' || query.trim() === '') {
        res.status(400).json({
          success: false,
          message: 'Query is required and must be a non-empty string'
        });
        return;
      }

      const response = await this.agentOrchestrator.process(query);

      if (response.success) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}
