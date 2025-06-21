import axios from "axios";
import React, { useEffect, useState } from "react";
import backend from "../host";
import imageCompression from "browser-image-compression"

const ImageConfirm = (props)=>{

    const [show, setShow] = useState(props.showFlag)

    const blobToBase = async (url)=>{
        const imageRes = await fetch(url)
        const blobData = await imageRes.blob()

        return new Promise((resolve, reject)=>{
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blobData)
        })
    }

    async function compressAndConvertToBase64(file) {
        const options = {
            maxSizeMB: 1,          // Target size (in MB)
            maxWidthOrHeight: 1024,  // Resize (maintains aspect ratio)
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
            return base64; // Safe to send to backend
        } catch (error) {
            console.error('Compression error:', error);
        }
    }


    const sendImg = async ()=>{
        let compressedImg = await compressAndConvertToBase64(props.imgData)

        await axios.post(`${backend}/reply`, {
            quoteId : props.data._id,
            replyAuthorId : props.userId,
            reply : compressedImg,
            replyType : "image"
        })

        setShow("cancel")
    }

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
                    onClick={()=> {
                        sendImg()
                        setShow("cancel")
                    }}
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