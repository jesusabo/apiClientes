/**
 * Main Server Entry Point
 * 
 * Role: Bootstrap and configure the Express application
 * - Setup security middleware
 * - Register routes
 * - Start HTTP server
 * - Handle graceful shutdown
 */

import express, { Application } from 'express';
import { 
  helmetConfig, 
  corsConfig, 
  apiLimiter, 
  sanitizeInput,
  errorHandler,
  notFoundHandler
} from './shared/middleware/security';
import customerRoutes from './services/customer';
import agentRoutes from './agent';

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express application
const app: Application = express();

// ============================================
// Global Middleware
// ============================================

// Security headers (Helmet)
app.use(helmetConfig);

// CORS configuration
app.use(corsConfig);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiLimiter);

// Input sanitization
app.use(sanitizeInput);

// ============================================
// Health Check Endpoint
// ============================================

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'Customer Management API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      customers: '/api/customers',
      agent: '/api/agent',
    },
  });
});

// ============================================
// API Routes
// ============================================

// Customer routes
app.use('/api/customers', customerRoutes);

// Agent routes
app.use('/api/agent', agentRoutes);

// ============================================
// Error Handling
// ============================================

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Customer Management API');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
  console.log('\n📚 Available endpoints:');
  console.log(`  - GET  / (API info)`);
  console.log(`  - GET  /health (Health check)`);
  console.log(`  - GET  /api/customers (List customers)`);
  console.log(`  - GET  /api/customers/:id (Get customer)`);
  console.log(`  - POST /api/customers (Create customer)`);
  console.log(`  - PUT  /api/customers/:id (Update customer)`);
  console.log(`  - DELETE /api/customers/:id (Delete customer)`);
  console.log(`  - POST /api/agent (Intelligent agent)`);
  console.log('='.repeat(50));
});

// ============================================
// Graceful Shutdown
// ============================================

const gracefulShutdown = (signal: string) => {
  console.log(`\n\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('👋 Process terminated');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('❌ Unhandled Rejection:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Export app for testing
export default app;
