import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import AdbIcon from '@mui/icons-material/Adb';
import '../Style/profileStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { TextField } from "@material-ui/core";

const SignIn = ({handleUserDet}) =>
{
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const {email,password} = formData;
    const navigate = useNavigate();
    const onChange = (e) =>
    {
        setShowError(false);
        setFormData((prevValue)=>({...prevValue, [e.target.id]: e.target.value}))
    }
    async function onSubmit (demoEmail, demoPassword)
    {
        try {
            let loginEmail = demoEmail ? demoEmail : email; 
            let loginPass = demoPassword ? demoPassword : password; 

            const auth = getAuth();
            const userCredentials = await signInWithEmailAndPassword(auth, loginEmail,loginPass)
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
            setShowError(true);
            toast.error("Bad credentials!")
        }
    }
    const handleDemoUser = () => {
        onSubmit('demouser@gmail.com', '123456');
    }
    return (
        <>
        <div className="pageContainer">
            <header>
                <p className="pageHeader">
                   <AdbIcon/> Ticketing tool Login
                </p>
            </header>
            <form className="formCont" >
           {showError && <div className="badCreds">Bad credentials !</div>} 

                <TextField
                id="email"
                label="Email id"
                value={email}
                onChange={onChange}
                variant="standard"
                />
                <TextField
                    id="password"
                    label="Password"
                    value={password}
                    onChange={onChange}
                    variant="standard"
                    />
                <div className="passwordInputDiv">
                    
                    {/*<img src={visibilityIcon} alt="show password" onClick={()=>setShowPassword((prev)=>!prev)} className="showPassword" />*/}
                </div>
                
                <div className="button" onClick={() => onSubmit()}>
                        Sign In
                </div>
            </form>
            <div className="bottomLinks">
                <div className="demoUserLink" onClick={handleDemoUser}>Sign in as a Demo User</div>
                <div>Forgot your <Link to="/forgot-password" className="">password?</Link></div>
                <div>Create an account? <Link to="/profile/signup" className="">Sign Up</Link></div>
            </div>
        </div>
        </>
    )
}

export default SignIn;