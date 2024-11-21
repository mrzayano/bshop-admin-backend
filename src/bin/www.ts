#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from '../app'; // Ensure this path is correct
import debug from 'debug';
import http from 'http';
import helmet from 'helmet'; // For security
import compression from 'compression'; // For performance
import morgan from 'morgan'; // For logging

/**
 * Get port from environment and store in Express.
 * Use a fallback value of '3001' if process.env.PORT is undefined.
 */
const port = normalizePort(process.env.PORT || '3001'); // Default to '3001'
app.set('port', port);

/**
 * Middleware for enhanced security and performance.
 */
app.use(helmet()); // Adds various security headers
app.use(compression()); // Compresses response bodies for better performance
app.use(morgan('combined')); // Use 'tiny' for less detailed logs

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): number | string | false {
  const portNumber = parseInt(val, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + (addr ? addr.port : 'unknown');
  debug('Listening on ' + bind);
}
