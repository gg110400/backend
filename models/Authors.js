import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    cognome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dataDiNascita: {
      type: Date,
    },
    avatar: {
      type: String,
      required: false,
    },
    password: {
      type: String,
    },
    googleId: { 
      type: String 
    }, // Campo per l'ID di Google
    githubId: { 
      type: String 
    }, // Campo per l'ID di GitHub
  },
  {
    timestamps: true,
    collection: "authors", // Specifica della collezione
  }
);

// Funzione che confronta la password
authorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Middleware per hashing della password prima di salvare
authorSchema.pre("save", async function (next) {
  try {
    // Controlla se la password è stata modificata
    if (!this.isModified("password")) {
      return next();
    }

    // Genera un salt
    const salt = await bcrypt.genSalt(10);

    // Hash della password usando il salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

const Authors = mongoose.model("Authors", authorSchema);

export default Authors;
