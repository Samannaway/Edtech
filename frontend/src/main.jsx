import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

import './css/index.css'
import './css/create.css'
import "./css/replies.css"
import "./css/classAssist.css"

import App from './App.jsx'
import Login from './GenComp/login.jsx'
import axios from 'axios'
import backend from './host.js'


(async ()=>{
  let component = null

  await axios.post(`${backend}/auth/google/verify`, {}, {withCredentials: true})
  .then( res => res.data.flag === "success" ? component=<App /> : component=<Login /> )
  .catch(err => console.log("error : " + err))

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      {component}
    </StrictMode>
  )

})()

