require("dotenv").config()
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,

})


console.log(cloudinary.config())


const uploadImage = async (imageInput) => {

    try{
        const result = await cloudinary.uploader.upload(imageInput)
        return {url: result.secure_url}        
    }catch (err){
        console.log(err)
    }
    
}


module.exports = uploadImage