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
import path from 'path';


// Configura le variabili d'ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

import {
  error400Handler,
  error401Handler,
  error404Handler,
  error500Handler,
} from "./middlewares/errorHandler.js";

// Crea un'app Express
const app = express();

// Definisci la variabile PORT
const PORT = process.env.PORT || 3000;

// Configurazione CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL, //Permetti richieste da tutte le origini
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Metodi HTTP consentiti
  allowedHeaders: 'Content-Type, Authorization', // Intestazioni consentite
  credentials: true, // Permetti invio di credenziali come i cookie
};

// Passiamo `corsOptions` a cors()
app.use(cors(corsOptions));

// Middleware per il parsing del JSON
app.use(express.json());

// Configurazione sessioni e passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

// Rotte
app.use("/api/authors", AuthorRoutes);
app.use("/api/blogposts", BlogPostRoutes);
app.use("/api/auth", AuthRoutes);

// Servi i file statici di React
app.use(express.static(path.join(__dirname, 'client/build')));

// Gestisci le rotte di React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

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

