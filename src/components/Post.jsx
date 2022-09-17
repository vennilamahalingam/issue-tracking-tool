import {makeStyles} from "@material-ui/core/styles";
import { Card, CardActionArea, CardActions, CardContent, Button,CardMedia, Container, Typography } from "@material-ui/core";
const useStyles = makeStyles((theme)=>({
   container : {
    marginBottom: theme.spacing(5)
  },
  cardmedia: {
      height: "250px"
  }
}));
function Post() {
  const classes = useStyles()
  return (
    <Card className={classes.container}>
        <CardActionArea>
            <CardMedia className={classes.cardmedia}
            image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80"
            title="contemplatibe reptile"
            >

            </CardMedia>
            <CardContent>
                <Typography variant="h5">First post</Typography>
                <Typography variant="body">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </Typography>
            </CardContent>
        </CardActionArea>
        <CardActions>
            <Button size="small" color="primary">Share</Button>
            <Button size="small" color="primary">Learn more</Button>
        </CardActions>
    </Card>
  );
}

export default Post;