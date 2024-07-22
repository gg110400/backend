import { verifyJWT } from "../utils/jwt"; // Importa la funzione verifyJWT dal modulo jwt
import Authors from '../models/Authors.js'; // Importa il modello Authors

// Definisce il middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
    try {
        // Estrae il token dall'header della request
        const token = req.headers.authorization?.replace('Bearer ', '');

        // Se manca il token risponde con errore 401
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token is missing' });
        }

        // Verifica e decodifica il token usando una funzione
        const decoded = await verifyJWT(token);
        console.log('Decoded token', decoded); // Log del token decodificato

        // Ricerca l'autore nel database
        const author = await Authors.findById(decoded.id).select('-password');
        console.log('Author', author); // Log dell'autore trovato

        // Se l'autore non esiste risponde con errore 401
        if (!author) {
            return res.status(401).json({ message: 'Unauthorized, author not found and token not valid' });
        }

        // Aggiunge l'autore alla request
        req.author = author;
        next(); // Passa al middleware successivo
    } catch (error) {
        console.log(error); // Log dell'errore
        res.status(401).json({ message: 'Unauthorized, token not valid' }); // Risponde con errore 401
    }
}

export default authMiddleware