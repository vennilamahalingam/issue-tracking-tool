import { Fab, Tooltip } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import  AddIcon  from "@material-ui/icons/Add";
const useStyles = makeStyles((theme)=>({
  addIcon: {
    position: "fixed",
    right: 10,
    bottom: 10
  }
}));
function Add() {
  const classes = useStyles()
  return (
    <Tooltip title="add" aria-label="add">
        <Fab color="primary" aria-label="add" className={classes.addIcon}>
          <AddIcon />
        </Fab>
              
    </Tooltip>

  );
}

export default Add;