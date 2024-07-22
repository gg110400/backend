import express from 'express';
import BlogPosts from '../models/BlogPosts.js';
import upload from '../middlewares/upload.js';
import { sendEmail } from '../services/emailService.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';


const router = express.Router();



// Rotta per ottenere tutti i post del blog
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPosts.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rotta per ottenere un singolo post del blog per ID
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        } else {
            res.json(post);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rotta per creare un nuovo post del blog
/*router.post('/', async ( req, res) => {
    const post = new BlogPosts({
        titolo: req.body.titolo,
        content: req.body.content,
        categoria: req.body.categoria,
        cover: req.body.cover,
        autore: req.body.autore
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});*/


// POST /blogPosts: crea un nuovo blog post (AGGIORNATA AD UPLOAD!)
// router.post("/", upload.single("cover"), async (req, res) => {
    router.post("/", cloudinaryUploader.single('cover'), async (req, res) => {
        try {
          const postData = req.body;
          console.log('ciao mamma');
          if (req.file) {
            // postData.cover = `http://localhost:5001/uploads/${req.file.filename}`;
            postData.cover = req.file.path; // Cloudinary restituirà direttamente il suo url
          }
          const newPost = new BlogPosts(postData);
          await newPost.save();

          const htmlContent=   
          `<h1>Nuovo post del blog creato</h1>
          <p>Il tuo nuovo post del blog è stato creato con successo.</p>
          <h2>Dettagli del post:</h2>
          <ul>
            <li><strong>Titolo:</strong> ${newPost.titolo}</li>
            <li><strong>Categoria:</strong> ${newPost.categoria}</li>
            <li><strong>Autore:</strong> ${newPost.autore}</li>
            <li><strong>Copertina:</strong> <img src="${newPost.cover}" alt="Copertina del post"></li>
          </ul>`
      
          await sendEmail(newPost.autore, 'Il tuo post è stato correttamente pubblicato', htmlContent )
      
          res.status(201).json(newPost);
        } catch (error) {
          console.error(error);
          res.status(400).json({ message: error.message });
        }
      });
      
// Rotta per aggiornare un post del blog per ID
router.put('/:id', async (req, res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if (!post)  {
            return res.status(404).json({ message: 'Post non trovato' });
        }

        if (req.body.titolo != null) {
            post.titolo = req.body.titolo;
        }
        if (req.body.content != null) {
            post.content = req.body.content;
        }
        if (req.body.categoria != null) {
            post.categoria = req.body.categoria;
        }
        if (req.body.cover != null) {
            post.cover = req.body.cover;
        }
        if (req.body.readTime != null) {
            post.readTime = {
                valore: req.body.readTime.valore,
                unita: req.body.readTime.unita
            };
        }
        if (req.body.autore != null) {
            post.autore = req.body.autore;
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rotta per aggiornare parzialmente un post del blog per ID
router.patch('/:id', async (req, res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        }

        // Aggiorna solo i campi forniti nel corpo della richiesta
        Object.keys(req.body).forEach(key => {
            post[key] = req.body[key];
        });

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rotta per eliminare un post del blog per ID
router.delete('/:id', async (req, res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if (!post)  {
            return res.status(404).json({ message: 'Post non trovato' });
        }

        await post.remove();
        res.json({ message: 'Post eliminato' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
    try {
      // Verifica se è stato caricato un file o meno
      if (!req.file) {
        return res.status(400).json({ message: "Ops, nessun file caricato" });
      }
  
      // Cerca il blog post nel db
      const blogPost = await BlogPost.findById(req.params.blogPostId);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post non trovato" });
      }
  
      // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
      blogPost.cover = req.file.path;
  
      // Salva le modifiche nel db
      await blogPost.save();
  
      // Invia la risposta con il blog post aggiornato
      res.json(blogPost);
    } catch (error) {
      console.error("Errore durante l'aggiornamento della copertina:", error);
      res.status(500).json({ message: "Errore interno del server" });
    }
  });


  //cerco i commenti su un post
  router.get("/:id/comments", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      res.json(post.comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //cerco un commento specifico di un post specifico
  router.get("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //aggiungo un nuovo commento ad un post specifico
  router.post("/:id/comments", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const newComment = {
        name: req.body.name,
        email: req.body.email,
        content: req.body.content
      };
      post.comments.push(newComment);
      await post.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  //cambio un commento di un post specifico
  router.put("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      comment.content = req.body.content;
      await post.save();
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  //elimino un commento specifico da un post specifico
  router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      comment.remove();
      await post.save();
      res.json({ message: "Commento eliminato con successo" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


export default router;