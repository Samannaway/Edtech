import React, { useEffect, useState } from "react"
import NavBar from "./GenComp/navbar"
import Read from "./Doubts/read"
import Create from "./Doubts/create"
import Login from "./GenComp/login"
import axios from "axios"
import backend from "./host"
import Profile from "./GenComp/Profile"
import Followers from "./GenComp/Followers"
import Reply from "./Doubts/Reply"
import ClassAssistant from "./ClassAssist/ClassAssistant"

const App = (props)=>{

  const [selector, setSelector] = useState(<Login />)
  const [userData, setUserData] = useState("")

  useEffect(()=>{
    axios.post(`${backend}/auth/google/verify`, {}, {withCredentials: true})
    .then(res =>{
      if (res.data == null) {
        setSelector(<ClassAssistant />)
      }else{
        console.log("user verified")
        console.log(res.data.userData)
        setSelector(<ClassAssistant data={res.data.userData}/>)
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
            <a className="selectButton" onClick={()=>{setSelector(<ClassAssistant data={userData}/>)}}>Cl Assist</a>
        </div>
      </div>
      <div className="content">
        {selector} 
      </div>
    </div>
  )
}


export default App