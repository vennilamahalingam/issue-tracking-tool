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
                        console.log(user);
                    }
                    setCheckingStatus(false);    
                }
            )
        }
        return ()=>{isMounted.current = false}
    },[isMounted])

    return {loggedIn, checkingStatus, logDet}
}