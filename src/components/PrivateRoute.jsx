import { Navigate, Outlet } from "react-router-dom"
import {useAuthHook} from "../Hooks/useAuthHook.js";

function PrivateRoute(userDet)
{
    console.log(userDet);
    const {loggedIn, checkingStatus} = useAuthHook();
    if(checkingStatus)
    {
        return <></>
    }

    return loggedIn ? <Outlet/> : <Navigate to="/profile/signin"/>
}

export default PrivateRoute;