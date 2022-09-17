import googleIcon from "../assets/svg/googleIcon.svg";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function OAuth ()
{
    const location = useLocation();
    const navigate = useNavigate();
    async function onGoogleClick()
    {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
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
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("cannot login");
        }
    }
    return (
        <div className="socialLogin">
            <p>Sign {location.pathname === "/sign-in" ? "in" : "up"} with </p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img src={googleIcon} alt="" className="socialIconImg" />
            </button>

        </div>
    )
}
export default OAuth;