import React, { useState } from "react";
import axios from "axios"
import backend from "./host"

const Create = (props)=>{

    const [content, createContent] = useState()

    const sendBackend = ()=>{
        axios.post(`${backend}/makePost`, {content: content, userId: props.data.googleId})
        .then((res)=>{console.log(res.data)})
        .catch((err)=>{console.log(err)})

        createContent("")
    }
    
    return(
        <div className="createDiv">
            <h1 className="createDivHeader">hey! there write here!</h1>
            <textarea type="text" className="createArea" value={content} onChange={(e)=>{createContent(e.target.value)}}></textarea>
            <button className="createButton" onClick={()=>{sendBackend()}}>Post</button>
        </div>
    )
}


export default Create;