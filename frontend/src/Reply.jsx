import React, { useState } from "react";
import axios from "axios";

const Reply = (props)=>{

    const [authorReply, setAuthorReply] = useState("")

    return(
        <div className="replyArea">
            
            <span className="questionAsked">
                <p className="authorName">Samannway Ghosh</p>
                <p className="quoteHere">{props.data.quote}</p>
            </span>
            <span className="replies">
                <h1>Replies</h1>

                <div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div>
                
                <div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div><div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div><div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div><div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div><div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div><div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div><div className="repliesBlock">
                    <p className="authorName repliesAuthor">Samannway Ghosh</p>
                    <p className="quoteHere">This the answer</p>
                </div>


                
            </span>
            <span className="replySend">
                <textarea 
                    className="replyWritingArea" 
                    value={authorReply}
                    onChange={e => setAuthorReply(e.target.value)}
                ></textarea>
                <button className="replySendButton"><ion-icon name="send"></ion-icon></button>
            </span>
        </div>
    )
}

export default Reply;