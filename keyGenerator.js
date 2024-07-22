import crypto, { randomBytes } from 'crypto';


//genera una chiave casuale di 64 byte
console.log(crypto.randomBytes(64).toString('hex'));