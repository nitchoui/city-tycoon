/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

// Serve static files from the client build directory
const clientBuildPath = path.join(__dirname, '../../dist');
app.use(express.static(clientBuildPath));

// Handle React routing, return all requests to React app
app.get('*', (req: Request, res: Response) => {
  // Check if file exists, otherwise send index.html
  // But express.static handles files, so we just fallback to index.html
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export default app
