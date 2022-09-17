import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignIn = ({handleUserDet}) =>
{
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const {email,password} = formData;
    const navigate = useNavigate();
    const onChange = (e) =>
    {
        setFormData((prevValue)=>({...prevValue, [e.target.id]: e.target.value}))
    }
    async function onSubmit (e)
    {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredentials = await signInWithEmailAndPassword(auth, email,password)
            if(userCredentials.user)
            {
                navigate("/");
                const authData = userCredentials.user;
                const {displayName, photoURL, email} = authData;
                handleUserDet({
                    displayName,
                    email,
                    'role': photoURL,
                    id: authData.uid,
                })
                console.log(userCredentials.user);
            }
        } catch (error) {
            console.log(error);
            toast.error("Bad credentials!")
            console.log('bad credentials');
        }
    }
    return (
        <>
        <div className="pageContainer">
            <header>
                <p className="pageHeader">
                    Welcome Back!
                </p>
            </header>
            <form onSubmit={onSubmit}>
                <input type="email" className="emailInput" placeholder="Email" value={email} onChange={onChange} id="email"/>
                <div className="passwordInputDiv">
                    <input type={showPassword ? "text" : "password"} id="password" placeholder="Password" value={password} className="passwordInput" onChange={onChange}/>
                    <img src={visibilityIcon} alt="show password" onClick={()=>setShowPassword((prev)=>!prev)} className="showPassword" />
                </div>
                <Link to="/forgot-password" className="forgotPasswordLink">Forgot password </Link>
                <div className="signInBar">
                    <p className="signInText">
                        Sign In
                    </p>
                    <button className="signInButton">
                        <ArrowRightIcon fill="#ffff" width="34px" height= "34px" />
                    </button>
                </div>
            </form>
            <Link to="/profile/signup" className="registerLink">Sign Up Instead</Link>
        </div>
        </>
    )
}

export default SignIn;