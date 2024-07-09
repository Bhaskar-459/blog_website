const express = require('express')
const { dirname } = require('path')
const app = express()
const port = 3000
app.set('view engine', 'ejs');
app.use(express.static('public'));
const mongoose = require('mongoose');
const blog = require('./models/model');
const   comment = require('./models/comments');
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/blogdata', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to the database')
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    });
})
.catch((err) => {
    console.log('Error connecting to the database');
    console.log(err);
});

app.get('/', (req, res) => {
  res.render("login");
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'adminblog' && password === 'adminpass') {
    res.redirect('/home');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.get('/home', (req, res) => {
  blog.find().sort({createdAt: -1})
  .then((result) => {
    res.render("index",{blogs:result})
  })
})
app.get('/newblog', (req, res) => {
  res.render("newblog")
})
app.post('/newblog', (req, res) => {
  const { author, title, content } = req.body;
  const newBlog = new blog({
    auth_name: author,
    title: title,
    content: content
  });

  newBlog.save()
  .then(() => {
    res.redirect('/');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error creating new blog');
  });
});
app.get('/blog/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blog ID');
  }

  try {
    const blogPost = await blog.findById(id);
    if (!blogPost) {
      return res.status(404).send('Blog not found');
    }

    const comments = await comment.find({ blog_id: id });
    res.render('details', { blog: blogPost, comments: comments });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/blog/:id/comment', (req, res) => {
  const id = req.params.id;
  const { author, content } = req.body; // Changed 'Contentcomment' to 'content'
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blog ID');
  }
  const newComment = new comment({
    auth_name: author,
    comment: content,
    blog_id: id
  });
  newComment.save()
  .then(() => {
    res.redirect(`/blog/${id}`);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error creating new comment');
  });
});


app.get('/about', (req, res) => {
  res.render("about")
});

