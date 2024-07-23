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
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Questo endpoint inizia il flusso di autenticazione OAuth con Google
// 'google' si riferisce alla strategia GoogleStrategy configurata in passportConfig.js
// scope: specifica le informazioni richiediamo a Google (profilo e email)

router.get('/google/callback', 
  (req, res, next) => {
    console.log('Inizio callback Google');
    passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` })(req, res, next);
  },
  async (req, res) => {
    console.log('Autenticazione Google riuscita');
    try {
      console.log('Utente autenticato:', req.user);
      const token = await generateJWT({ id: req.user._id });
      console.log('Token generato:', token);
      const redirectURL = `${FRONTEND_URL}/login?token=${token}`;
      console.log('Reindirizzamento a:', redirectURL);
      res.redirect('https://www.google.com');
    } catch (error) {
      console.error('Errore dettagliato:', error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed&message=${encodeURIComponent(error.message)}`);
    }
  }
);

// Funzione helper per gestire il callback di autenticazione
async function handleAuthCallback(req, res) {
  try {
    // Genera un JWT (JSON Web Token) per l'utente autenticato
    // req.user contiene i dati dell'utente forniti da Passport dopo l'autenticazione
    const token = await generateJWT({ id: req.user._id });

    // Reindirizza l'utente al frontend, passando il token come parametro URL
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    // Se c'è un errore nella generazione del token, lo logghiamo
    console.error('Errore nella generazione del token:', error);
    // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
}

export default router;