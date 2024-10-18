import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import facebook_img from "../../assets/pngwing 3.svg";
import google_img from "../../assets/pngwing 3.png";
import login_img from "../../assets/login_img.png";
import { CircleArrowLeft } from 'lucide-react';
import { auth, db, facebookProvider, googleProvider } from '../../Firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignUp = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formInput, setFormInput] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleLoginClick = () => {
    setIsSignUp(false);
  };

  const handleUserInput = (name, value) => {
    setFormInput({
      ...formInput,
      [name]: value,
    });
  };

  const signUp = async (event) => {
    event.preventDefault();
    if (formInput.password !== formInput.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formInput.email, formInput.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: formInput.first_name,
        lastName: formInput.last_name,
        photo: "",
        employment: "",
        education: "",
        following:[],
        followers:[],
        joinedAt: serverTimestamp(),
        address: ""
      }, { merge: true });
      toast.success('Sign up successful! Redirecting...');
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, formInput.email, formInput.password);
      toast.success('Login successful! Redirecting...');
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const googleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: result._tokenResponse.firstName,
        lastName: result._tokenResponse.lastName,
        photo: result._tokenResponse.photoUrl,
        employment: "",
        education: "",
        joinedAt: serverTimestamp(),
        address: ""
      }, { merge: true });
      toast.success('Login successful! Redirecting...');
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const facebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: result._tokenResponse.firstName,
        lastName: result._tokenResponse.lastName,
        photo: result._tokenResponse.photoUrl,
        employment: "",
        education: "",
        joinedAt: serverTimestamp(),
        address: ""
      }, { merge: true });
      toast.success('Login successful! Redirecting...');
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleForgetPassword = async (event) => {
    event.preventDefault();
  };

  return (
    <div className='body border-box'>
      <ToastContainer />
      <div className={`container-l ${isSignUp ? 'right-panel-active' : ''}`} id="main">
        <div className="sign-up ">
          <form onSubmit={signUp}>
            <CircleArrowLeft className='absolute left-4 top-5 cursor-pointer' onClick={handleLoginClick} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formInput.email}
              onChange={(e) => handleUserInput('email', e.target.value)}
              required
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formInput.first_name}
              onChange={(e) => handleUserInput('first_name', e.target.value)}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formInput.last_name}
              onChange={(e) => handleUserInput('last_name', e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formInput.password}
              onChange={(e) => handleUserInput('password', e.target.value)}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-Enter Password"
              value={formInput.confirmPassword}
              onChange={(e) => handleUserInput('confirmPassword', e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="login">
          <form onSubmit={login}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formInput.email}
              onChange={(e) => handleUserInput('email', e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formInput.password}
              onChange={(e) => handleUserInput('password', e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <p className="forget-password" onClick={handleForgetPassword}>
              Forgot Password?
            </p>
            <div className="divider">
              <span className="or-text">OR</span>
            </div>
            <div className="social-media">
              <div className="social" onClick={facebookLogin}>
                <img src={facebook_img} alt="Facebook Login" />
              </div>
              <div className="social" onClick={googleSignup}>
                <img src={google_img} alt="Google Login" />
              </div>
            </div>
            <div className=''>
              <p>Don't Have an account? </p>
              <button id="sign-up" className='h-10 flex text-center p-0 m-0' onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-left">
              <img src={login_img} alt="Login" />
            </div>
            <div className="overlay-right lg">
              <img src={login_img} alt="Login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
