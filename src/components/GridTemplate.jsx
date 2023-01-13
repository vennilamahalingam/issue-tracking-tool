
import { Grid } from "@material-ui/core";
import { Outlet } from "react-router-dom";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";

function GridTemplate() {
  return (
    <div>
        <Navbar/>
        <Grid container>
            <Grid item xs={2}>
                <Leftbar/>
            </Grid>
            <Grid item xs={10}>
                <Outlet/>
            </Grid>
        </Grid>
    </div>
  );
}

export default GridTemplate;