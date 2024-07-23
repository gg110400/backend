import express from "express";
import Authors from "../models/Authors.js";
import jwt from "jsonwebtoken";
import { generateJWT } from "../utils/jwt.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Rotta per il login che restituisce un token di accesso
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Authors.findOne({ email });
    if (!author) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }
    // Verifica della password (aggiungi la tua logica di verifica qui)
    const isMatch = await author.comparePassword(password); // Sostituisci con la tua logica di verifica
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = await generateJWT({ id: author._id });
    console.log(token);
    return res
      .status(200)
      .json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", authMiddleware, (req, res) => {


  // Converte il documento Mongoose in un oggetto JavaScript semplice
  const authorData = req.author.toObject();
  
  // Rimuove il campo password per sicurezza
  delete authorData.password;
  
  // Invia i dati dell'autore come risposta
  res.json(authorData);
});

// Rotta per iniziare il processo di autenticazione Google
router.get(
  "api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Rotta di callback per l'autenticazione Google
router.get(
  "api/auth/google/callback",
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  handleAuthCallback
);

// Rotta per iniziare il processo di autenticazione GitHub
router.get(
  "api/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
// Questo endpoint inizia il flusso di autenticazione OAuth con GitHub
// 'github' si riferisce alla strategia GitHubStrategy configurata in passportConfig.js
// scope: specifica le informazioni richiediamo a GitHub (email)

// Rotta di callback per l'autenticazione GitHub
router.get(
  "api/auth/github/callback",
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login` }),
  handleAuthCallback
);

// Funzione helper per gestire il callback di autenticazione
async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    // Usa FRONTEND_URL per il reindirizzamento
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Errore nella generazione del token:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
}

export default router;