import { verifyJWT } from '../utils/jwt.js';
import Authors from '../models/Authors.js';

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Estrai il token dall'header Authorization
    const authHeader = req.headers.authorization;

    // Verifica se l'header contiene il token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token mancante o formato non valido');
      return res.status(401).json({ message: 'Token mancante o formato non valido' });
    }

    // Estrai il token rimuovendo il prefisso 'Bearer '
    const token = authHeader.replace('Bearer ', '');

    // Verifica e decodifica il token
    const decoded = await verifyJWT(token);
    console.log('Token decodificato:', decoded);

    // Usa l'ID dell'autore dal token per trovare l'autore nel database
    const author = await Author.findById(decoded.id).select('-password');

    if (!author) {
      console.log('Autore non trovato nel database');
      return res.status(401).json({ message: 'Autore non trovato' });
    }

    // Aggiungi l'autore alla richiesta
    req.author = author;

    // Passa al prossimo middleware o alla route handler
    next();
  } catch (error) {
    // Log dell'errore
    console.error('Errore durante la verifica del token:', error.message);
    res.status(401).json({ message: 'Token non valido' });
  }
};


export default authMiddleware;