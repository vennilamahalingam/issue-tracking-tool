import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { Grid, makeStyles } from "@material-ui/core";
import Leftbar from "./components/Leftbar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Ticket from "./pages/Ticket";
import Project from "./pages/Project";
import ProjectList from "./pages/ProjectList";
import UserRoleManagement from "./pages/UserRoleManagement";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CreateProject from "./pages/CreateProject";
import TicketList from "./pages/TicketList";
import GridTemplate from "./components/GridTemplate";

const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const App = () => {
  const classes = useStyles();
  const [userDet, setUserDet] = useState({});
  const handleUserDet = (data) => {
    setUserDet(data);
    console.log(userDet);
  }
  const isMounted = useRef(true);

  useEffect(()=>{
      if(isMounted)
      {
          const auth  = getAuth();
      
          onAuthStateChanged(auth,(user) => {
                  if(user)
                  {
                      setUserDet({displayName: user.displayName, role: user.photoURL, email: user.email, id: user.uid});
                  }
                    
              }
          )
      }
      return ()=>{isMounted.current = false}
  },[isMounted])
  return (
      <>
      <Router>
        <Routes>
              <Route path='/profile/*'>
                  <Route path="signin" element={<SignIn handleUserDet={handleUserDet}/>}/>
                  <Route path="signup" element={<SignUp handleUserDet={handleUserDet}/>}/>
              </Route>
              <Route path="/" element={<PrivateRoute userDet={userDet}/>}>
                  <Route path='/' element={<GridTemplate userDet={userDet} handleUserDet={handleUserDet}/>}>
                    <Route path="/" element={<Dashboard userDet={userDet}/>}/>
                    <Route path="/userrole" element={<UserRoleManagement userDet={userDet}/>}/>
                    <Route path="/projects" element={<ProjectList userDet={userDet}/>}/>
                    <Route path="/projects/:projectid" element={<Project userDet={userDet}/>}/>
                    <Route path="/tickets/:ticketId" element={<Ticket userDet={userDet}/>}/>
                    <Route path="/tickets" element={<TicketList userDet={userDet}/>}/>
                  </Route>
               </Route>
              </Routes>
      </Router> 
      </>
  );
};

export default App;
