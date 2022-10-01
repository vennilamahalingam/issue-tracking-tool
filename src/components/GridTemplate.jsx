
import { Grid } from "@material-ui/core";
import { Outlet } from "react-router-dom";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";

function GridTemplate({handleUserDet, userDet}) {
  return (
    <div>
        <Navbar handleUserDet={handleUserDet} userDet={userDet}/>
        <Grid container>
            <Grid item xs={2}>
                <Leftbar userDet={userDet}/>
            </Grid>
            <Grid item xs={10}>
                <Outlet/>
            </Grid>
        </Grid>
    </div>
  );
}

export default GridTemplate;