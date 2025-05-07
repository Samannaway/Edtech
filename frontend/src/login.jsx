import React from "react";
import backend from "./host";

const Login = ()=>{
    return(
        <a href={`${backend}/auth/google/`} className="login">LOGIN</a>
    )
}

export default Login