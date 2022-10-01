import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState,useRef } from "react";

export const useAuthHook = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [logDet, setLogDet] = useState(false);

    const [checkingStatus, setCheckingStatus] = useState(true);
    const isMounted = useRef(true);

    useEffect(()=>{
        if(isMounted)
        {
            const auth  = getAuth();
        
            onAuthStateChanged(auth,(user) => {
                    if(user)
                    {
                        setLoggedIn(true);
                        setLogDet(user); 
                    }
                    else{
                        setLoggedIn(false);
                    }
                    setCheckingStatus(false);  
                    console.log(loggedIn);
                }
            )
        }
        return ()=>{isMounted.current = false}
    },[isMounted, loggedIn])

    return {loggedIn, checkingStatus, logDet}
}