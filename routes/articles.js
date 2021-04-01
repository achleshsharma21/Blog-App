const express=require('express');
const { exists } = require('./../models/blog');
const Blog=require('./../models/blog')
const router = express.Router();
const alert = require('alert');

router.get('/new',(req,res) => {
    res.render('articles/new',{blog: new Blog()})
})

router.get('/:slug',async (req,res)=>{
    const blog=await Blog.findOne({
        slug: req.params.slug
    })
    if(blog==null) res.redirect('/')
    res.render('articles/show', {blog: blog })
})

router.get('/edit/:id',async (req,res) => {
    const blog=await Blog.findById(req.params.id)
    res.render('articles/edit',{blog:blog})
})

router.put('/like/:id',async (req,res)=>{
    await Blog.findById(req.params.id,function(err,blog){
        if(err)
        {
            console.log(err);
        }
        else {
            blog.likes +=1;
            blog.save();
            console.log(blog.likes);
        }
    })
    res.redirect('/');
})

router.put('/:id',async (req,res,next)=>{
    req.blog=await Blog.findById(req.params.id)
    next()
 },saveBlogAndRedirect('edit'))

router.post('/',async (req,res,next)=>{
   req.blog=new Blog()
   next()
},saveBlogAndRedirect('new'))

router.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/')
  })

function saveBlogAndRedirect(path) {
    return async (req,res) =>{
        let blog=req.blog
            blog.title=req.body.title,
            blog.description=req.body.description,
            blog.markdown=req.body.markdown
          try {
          blog = await blog.save()
          res.redirect(`/blogs/${blog.slug}`) 
          }
          catch(e){
            res.render(`articles/${path}`,{blog:blog})
          }
    }
}

module.exports=router;