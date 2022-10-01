import { Container, FormHelperText, Typography } from "@material-ui/core";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import {useNavigate, useLocation} from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import {makeStyles} from "@material-ui/core/styles";
import Home from "@material-ui/icons/Home";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
const useStyles = makeStyles((theme)=>({
  container : {
    color: "#fafbfc",
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
    backgroundColor: '#e6effc',
    borderRadius: '5px',
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
      console.log(location.pathname.split("/")[1]);
        if(location.pathname.split("/")[1] === route)
        {
            return true;
        }
        return false;
    }
  const classes = useStyles()
  return (
    <Container className={classes.container}>
      <div className={ pathMatchRoute("") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/")}>
        <DashboardIcon/>
        <Typography className={classes.text}>Dashboard</Typography>
      </div>
      {userDet?.role?.toLowerCase() === "admin" && <div className={ pathMatchRoute("userrole") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/userrole")}>
        <PeopleIcon/>
        <Typography className={classes.text}>Manage role assignment</Typography>
      </div>}
      <div className={ pathMatchRoute("projects") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/projects")}>
        <ReorderIcon/>
        <Typography className={classes.text}>Projects</Typography>
      </div>
      <div className={ pathMatchRoute("tickets") 
                              ? classes.itemSelected
                              : classes.item
                              } onClick={()=>navigate("/tickets")}>
        <FormatListBulletedIcon/>
        <Typography className={classes.text}>Tickets</Typography>
      </div>
      <div className={ pathMatchRoute("profile") 
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