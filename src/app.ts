import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Express app
const app = express();

// Middleware setup 
app.use(logger('dev')); // Logger for development
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cookieParser()); // Cookie parsing middleware
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND, // Set frontend URL here
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));

// Import your router
import indexRouter from './routes/index'; // Ensure the path is correct

// Mount the router at the `/api` path
app.use('/api', indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

// Error handler
app.use((err: { stack: any; message: any; status: any }, req: express.Request, res: express.Response) => {
    // Set the response status and JSON error message
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            ...(req.app.get('env') === 'development' && { stack: err.stack }), // Include stack trace in development
        }
    });
});

// Export the app
export default app;
