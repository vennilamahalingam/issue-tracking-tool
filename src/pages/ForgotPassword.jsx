import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import AdbIcon from '@mui/icons-material/Adb';
import '../Style/profileStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import { TextField } from "@material-ui/core";


const ForgotPassword = () =>
{

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
        email: "",
    });
    const [showMsg, setShowMsg] = useState();
    const {email} = formData;
    const onChange = (e) =>
    {
        setFormData((prevValue)=>({...prevValue, [e.target.id]: e.target.value}))
    }
    const onSubmit = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, formData.email)
        .then(() => {
            setShowMsg("Password reset email sent!");
            setTimeout(()=>{
                navigate("/");
            },2000);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setShowMsg(errorMessage);
        });
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
           {showMsg && <div className="badCreds">{showMsg}</div>} 
             <TextField
                id="email"
                label="Email id"
                value={email}
                onChange={onChange}
                variant="standard"
                />
                
                <div className="button" onClick={() => onSubmit()}>
                        Send Recovery email
                </div>
            </form>
        </div>
        </>
    )
}

export default ForgotPassword;