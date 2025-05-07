import React, { useEffect, useState } from "react"
import NavBar from "./navbar"
import Read from "./read"
import Create from "./create"
import Login from "./login"
import { page, changePage} from "./universalv"
import axios from "axios"
import backend from "./host"
import Profile from "./Profile"
import Followers from "./Followers"

const App = (props)=>{

  const [selector, setSelector] = useState(<Login />)
  const [userData, setUserData] = useState("")

  useEffect(()=>{
    axios.post(`${backend}/auth/google/verify`, {}, {withCredentials: true})
    .then(res =>{
      if (res.data == null) {
        setSelector(<Profile />)
      }else{
        setSelector(<Profile data={res.data.userData}/>)
        setUserData(res.data.userData)
      }
    })
    .catch(err => console.log(err))
  },[])

  const logOut = ()=>{
    axios.post(`${backend}/logout`)
    .then(res=> console.log(res.data))
    .catch(err => console.log(err))
  }

  
  return(
    <div className="mainDiv">
      <NavBar />
      <div className="headerDiv">
        <span className="grid">
          <p>{userData.username}</p>
          <a className="logoutButton"
            href={`${backend}/logout`}
          ><ion-icon name="log-out-outline"></ion-icon></a>
        </span>
        <h1 className="sideBarHeading">Dashboard</h1>
        <div className="selectorDiv">
            <a className="selectButton" onClick={()=>{setSelector(<Read data={userData}/>)}}>Doubts</a>
            <a className="selectButton" onClick={()=>{setSelector(<Create data={userData}/>)}}>Ask Doubts</a>
            <a className="selectButton" onClick={()=>{setSelector(<Profile data={userData}/>)}}>Profile</a>
        </div>
      </div>
      <div className="content">
        {selector} 
      </div>
    </div>
  )
}


export default App