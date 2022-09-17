import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import {getAuth, createUserWithEmailAndPassword, updateProfile}  from "firebase/auth";
import { setDoc,doc,serverTimestamp } from "firebase/firestore";
import {db} from "../firebase.config";
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";

function SignUp({handleUserDet})
{
    console.log(handleUserDet);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });
    const {email,password,name} = formData;
    const navigate = useNavigate();
    const onChange = (e) =>
    {
        setFormData((prevValue)=>({...prevValue, [e.target.id]: e.target.value}))
    }
    const onSubmit = async(e) => {
        e.preventDefault()
        try 
        {
           
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth,email,password)
            const user = userCredential.user
            updateProfile(auth.currentUser,{displayName:name, photoURL: 'developer'});
            
            const formDataCopy = {...formData}
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            formDataCopy.role = 'developer';
            handleUserDet({
                displayName: name,
                email,
                'role': 'developer',
                id: user.uid
            })
            await setDoc(doc(db,'users',user.uid), formDataCopy)

            navigate("/");
        }
        catch(error){
            console.log(error);
            toast.error("Something went wrong!")
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
                <input type="text" className="nameInput" placeholder="Name" value={name} onChange={onChange} id="name"/>
                <input type="email" className="emailInput" placeholder="Email" value={email} onChange={onChange} id="email"/>
                <div className="passwordInputDiv">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" id="password" value={password} className="passwordInput" onChange={onChange}/>
                    <img src={visibilityIcon} alt="show password" onClick={()=>setShowPassword((prev)=>!prev)} className="showPassword" />
                </div>
                <Link to="/forgot-password" className="forgotPasswordLink">Forgot password </Link>
                <div className="signUpBar">
                    <p className="signUpText">
                        Sign Up
                    </p>
                    <button className="signUpButton">
                        <ArrowRightIcon fill="#ffff" width="34px" height= "34px" />
                    </button>
                </div>
            </form>
            <Link to="/profile/signin" className="registerLink">Sign In Instead</Link>
        </div>
        </>
    )
}

export default SignUp;