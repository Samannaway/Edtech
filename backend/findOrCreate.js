const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    googleId: String,
    username: String,
    email: String, 
    accessToken: String, 
    refreshToken: String 
})

userSchema.statics.findOrCreate = async(query, userdata)=>{
    const founduser = await this.findOne(query)

    if(!founduser){
        founduser = await this.create(userdata)
    }

    return founduser;
}

const User = mongoose.model("user", userSchema)

module.exports = User