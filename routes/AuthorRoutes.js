import express from 'express';
import Authors from '../models/Authors.js';
import BlogPosts from '../models/BlogPosts.js';
import cloudinaryUploader from "../config/cloudinaryConfig.js";

const router = express.Router();

// GET /authors
router.get('/', async (req, res) => {
  try {
    const authors = await Authors.find();
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /authors/:id
router.get('/:id', async (req, res) => {
  try {
    const author = await Authors.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    } else {
      res.json(author);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /authors
router.post('/', async (req, res) => {
  try {
    const newAuthor = new Authors(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad Request' });
  }
});

// PUT /authors/:id
router.put('/:id', async (req, res) => {
  try {
    let author = await Authors.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    } else {
      author = await Authors.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(author);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /authors/:id
router.delete('/:id', async (req, res) => {
  try {
    const author = await Authors.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    } else {
      await Authors.findByIdAndDelete(req.params.id);
      res.json({ message: 'Author deleted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /authors/:id/blogposts
router.get('/:id/blogposts', async (req, res) => {
  try {
    const author = await Authors.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    } else {
      const blogposts = await BlogPosts.find({ author: author.email });
      res.json(blogposts);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// PATCH /authors/:authorId/avatar: carica un'immagine avatar per l'autore specificato
router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file, se non l'ho caricato rispondo con un 400
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }

    // Cerca l'autore nel database, se non esiste rispondo con una 404
    const author = await Authors.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }

    // Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
    author.avatar = req.file.url;

    // Salva le modifiche nel db
    await author.save();

    // Invia la risposta con l'autore aggiornato
    res.json(author);
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'avatar:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

export default router;