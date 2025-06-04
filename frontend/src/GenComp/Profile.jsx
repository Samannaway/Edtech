import axios from "axios";
import React, { useEffect, useState } from "react";
import backend from "../host";
import QuoteComp from "../Doubts/QuoteComp";
import ProfileQuoteComp from "./profileQuoteComp";
import Followers from "./Followers";


const Profile = (props)=>{

    let [userPosts, setUserPosts] = useState([])
    let [followers, setFollowers] = useState([])
    let [following, setFollowing] = useState([])
    let [folShoFla, setFolShoFla] = useState(false)


    useEffect(()=>{
        axios.post(`${backend}/fetchPosts`, {userId: props.data.googleId})
        .then(res => {
            setUserPosts(res.data.quotes)
            setFollowers(res.data.followers)
            setFollowing(res.data.following)
        })
        .catch(err => console.log(err))
    }, [])

    const showFollowers = ()=>{
        folShoFla == false ? setFolShoFla(true) : setFolShoFla(false) 
    }
    
    return(
        <div className="profileDiv">
            {folShoFla === true && <div><button className="closeButton" onClick={()=>setFolShoFla(false)}> <ion-icon name="close"></ion-icon> </button> <Followers googleId={props.data.googleId}/></div>}
            <div className="userDetails">

                <span className="flex flexProfileDet profTop">
                    
                    <img 
                        className="profilePic" 
                        src={props.data.profilePic}
                        alt="profilePic"
                        referrerPolicy="no-referrer"
                    ></img>
                    <span className="flex-down">
                        
                        <h1 className="profileName">{props.data.username}</h1>
                        
                        <span className="flex followSection">
                            <span className="flex followClass"> 
                                <button 
                                    className="showFollowers"
                                    onClick={() => showFollowers()}
                                >Followers </button> 
                                <h1 className="followNumber">{followers.length}</h1> 
                            </span>
                            <span className="flex followClass">
                                <button
                                 className="showFollowers"
                                >Following</button> 
                                <h1 className="followNumber">{following.length}</h1> 
                            </span>
                        </span>


                    </span>
                </span>
            </div>
            <div className="userPosts">
                {userPosts.map((e, i) => {
                    return <ProfileQuoteComp quote={e.quote} author={e.author}/>
                })}
            </div>
        </div>
    )
}

export default Profile