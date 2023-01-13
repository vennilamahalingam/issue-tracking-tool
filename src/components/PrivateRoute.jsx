import { Navigate, Outlet } from "react-router-dom"
import {useAuthHook} from "../Hooks/useAuthHook.js";

function PrivateRoute()
{
    const {loggedIn, checkingStatus} = useAuthHook();
    if(checkingStatus)
    {
        return <></>
    }

    return loggedIn ? <Outlet/> : <Navigate to="/profile/signin"/>
}

export default PrivateRoute;