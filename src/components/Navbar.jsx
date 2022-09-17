import { useNavigate } from "react-router-dom";
import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { alpha } from "@material-ui/core";
import { Badge } from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import LogoutIcon from '@mui/icons-material/Logout';
import Notifications from "@material-ui/icons/Notifications";
import { Avatar } from "@material-ui/core";
import {useState} from "react";
import Cancel from "@material-ui/icons/Cancel"
import { getAuth, signOut } from "firebase/auth";


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
      justifyContent: "space-between",
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
  topBar:{
    position: "sticky",
    top: "0",
    backgroundColor: alpha(theme.palette.common.white),
  }
}));


function Navbar({userDet, handleUserDet}) {
  const [open, setOpen] = useState(false);
  const {displayName, role} = userDet;
  const classes = useStyles( {open} );
  
  const navigate = useNavigate();
  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/");
      handleUserDet({});
      console.log('Sign-out successful.');
    }).catch((error) => {
      console.log('Sign-out error.');
    });
  }
  const searchOnClick= ()  => {
    setOpen((prev)=>!prev);
  }
  return (
    <AppBar color="inherit" className={classes.topBar} >
        <Toolbar className={classes.toolbar}>
            <Typography variant="h6" className={classes.large}>Welcome {displayName} {role}</Typography>
            <Typography variant="h6" className={classes.small}>NDev</Typography>
            
            <div className={classes.icons}>
            <div className={classes.search}>
                <SearchIcon style= {{color: 'black'}}/>
                <InputBase placeholder="Search..." className={classes.input}/>
                <Cancel className={classes.cancel} onClick={()=>setOpen(false)}/>
            </div>
                <SearchIcon className={classes.searchButton} onClick={searchOnClick}/>
                <Badge color="primary" badgeContent={2} className={classes.badge}>
                    <MailIcon style= {{color: 'black'}}/>
                    </Badge>
                    <Badge color="primary" badgeContent={10} className={classes.badge}>
                    <Notifications  style= {{color: 'black'}}/>
                    </Badge>
                    <LogoutIcon onClick={logout}/>
                    <Avatar alt="Remy Sharp" src="https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740" />
            </div>
        </Toolbar>
    </AppBar>
  );
}

export default Navbar;