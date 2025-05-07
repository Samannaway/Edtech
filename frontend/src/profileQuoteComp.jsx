import React from "react";


const ProfileQuoteComp = (props)=>{
    return(
        <div className="quoteComponentComplete">
            <div className="quoteComponent">
                <p className="authorName">{props.author}</p>
                <p className="quoteHere">{props.quote}</p>
            </div>
            <div className="quoteActions">
                <span className="flex">
                    <button className="likeButton">
                    Del <ion-icon name="heart"></ion-icon>
                    </button>
                </span>
                <button className="followButton">
                    Edit <ion-icon name="person-add"></ion-icon>
                </button>
            </div>
        </div>
    )
}

export default ProfileQuoteComp;