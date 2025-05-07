import axios from "axios";
import React, { useEffect, useState } from "react";
import backend from "./host";

const Followers = (props)=>{
    
    const [followers, setFollowers] = useState([])

    useEffect(()=>{
        axios.post(`${backend}/getFollowers`, {userId: props.googleId})
        .then(res => setFollowers(res.data))
        .catch(err => console.log(err))
    }, [])

    return(
        <div className="followerList">
            <h1 className="followerListHeader">Followers</h1>

            {followers.map((e)=>{
                return (
                <span className="followerListItem">
                    <p className="followerListName">{e}</p>
                    <button className="unfollowButton likeButton">Unfollow</button>
                </span>)
            })}

        </div>
    )
}


export default Followers;