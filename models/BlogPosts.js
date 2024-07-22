import mongoose from 'mongoose';



const commentSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      content: { type: String, required: true },
    },
    {
      timestamps: true,
      _id: true // Mi assicuro che ogni commento abbia un proprio _id univoco
    },
  );

const BlogPostSchema = new mongoose.Schema({
    categoria: {
        type: String,
        required: true
    },
    titolo: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    autore: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'blogposts'
});

export default mongoose.model('BlogPost', BlogPostSchema);
