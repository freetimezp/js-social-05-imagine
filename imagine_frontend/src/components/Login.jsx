import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useNavigate } from "react-router-dom";

import { client } from '../client';

import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    const decoded = jwt_decode(response.credential);
    const {name, picture, sub} = decoded;

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }

    localStorage.setItem("user",JSON.stringify(doc));

    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true })
      })


  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video 
          src={shareVideo}
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"        
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>
        
          <div className="shadow-2xl">
              <GoogleLogin 
                onSuccess={(response) => responseGoogle(response)}
                onError={() => console.log('error')}
              />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
