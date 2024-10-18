import React, { useState } from 'react'
import { auth ,db} from '../Firebase/firebase'
import firebase from "../Firebase/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'


const Login = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [fname,setFname]=useState("");
    const [lname,setLname]=useState("");
    const signup=async(event)=>{
      event.preventDefault();
        await createUserWithEmailAndPassword(auth,email,password)
        .then(async(result)=>{
            const user=result.user;
            console.log(user);
            if(user){
              await setDoc(doc(db,"users",user.uid),{
                email:user.email,
                firstName:fname,
                lastName:lname,
              })
            }
        })
        .catch((error)=>{
            console.log(error.message);
        })
    }
    const signIn=(event)=>{
      event.preventDefault();
      signInWithEmailAndPassword(auth, email, password)
      .then((result)=>{
        const user=result.user;
        console.log(user);
      })
      .catch((error)=>{
        console.log(error.message);
      })
    }
  return (
    <div>
      <form onSubmit={signup} >
        <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type='text' value={password} onChange={(e)=>setPassword(e.target.value)} />
        <input type='text' value={fname} onChange={(e)=>setFname(e.target.value)} />
        <input type='text' value={lname} onChange={(e)=>setLname(e.target.value)} />
        <input type="submit" />
      </form>
    </div>
  )
}

export default Login
