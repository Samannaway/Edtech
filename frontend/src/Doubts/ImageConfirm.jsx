import React, { useState } from "react";



const ImageConfirm = (props)=>{

    const [image, setImage] = useState()

    return(
        <div className="imageConfirm">
            <p className="text3">Upload this image?</p>
            <img className="confirmImg" src={props.blob}></img>
            <span className="imageUploadConfirmation flex">
                <button className="likeButton imgConfirmButton"> Yes! </button>
                <button className="likeButton imgConfirmButton"> Cancel </button>
            </span>
        </div>
    )
}


export default ImageConfirm