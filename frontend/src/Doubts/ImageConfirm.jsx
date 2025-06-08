import React, { useEffect, useState } from "react";



const ImageConfirm = (props)=>{

    const [show, setShow] = useState(props.showFlag)

    useEffect(()=>{
        setShow(props.showFlag)
    }, [props.blob])

    return(
        <div className={show != "cancel" ? "imageConfirm" : "hidden"}>
    
            <p className="text3">Upload this image?</p>
            <img className="confirmImg" src={props.blob}></img>
    
            <span className="imageUploadConfirmation flex">
                <button 
                    className="likeButton imgConfirmButton"
                    
                > Yes! </button>
                <button 
                    className="likeButton imgConfirmButton"
                    onClick={()=> setShow("cancel")}
                > Cancel </button>
            </span>
    
        </div>
    )
}


export default ImageConfirm