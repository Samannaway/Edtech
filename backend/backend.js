require('dotenv').config()
const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const session = require('express-session')

const app = express()
app.use(express.json({limit: '1mb'}))
app.use(cors({
    origin: process.env.FRONTEND,
    methods: "PUT, GET, POST,",
    credentials: true
}))

app.use(session(
    
    process.env.ENV==="LC"?{
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: false, 
    }:{
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: false,     
        proxy: true,
        saveUninitialized: false,
        cookie: {
            secure: true, // required for cookies to work on HTTPS
            httpOnly: false,
            sameSite: "none"
    }
    
}))


app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser( (user, cb)=>{
    process.nextTick(()=>{
        cb(null, {
            id: user.id, 
            googleId: user.googleId,
            username: user.username,
            profilePic: user.profilePic,
            email: user.email,
            type: user.type
        })
    })
})


passport.deserializeUser((user,cb)=>{
    process.nextTick(()=>{
        return cb(null, user)
    })
})

process.env.ENV==="LC"? 
mongoose.connect(`mongodb://127.0.0.1:27017/edTech`).then(()=>console.log("connected to mongoose local")):
mongoose.connect(`mongodb+srv://samannawayghosh:${process.env.CLUSTER_ACC_KEY}@testingcluster1.npqt6az.mongodb.net/?retryWrites=true&w=majority&appName=TestingCluster1`)
.then(()=>console.log("connected to mongoose"))

const doubtsSchema = new mongoose.Schema({
    doubt: String, 
    author: String, 
    authorId: String,
    likes: Number,
    likeList : Array,
    replies: Array,
})


const Doubts = mongoose.model("doubt", doubtsSchema)
let userSchema = new mongoose.Schema({
    googleId: String,
    username: String,
    email: String, 
    profilePic: String,
    accessToken: String, 
    type: String,
    refreshToken: String,
    doubts: Array,
    followers: Array,
    following: Array,
})

userSchema.statics.findOrCreate = async(query, userdata)=>{
    let founduser = await User.findOne(query)

    if(!founduser){
        founduser = await User.create(userdata)
    }

    return founduser;
}

const User = mongoose.model("user", userSchema)

const teacherVerifySchema = new mongoose.Schema({
    email: String,
})
const Teacher = mongoose.model("teacher", teacherVerifySchema)

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND}/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{

        let typeVal = await Teacher.findOne({email: profile.emails[0].value}) ? "teacher" : "student"
        console.log(typeVal)
        
        const user = await User.findOrCreate(
            { googleId: profile.id }, 
            {
                googleId: profile.id,
                username: profile.displayName,
                profilePic: profile.photos[0].value,
                email: profile.emails[0].value,
                doubts: [],
                followers:[],
                following: [],
                type: typeVal, 
                accessToken : accessToken,
                refreshToken: refreshToken,
            }
        );

        return cb(null, user)

    }catch(err){
        return cb(err, null)
    }    
}
));


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);

    
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: `${process.env.FRONTEND}`}),
    function(req,res){
        res.redirect(`${process.env.FRONTEND}`)
    }
)

app.post('/auth/google/verify', (req,res)=>{

    if(req.user){
        res.send({
            userData: req.user,
            flag: "success"
        })
    }else{
        res.send({flag: null})
    }
})

app.get("/logout", (req,res)=>{
    req.logOut((err)=>{
        if(err){
            console.log(err)
            res.redirect(process.env.FRONTEND)
        }
    })
    res.redirect(process.env.FRONTEND)
})

app.post("/makePost", async(req,res)=>{
    
    const content = req.body.content    
    const authorId = req.body.userId

    const foundUser = await User.findOne({googleId: authorId})

    if (foundUser) {
        const post = new Doubts(
            {
                doubt: content,
                author: foundUser.username,
                authorId: authorId,
                likes: 0,
                likeList: [],
            }
        )
        await Doubts.insertOne(post).catch(err => console.log(err))
        res.send("backend : success")

    }else{
        console.log("user not found")
    }
})


app.post("/getPosts", async(req,res)=>{

    let userId = req.body.userId

    try{
        let foundItems = await Doubts.find({})
        let foundUser = await User.findOne({googleId: userId})

        res.send(
            {
                doubts: foundItems, 
                following: foundUser.following
            }
        )
    }catch(err){
        console.log(err)
    }
})

app.post("/fetchPosts", async (req,res)=>{

    const userId = req.body.userId
    console.log("triggered")
    const foundDoubts = await Doubts.find({authorId: userId})
    const foundUser = await User.findOne({googleId: userId})
    console.log(foundDoubts, foundUser)
    if (foundDoubts) {
        res.send(
            {
                doubt: foundDoubts,
                followers: foundUser.followers,
                following: foundUser.following
            }
        )
    }else{
        console.log("no doubts found err occured")
        res.send("no doubts found err occured")
    }
})

app.post("/like", async (req,res)=>{

    const quoteId = req.body.quoteId
    const userId = req.body.userId

    const foundQuote = await Doubts.findOne({_id: quoteId})

    if (foundQuote) {

        let likeCount = foundQuote.likes
        let likeList = foundQuote.likeList
        likeList.push(userId)

        const updatedItems = await Doubts.updateOne({_id: quoteId}, {likes: (likeCount+1), likeList: likeList})
        res.send(`documents modified : ${updatedItems.modifiedCount}}`)

    }else{
        console.log("err doubt not found")
        res.send("err : doubt not found")
    }
})

app.post('/getFollowers', async (req,res)=>{
    let userId = req.body.userId

    const nameFunction = async (loggedUser)=>{
        
        const nameArray = await Promise.all(
            loggedUser.followers.map(
                async(x)=>{
                    const folUs = await User.findOne({googleId:x})
                    return folUs.username
                }
            )
        )
        
        return nameArray
    }
    
    const user = await User.findOne({googleId: userId})
    const names = await nameFunction(user)

    res.send(names)
})


app.post('/unlike', async (req,res)=>{

    const quoteId = req.body.quoteId
    const userId = req.body.userId
    
    const foundQuote = await Doubts.findOne({_id: quoteId})
    if (foundQuote){
        let likeCount = foundQuote.likes
        let likeList = foundQuote.likeList
        let newLikeList = likeList.filter((e)=>e!=userId)
        const updatedItems = await Doubts.updateOne({_id: quoteId}, {likes: (likeCount-1), likeList: newLikeList})
        res.send(`documents modified : ${updatedItems.modifiedCount}`)
    }else{
        console.log("err doubt not found")
        res.send("err : doubt not found")
    }

})


app.post('/follow', async(req,res)=>{

    const userId = req.body.userId
    const authorId = req.body.authorId

    const foundUser = await User.findOne({googleId:userId})
    const foundAuthor = await User.findOne({googleId: authorId})
    
    if (foundUser && foundAuthor && authorId != userId){
        let followers = foundAuthor.followers 
	followers.push(userId)
        
        let following = foundUser.following
        following.push(authorId)

        await User.updateOne({googleId: authorId}, {followers: followers})
        await User.updateOne({googleId: userId}, {following: following})
        res.send("user followers updated")
    }else{
        console.log('user not found')
    }

})
const {uploadImage} = require('./cloudinaryImg')

app.post("/reply", async(req,res)=>{
    const replyAuthorId = req.body.replyAuthorId 
    const replyType = req.body.replyType
    const reply = req.body.reply
    const quoteId = req.body.quoteId

    const foundAuthor = await User.findOne({googleId: replyAuthorId})
    const replyAuthorName = foundAuthor.username

    async function replySelector() {
        if (replyType === "text"){
            return reply
        }else if (replyType === "image"){
            let imageLink = await uploadImage(reply).then(r =>  r.url)
            console.log(imageLink)
            return imageLink
        }
        
    }

    let processedReply = await replySelector()
    console.log("processed reply : "+ processedReply)
    const replyElement = {
        type : replyType,
        authorId: replyAuthorId,
        author: replyAuthorName,
        replyContent: processedReply,
    }

    

    const foundQuote = await Doubts.findOne({_id: quoteId})
    const foundReplies = foundQuote.replies
    foundReplies.push(replyElement)

    await Doubts.findOneAndUpdate({_id: quoteId}, {replies: foundReplies})
    res.send("successfully sent")

})


app.post("/getReplies", async(req,res)=>{
    const quoteId = req.body.quoteId 
    const quoteFound = await Doubts.findOne({_id: quoteId})
    const foundReplies = quoteFound.replies

    res.send(foundReplies)
})

app.listen(process.env.PORT, ()=>{console.log("server started")})
