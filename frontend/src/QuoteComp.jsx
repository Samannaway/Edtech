import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import backend from "./host";


const QuoteComp = (props)=>{


    let [postLike, setPostLike] = useState(props.data.likes)
    let [likeList, setLikeList] = useState(props.data.likeList)
    let [followList, setFollowList] = useState(props.following)
    let [flag, setFlag] = useState(null)
    let [followFlag, setFollowFlag] = useState(null)


    const like = ()=>{

        if (flag === undefined) {
        
            let newPostLike = postLike+1
            setPostLike(newPostLike)
            setFlag("available")
            
            axios.post(`${backend}/like`, {userId: props.userId, quoteId: props.data._id})
            .then(res => console.log(res))
            .catch(err => console.log(err))                
        
        }else{
            
            let newPostLike = postLike-1
            setPostLike(newPostLike)
            setFlag(undefined)
            axios.post(`${backend}/unlike`, {userId: props.userId, quoteId: props.data._id})
            .catch(err => console.log(err))
        }
    }

    const follow = ()=>{
        axios.post(`${backend}/follow`, {userId: props.userId, authorId: props.data.authorId})
        .catch(err=> console.log(err))
    
    }


    useEffect(()=>{
        let exists = likeList.find( e => e === props.userId)
        setFlag(exists)

        let followExists = followList.find(e => e === props.data.authorId)
        setFollowFlag(followExists)
    }, [])


    return(
        <div className="quoteComponentComplete">
            <div className="quoteComponent">
                <p className="authorName">{props.data.author}</p>
                <p className="quoteHere">{props.data.quote}</p>

                <div className="quoteActions">
                    <span className="flex">
                        <button className="likeButton"
                            onClick={()=>like()}
                        >
                        {flag === undefined? <ion-icon name="arrow-up-circle-outline"></ion-icon> : <ion-icon name="arrow-up-circle"></ion-icon>} upvote
                        </button>
                    </span>
                    {followFlag === undefined && 
                        <button className="followButton"
                            onClick={()=>follow()}
                        >Reply <ion-icon name="person-add"></ion-icon></button>
                    }
                
                </div>
            </div>
            
        </div>
    )
}

export default QuoteComp;