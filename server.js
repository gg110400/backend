import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import AuthorRoutes from "./routes/AuthorRoutes.js";
import BlogPostRoutes from "./routes/BlogPostRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import AuthRoutes from "./routes/AuthRoutes.js";
import session from "express-session";
import passport from "./config/passportConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  error400Handler,
  error401Handler,
  error404Handler,
  error500Handler,
} from "./middlewares/errorHandler.js";

// Configura le variabili d'ambiente
dotenv.config();

const app = express();

// Definisci la variabile PORT
const PORT = process.env.PORT || 3000;

// Configurazione CORS
const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'https://backend-del-blog.onrender.com', // URL del backend
      'https://my-blog-self-six.vercel.app/' // Frontend in produzione
    ];
    
    if (process.env.NODE_ENV === 'development') {
      console.log('CORS: Ambiente di sviluppo, permesso a tutte le origini');
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log(`CORS: Richiesta permessa dall'origine: ${origin}`);
      callback(null, true);
    } else {
      console.error(`CORS: Permesso negato per l'origine: ${origin}`);
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione basata su sessioni.
};

// Passiamo `corsOptions` a cors()
app.use(cors(corsOptions));

// Middleware per il parsing del JSON
app.use(express.json());

// Rotte
app.use("/api/authors", AuthorRoutes);
app.use("/api/blogposts", BlogPostRoutes);
app.use("/api/auth", AuthRoutes);

// Middleware di errore
app.use(error400Handler);
app.use(error401Handler);
app.use(error404Handler);
app.use(error500Handler);

// Connetti a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connesso"))
  .catch((err) => {
    console.error("Errore di connessione a MongoDB:", err);
    process.exit(1); // Termina l'applicazione se non riesce a connettersi a MongoDB
  });

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

// Elenca gli endpoint
console.table(listEndpoints(app));
