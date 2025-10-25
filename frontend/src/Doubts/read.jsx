import React, { useEffect, useState } from "react";
import QuoteComp from "./QuoteComp";
import axios from "axios";
import backend from "../host";

const Read = (props)=>{

    const [quotesArray, setQuotesArray] = useState(
        []
    )
    let [following, setFollowing] = useState([])

    useEffect(()=>{
        axios.post(`${backend}/getPosts`, {userId: props.data.googleId})
        .then((res)=>{
            console.log(res.data)
            setQuotesArray(res.data.doubts)    
            setFollowing(res.data.following)      
            console.log(quotesArray)  
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