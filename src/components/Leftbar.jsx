import { Container, FormHelperText, Typography } from "@material-ui/core";
import {useNavigate, useLocation} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import Home from "@material-ui/icons/Home"
import Person from "@material-ui/icons/Person"
const useStyles = makeStyles((theme)=>({
  container : {
    color: "white",
    height: "100vh",
    paddingTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up("sm")] : {
      backgroundColor: "white",
      color:"#000",
      border: "1px solid #999" 
    },
    position: "sticky",
    top: "0"
  },
  item: {
    display: "flex",
    alignItems: "center",
    padding: '5px',
    [theme.breakpoints.up("sm")] : {
      marginBottom : theme.spacing(2),
      cursor: "pointer"
    }
  },
  itemSelected: {
    display: "flex",
    alignItems: "center",
    padding: '5px',
    backgroundColor: "#ddd",
    [theme.breakpoints.up("sm")] : {
      marginBottom : theme.spacing(2),
      cursor: "pointer"
    }
  },
  icon:{
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")] : {
      fontSize: "18px"
    }
  },
  text: {
    fontSize: "12px",
    marginLeft: "10px",
    [theme.breakpoints.down("sm")] : {
      display: "none"
    }
  }
}));

function Leftbar({userDet}) {
  const navigate = useNavigate();
  const location = useLocation();
  function pathMatchRoute(route)
    {
        if(location.pathname === route)
        {
            return true;
        }
        return false;
    }
  const classes = useStyles()
  return (
    <Container className={classes.container}>
      <div className={ pathMatchRoute("/") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/")}>
        <Home/>
        <Typography className={classes.text}>Dashboard</Typography>
      </div>
      {userDet.role === "admin" && <div className={ pathMatchRoute("/userrole") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/userrole")}>
        <Person/>
        <Typography className={classes.text}>Manage role assignment</Typography>
      </div>}
      <div className={ pathMatchRoute("/projects") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/projects")}>
        <Home/>
        <Typography className={classes.text}>Projects</Typography>
      </div>
      <div className={ pathMatchRoute("/ticket") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/tickets")}>
        <Home/>
        <Typography className={classes.text}>My Tickets</Typography>
      </div>
      <div className={ pathMatchRoute("/profile") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/profile")}>
        <Home/>
        <Typography className={classes.text}>User profile</Typography>
      </div>
    </Container>
  );
}

export default Leftbar;