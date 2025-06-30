const express = require("express");
const router = express.Router();

const slugify = require("slugify");

const Blog = require("../models/blog.js");
const {isLoggedIn} = require("../middlewares/blog.js");


// home route
router.get("/",async(req,res)=>{
    const posts = await Blog.find().sort({_id:-1});
    //console.log(posts);
    res.render("index.ejs",{posts});
})


// get route
router.get("/posts/:slug",async(req,res)=>{
    const post = await Blog.findOne({slug:req.params.slug});
    //console.log(post);

    res.render("post.ejs",{post});
})


// admin route
router.get("/admin",isLoggedIn, (req,res)=>{
    res.render("admin.ejs");
})


router.post("/admin",isLoggedIn, async(req,res)=>{
    const {title, content, image} = req.body;
    const slug = slugify(title,{lower:true, strict:true});

    await Blog.create({title,content,image, slug});

    req.flash("success", "New post created successfully!");

    res.redirect("/");
})




// edit route
router.get('/edit/:slug', isLoggedIn, async(req, res)=>{
  const post = await Blog.findOne({slug: req.params.slug});
  res.render('edit.ejs', { post });
});


router.post('/edit/:slug', isLoggedIn,  async (req, res) => {
  const {title, content,image} = req.body;
  const slug = slugify(title, {lower: true, strict: true});

  await Blog.findOneAndUpdate({slug: req.params.slug}, {title, content, image, slug});
  req.flash("success", "Post updated successfully!");
  res.redirect('/');

});



// deleete route

router.get('/delete/:slug', isLoggedIn, async (req, res) => {

  await Blog.findOneAndDelete({ slug: req.params.slug });
  
  req.flash("success", "Post deleted successfully!");
  res.redirect('/');

});


module.exports = router;