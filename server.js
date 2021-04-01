const express=require("express")
const app=express();
const mongoose=require("mongoose")
const articlerouter=require('./routes/articles')
const Blog=require('./models/blog')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost/blog',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

app.get('/', async (req,res) => {
    const blog=await Blog.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index', {blog: blog})
})

app.use('/blogs/',articlerouter);
app.listen(3000);