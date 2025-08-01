import React, { useEffect, useState } from "react";
import axios from "axios";
import backend from "../host";
import ImageConfirm from "./ImageConfirm";

const Reply = (props)=>{

    const [authorReply, setAuthorReply] = useState("")
    const [replies, setReplies] = useState([
        {   
            author: "noone",
            replyContent: "none"
        }
    ])
    const [imgUpload, setImgUpload] = useState()
    const [imgBlob, setImgBlob] = useState()
    const [allowReply, setAllowReply] = useState(false)

    const [showImgConf, setShowImgConf] = useState("none")
    useEffect(()=>{
        axios.post(`${backend}/getReplies`,
            {
                quoteId: props.data._id
            }
        ).then(
            e => {
                console.log(e.data)
                const gotReplies = e.data.reverse()
                setReplies(gotReplies)

            }
        )

        props.userData.type === "teacher" && setAllowReply(true)
    }, [])

    const replyUpdate = ()=>{
        if (props.userData.type === "teacher"){


            authorReply != "" &&
            axios.post(`${backend}/reply`, 
            {
                quoteId: props.data._id, 
                replyAuthorId: props.userId,
                reply: authorReply,
                replyType : "text",
                
            }).then(e => {
                console.log(e.data)
                
            }).then( ()=>{
                const currRepliesArr = [
                {
                    type:"text",
                    author: props.userData.username,
                    replyContent: authorReply,
                },...replies]
                

                setReplies(currRepliesArr)
                setAuthorReply("")
            })
        
        
        }
        

    }

    const showConfirmation = (e)=>{
        let targetBlob = URL.createObjectURL(e.target.files[0])
        console.log(targetBlob)
        setImgUpload(e.target.files[0])
        setImgBlob(targetBlob)
        setShowImgConf("pass")
    }


    return(
        <div className="replyArea">
            
            <span className="questionAsked">
                <p className="authorName authorNameReplyNegativeMask">asked by {props.data.author}</p>
                <p className="quoteHere replyQuestion">{props.data.quote}</p>
            </span>
            <span className="replies">
                <h1 className="text2">Replies</h1>

                {replies.map(e => {
                    return (
                    <div className="repliesBlock">
                        <p className="authorName repliesAuthor">{e.author}</p>
                        {e.type === "image"? <img className="replyImage" src={`${e.replyContent}`}></img> 
                            : 
                            <p className="quoteHere replyContent">{e.replyContent}</p>
                        }

                    </div>
                    )
                })}
                
            </span>
            {allowReply === true && (<span className="replySend">
                <textarea 
                    placeholder="hey there! type your reply here."
                    className="replyWritingArea" 
                    value={authorReply}
                    onChange={e => {
                        setAuthorReply(e.target.value)
                    }}
                ></textarea>
                <span className="replyButtonSpan">

                    <input
                        type="file"
                        accept="image/*"
                        id="replySendImg"
                        className="hidden"
                        onChange={ e => showConfirmation(e) }
                    ></input>


                    <div className={showImgConf === "none" && "imgDiv hidden"}>
                        <ImageConfirm 
                            imgData={imgUpload}
                            blob={imgBlob}
                            data={props.data}
                            userId={props.userId}
                            showFlag={"none"}
                        />
                    </div>
                    

                    <label
                        for="replySendImg"
                        className="replySendButton"
                    ><ion-icon name="image"></ion-icon></label>
                    <button 
                        className="replySendButton"
                        onClick={()=>replyUpdate()}    
                    ><ion-icon name="send"></ion-icon></button>

                </span>
            </span>)}
        </div>
    )
}

export default Reply;