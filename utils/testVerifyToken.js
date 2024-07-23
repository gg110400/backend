import { verifyJWT } from './jwt.js';


console.log('eCCO IL SECRET',process.env.JWT_SECRET);
// Sostituisci con un token di test valido
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWY3NDdmNTVlZWRlYzU4N2U4MGNjNCIsImlhdCI6MTcyMTczMjY4MiwiZXhwIjoxNzI0MzI0NjgyfQ.5n52YbIV_TrCK5mpfn_C9sRBKtzbAci19TV-Rt0h--s';

const testVerifyToken = async () => {
  try {
    const decoded = await verifyJWT(testToken);
    console.log('Token decodificato:', decoded);
  } catch (error) {
    console.error('Errore nella verifica del token:', error);
  }
};

testVerifyToken();
