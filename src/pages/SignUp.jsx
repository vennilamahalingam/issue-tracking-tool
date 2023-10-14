import {useState} from "react";
import '../Style/profileStyle.css';
import {Link, useNavigate} from "react-router-dom";
import AdbIcon from '@mui/icons-material/Adb';
import 'react-toastify/dist/ReactToastify.css';
import {getAuth, createUserWithEmailAndPassword, updateProfile}  from "firebase/auth";
import { setDoc,doc,serverTimestamp } from "firebase/firestore";
import {db} from "../firebase.config";
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import { TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../actions";

function SignUp()
{ 
    const dispatch = useDispatch();
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
            dispatch(updateUser({
                displayName: name,
                email,
                'role': 'developer',
                id: user.uid
            }));
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
                  <AdbIcon/>  Ticketing tool Signup
                </p>
            </header>
            <form className="formCont" >
                 <TextField
                    id="name"
                    label="Full name"
                    value={name}
                    onChange={onChange}
                    variant="standard"
                    />
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
                    type="password"
                    />
                <div className="button" onClick={onSubmit}>
                        Sign Up
                </div>
            </form>
            <div className="bottomLinks">
                <div>Have an account? <Link to="/profile/signin" className="">Sign In</Link></div>
            </div>
        </div>
        </>
    )
}

export default SignUp;