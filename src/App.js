import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { makeStyles } from "@material-ui/core";
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
import TicketList from "./pages/TicketList";
import GridTemplate from "./components/GridTemplate";
import { useDispatch } from "react-redux";
import { updateUser } from "./actions";



const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isMounted = useRef(true);

  useEffect(()=>{
      if(isMounted)
      {
          const auth  = getAuth();
      
          onAuthStateChanged(auth,(user) => {
                  if(user)
                  {
                      dispatch(updateUser({displayName: user.displayName, role: user.photoURL, email: user.email, id: user.uid}));
                      // setUserDet({displayName: user.displayName, role: user.photoURL, email: user.email, id: user.uid});
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
                    <Route path="signin" element={<SignIn/>}/>
                    <Route path="signup" element={<SignUp/>}/>
                </Route>
                <Route path="/" element={<PrivateRoute />}>
                    <Route path='/' element={<GridTemplate/>}>
                      <Route path="/" element={<Dashboard/>}/>
                      <Route path="/userrole" element={<UserRoleManagement/>}/>
                      <Route path="/projects" element={<ProjectList/>}/>
                      <Route path="/projects/:projectid" element={<Project/>}/>
                      <Route path="/tickets/:ticketId" element={<Ticket/>}/>
                      <Route path="/tickets" element={<TicketList/>}/>
                    </Route>
                </Route>
                </Routes>
        </Router>
      </>
  );
};

export default App;
