import React, { useEffect, useState } from "react";
import QuoteComp from "./QuoteComp";
import './index.css'
import axios from "axios";
import backend from "./host";

const Read = (props)=>{

    const [quotesArray, setQuotesArray] = useState(
        []
    )
    let [following, setFollowing] = useState([])

    useEffect(()=>{
        axios.post(`${backend}/getPosts`, {userId: props.data.googleId})
        .then((res)=>{
            setQuotesArray(res.data.quotes)    
            setFollowing(res.data.following)        
        })
        .catch(err => console.log(err))
    }, [])

    return(
        <div className="ReadDiv">
            {quotesArray.map((e, index)=>{
                return <QuoteComp 
                    key = {index}
                    data={e}
                    userData = {props.data}
                    userId={props.data.googleId}
                    following={following}
                />
            })}
        </div>
    )
}

export default Read