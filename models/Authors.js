import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dataDiNascita: {
        type: Date,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required:true
    }
}, { 
    timestamps: true,
    collection: 'authors' // Specifica della collezione
});

const Author = mongoose.model('Author', authorSchema);

export default Author;
