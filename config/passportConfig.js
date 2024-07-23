// Importiamo le dipendenze necessarie
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from 'passport-github2'; // NEW! importo strategia GitHub
import Authors from "../models/Authors.js";


// Configuriamo la strategia di autenticazione Google
passport.use(
  new GoogleStrategy(
    {
      // Usiamo le variabili d'ambiente per le credenziali OAuth
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // L'URL a cui Google reindizzerà dopo l'autenticazione
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
    },
    // Questa funzione viene chiamata quando l'autenticazione Google ha successo
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerchiamo se esiste già un autore con questo ID Google
        let author = await Authors.findOne({ googleId: profile.id });

        console.log("LOG AUTORE", author);

        // Se l'autore non esiste, ne creiamo uno nuovo
        if (!author) {
          author = new Authors({
            googleId: profile.id, // ID univoco fornito da Google
            nome: profile.name.givenName, // Nome dell'utente
            cognome: profile.name.familyName, // Cognome dell'utente
            email: profile.emails[0].value, // Email principale dell'utente
            // Nota: la data di nascita non è fornita da Google, quindi la impostiamo a null
            dataDiNascita: null,
          });
          // Salviamo il nuovo autore nel database
          await author.save();
        }

        // Passiamo l'autore al middleware di Passport
        // Il primo argomento null indica che non ci sono errori
        done(null, author);
      } catch (error) {
        // Se si verifica un errore, lo passiamo a Passport
        done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub Callback URL:', `${BACKEND_URL}/api/auth/github/callback`);
        console.log('GitHub Profile:', profile);
        
        let author = await Authors.findOne({ githubId: profile.id });

        if (!author) {
          author = new Authors({
            githubId: profile.id,
            nome: profile.displayName || profile.username,
            cognome: '',
            email: profile.emails[0].value,
            dataDiNascita: null,
          });
          await author.save();
        }

        done(null, author);
      } catch (error) {
        console.error('Error during GitHub authentication:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Authors.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Esportiamo la configurazione di Passport
export default passport;