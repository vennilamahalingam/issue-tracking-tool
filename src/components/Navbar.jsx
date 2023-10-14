import { useNavigate } from "react-router-dom";
import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import { alpha } from "@material-ui/core";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {useState} from "react";
import { getAuth, signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { updateUser} from "../actions";
import Search from './Search.jsx';

const useStyles = makeStyles((theme)=>({
  large: {
      display: "none",

      color: alpha(theme.palette.common.black),
      [theme.breakpoints.up("sm")] : {
          display: "block"
      }
  },
  small:{
      display: "block",
      color: alpha(theme.palette.common.black),
      [theme.breakpoints.up("sm")] : {
          display: "none"
      }
  },
  search:{
    display : "flex",
    alignItems: "center",
    color: alpha(theme.palette.common.black),
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    width: "50%",
      [theme.breakpoints.down("sm")] : {
          display: (props) => (props.open ? "flex" : "none"),
      },

  },
  toolbar:{
      display: "flex",
      justifyContent: "space-between",
  },
  input:{
      color: "black",
      marginLeft: theme.spacing(1)
  },
  icons:{
    display: (props) => (!props.open ? "flex" : "none"),
     
    color: alpha(theme.palette.common.black),
      alignItems: "center"
  },
  badge: {
      marginRight: theme.spacing(2)
  },
  cancel: {
      [theme.breakpoints.up("sm")] : {
        display: "none"
      }
  },
  searchButton:{
    display: "block",
    [theme.breakpoints.up("sm")] : {
        display: "none"
    }
  },
  blueText: {
    color: '#0052CC'
  },
  titleText:{
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px'
  },
  topBar:{
    position: "sticky",
    top: "0",
    backgroundColor: alpha(theme.palette.common.white),
  },
  logout:{
    cursor:"pointer"
  }
}));


function Navbar() {

  const userDetails = useSelector(state => state);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const {displayName, role} = userDetails;
  const classes = useStyles( {open} );
  
  const navigate = useNavigate();
  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/");
      dispatch(updateUser({}));
      console.log('Sign-out successful.');
    }).catch((error) => {
      console.log('Sign-out error.');
    });
  }
  return (
    <AppBar color="inherit" className={classes.topBar} >
        <Toolbar className={classes.toolbar}>
            <div className={classes.titleText}><PersonIcon/> {displayName} -<span className={classes.blueText}>&nbsp;{role}</span></div>
            <div className={classes.icons}>
                <Search/>
                <LogoutIcon className={classes.logout} onClick={logout}/>
            </div>
        </Toolbar>
    </AppBar>
  );
}

export default Navbar;
