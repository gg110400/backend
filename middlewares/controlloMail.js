const controlloMail = (req, res, next) => {
    const EMAIL_AUTORIZZATA = 'email@example.com'; // Definisci la mail specifica qui
    const mailUtente= req.headers[user-email];
    if (mailUtente === EMAIL_AUTORIZZATA) {
        next(); // Se la mail corrisponde, passa al prossimo middleware
    } else {
        res.status(400).send('Email non valida'); // Altrimenti, restituisci un errore
    }
};

export default controlloMail;