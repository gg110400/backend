import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';
import AuthorRoutes from './routes/AuthorRoutes.js';
import BlogPostRoutes from './routes/BlogPostRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url'; // Aggiungi questo import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  error400Handler,
  error401Handler,
  error404Handler,
  error500Handler
} from './middlewares/errorHandler.js';

// Configura le variabili d'ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotte
app.use('/api/authors', AuthorRoutes);
app.use('/api/blogposts', BlogPostRoutes);

//app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Middleware di errore
app.use(error400Handler);
app.use(error401Handler);
app.use(error404Handler);
app.use(error500Handler);

// Connetti a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

// Elenca gli endpoint
console.table(listEndpoints(app));