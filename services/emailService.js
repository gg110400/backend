import dotenv from 'dotenv';
import mailgun from "mailgun-js";

dotenv.config();

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    throw new Error('MAILGUN_API_KEY e MAILGUN_DOMAIN devono essere definiti nelle variabili d\'ambiente');
}

export const sendEmail = async (to, subject, htmlContent) => {
    const data = {
        from: 'Adotta un Amico - <no-reply@yourdomain.com>',
        to,
        subject,
        html: htmlContent
    };

    try {
        const response = await mg.messages().send(data);
        console.log('Email inviata con successo', response);
        return response;
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
        throw error;
    }
};

export const sendTestEmail = async () => {
    const testEmail = {
        from: 'Adotta un Amico - <no-reply@yourdomain.com>',
        to: 'test@yourdomain.com',
        subject: 'Email di Test',
        html: '<h1>Questa è un\'email di test</h1>'
    };

    try {
        const response = await mg.messages().send(testEmail);
        console.log('Email di test inviata con successo', response);
        return response;
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email di test:', error);
        throw error;
    }
};