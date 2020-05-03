//importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

// creating initial content of pages
const homeStartingContent = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente laborum facere aliquid, nobis adipisci deleniti et dolorum quia? In iure nihil ipsam. Necessitatibus, ipsum? Maiores dolor dolorem quibusdam vel itaque.
Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, pariatur et obcaecati tempore officia incidunt cumque est eligendi perspiciatis minus dignissimos at impedit. Tempora rerum ullam, natus totam excepturi ducimus?
Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis placeat, beatae voluptates enim ut, rem quia nesciunt tenetur sint repellendus adipisci impedit? Voluptate ab, aspernatur nemo hic libero quam delectus.`

const aboutStartingContent = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente laborum facere aliquid, nobis adipisci deleniti et dolorum quia? In iure nihil ipsam. Necessitatibus, ipsum? Maiores dolor dolorem quibusdam vel itaque.
Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, pariatur et obcaecati tempore officia incidunt cumque est eligendi perspiciatis minus dignissimos at impedit. Tempora rerum ullam, natus totam excepturi ducimus?
Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis placeat, beatae voluptates enim ut, rem quia nesciunt tenetur sint repellendus adipisci impedit? Voluptate ab, aspernatur nemo hic libero quam delectus.`

const contactStartingContent = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente laborum facere aliquid, nobis adipisci deleniti et dolorum quia? In iure nihil ipsam. Necessitatibus, ipsum? Maiores dolor dolorem quibusdam vel itaque.
Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, pariatur et obcaecati tempore officia incidunt cumque est eligendi perspiciatis minus dignissimos at impedit. Tempora rerum ullam, natus totam excepturi ducimus?
Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis placeat, beatae voluptates enim ut, rem quia nesciunt tenetur sint repellendus adipisci impedit? Voluptate ab, aspernatur nemo hic libero quam delectus.`


const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
mongoose.connect('mongodb://localhost/Blogging', {useNewUrlParser: true});

const POSTschema = new mongoose.Schema({
    postTitle : String,
    postContent : String,
})

const Post = mongoose.model('Post', POSTschema);

const ContactSchema = new mongoose.Schema({
    name : String,
    email : String,
    comment : String
});

const Contact = mongoose.model('contact',ContactSchema);

// Global Variable Section
let postList = [];
let postObject = "";
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    Post.find({},(err,postList)=>{
        if(err){
            console.log(err);
        }else{
            res.render('home',{homeContent : postList ,newPost : postList});
        }
    });
});

app.get('/about',(req,res)=>{
    res.render('about',{aboutContent : aboutStartingContent});
})

app.get('/contact',(req,res)=>{
    Contact.find({},(err,commentList)=>{
        if(!err){
            res.render('contact',{comment : commentList});
        }
    });
    
    
})

app.post('/contact',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const comment = req.body.comment;
    const newContact = new Contact({
        name : name,
        email : email,
        comment : comment,
    })
    newContact.save();
    res.redirect('/contact');
});
// Compose
app.get('/compose',(req,res)=>{
    res.render('compose');
})

app.post('/compose',(req,res)=>{
    const title = req.body.title;
    const postbody = req.body.post;   
    const newPost = new Post({
       postTitle : title,
       postContent : postbody
    });
    newPost.save();
    res.redirect('/');
})

app.get(`/posts/:postID`, function(req, res) {
    var requestedURL = req.params.postID;
    Post.findOne({_id : requestedURL},(err,post)=>{
            res.render('post',{
                title : post.postTitle,
                newPost : post.postContent
            });
    })
  })


app.listen(3000,()=>{
    console.log("Loading...");
})