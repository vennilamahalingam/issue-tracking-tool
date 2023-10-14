import googleIcon from "../assets/svg/googleIcon.svg";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "../actions";
import GoogleIcon from '@mui/icons-material/Google';

function OAuth ()
{
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function onGoogleClick()
    {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            console.log(provider);
            signInWithPopup(auth, provider)
            .then((result) => {
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              const user = result.user;
              console.log(user);
              onUserResult(user);
            }).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              const email = error.customData.email;
              const credential = GoogleAuthProvider.credentialFromError(error);
            });
            
        } catch (error) {
            console.log(error);
            toast.error("cannot login");
        }
    }
    async function onUserResult(user){
        //check for user
        const docRef = doc(db,"users",user.uid);
        const docSnap = await getDoc(docRef);
        
        //If user doesnt exists
        if(!docSnap.exists())
        {
            await setDoc(doc(db,"users",user.uid),{
                name: user.displayName,
                email: user.email,
                timestamp : serverTimestamp(),
            })
        }
        dispatch(updateUser({
            displayName: user.displayName,
            email: user.email,
            'role': "developer",
            id: user.uid,
        }));
        navigate("/");
    }
    return (
        <div className="button googleButton" onClick={onGoogleClick}>
           <GoogleIcon/> 
           <span> Sign in with Google</span>
        </div>
    )
}
export default OAuth;