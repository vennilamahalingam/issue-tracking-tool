import { useEffect, useState } from 'react';
import {useParams, Link} from "react-router-dom";
import { updateDoc,getDoc,doc, collection, getDocs , query, where, serverTimestamp, arrayUnion} from "firebase/firestore";
import { db } from "../firebase.config";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {makeStyles} from "@material-ui/core/styles";
import CreateTicket from './CreateTicket';
import TextField from '@mui/material/TextField';

function Ticket({userDet}) 
{
  const [ticket, setTicket] = useState({});
  const [commentText, setCommentText] = useState("");

  const useStyles = makeStyles((theme)=>({
    'tableTitle' : {
      backgroundColor: "#ddd",
      margin: theme.spacing(2),
      height: '30px',
      padding: theme.spacing(2),
      width: '500px',
      top: '0px',
      position: 'ABSOLUTE'
    },
    'tableContainer': {
      border: '1px solid #ddd',
      
    },
    'detailsContainer':{
      position: 'relative',
      width: '500px',
      display: 'flex',
      marginLeft: '20px',
      marginTop: '30px'
    },
    'detailsTitle':{
      backgroundColor: "#ddd",
      height: '60px',
      width: 'inherit',
      lineHeight: '60px',
      marginLeft: '20px',
      paddingLeft: '10px',
      top: '10px',
      position: 'ABSOLUTE'
    },
    'table': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '80px',
    },
    'historytable': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      paddingTop: '80px',
      marginLeft: '50px'
    },
    'ticketTables' : {
      display: 'flex',
      flexDirection: 'column',
    },
    'labelContainer' : {
      marginTop: '80px',
      display: 'flex',
      width: '500px',
      marginLeft: '30px',
      flexDirection: 'column'
    },
    'subContainer':{
      display: 'flex',
      justifyContent: 'space-between',
     
      flexDirection: 'row'
    },
    'labelPair' : {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px',
      flex: 1
    },
    'spanText' : {
      fontSize: '12px',
      marginBottom: '10px',
    },
    'commentContainer':{
      display: 'flex',
      alignItems:'end',
      marginLeft: '100px'
    },
    'upperContainer': {
      display: 'flex'
    },
    'button': {
      marginLeft: '10px',
      marginTop: '50px',
      width: '140px',
      textDecoration: 'underline',
      lineHeight: '18px'
    },
    'commentBox': {
      width: '500px'
    }
  }));
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [users, setUsers] = useState([]);
  const classes = useStyles(); 
  const handleShowCreateTicket = (data) => {
    setShowCreateTicket(data)
  }
  const params = useParams();
  const getTicket = () => {
    getDoc(doc(db, 'ticketListing',params.ticketId)).then((pquerySnap) => {
      let ticket = pquerySnap.data();
      ticket.id = pquerySnap.id;
      setTicket(ticket);
      /*getDoc(doc(db, 'users', ticket.createdBy)).then((snap) => {
          ticket.createdBy = snap.data().name;
          getDoc(doc(db, 'users', ticket.assignee)).then((snap) => {
              ticket.assignee = snap.data().name;
              ticket.comments && 
              ticket.comments.map((comment, index)=>{
                getDoc(doc(db, 'users', comment.name)).then((snap) => {
                  comment.userName = snap.data().name;
                })
              })              
              setTicket(ticket);
          })
      })*/
      
  });
  }
  const getUsers = () => {
    const userRef = collection(db,"users");
    const pq = query(userRef);
    let users = [{}];
    getDocs(pq).then((snap) => {
        snap.forEach((doc) => {
           return users.push({data : doc.data(), id: doc.id});
        })
        setUsers(users);
    });
  }
  const getNameFromId = (id) => 
  {
    const userObj = users.filter((user,index)=> user.id === id);
    return userObj[0]?.data?.name;
  }
  const handleNewComment = async () => {
    if(commentText)
    {
      let commentData = {
        message: commentText,
        commenter: {id: userDet.id, name: userDet.displayName},
        timeStamp: dateToTimestamp(),
      }
      console.log(commentData);
      let docReference = doc(db, "ticketListing", params.ticketId);
      await updateDoc(docReference, {comments : arrayUnion(commentData)});
      getTicket();
    }
  }
  const dateToTimestamp = () => {
    const currentDate = new Date();
    return currentDate.getTime();
  }
  const timeStampToDate = (timeStamp) => {
    return new Date(timeStamp);
  }
  useEffect(() => {
    getTicket();
    getUsers();
  },[params.ticketid]);
  return (
    showCreateTicket ? 
    <CreateTicket handleShowCreateTicket={handleShowCreateTicket} userDet={userDet} ticketDetails = {ticket}/>
    :
    <div className="App"> 
    <div className={classes.upperContainer}>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsTitle}>
          Details of the ticket - {ticket?.data?.ticketName}
          <span onClick={()=>handleShowCreateTicket(true)}>Edit ticket</span>
          <Link to={`/tickets`}>Back to ticket list</Link>
        </div>
        <div className={classes.labelContainer}>
          <div className={classes.subContainer}>
            <div className={classes.labelPair}><div className={classes.spanText}>Ticket title</div>{ticket?.ticketTitle}</div>
            <div className={classes.labelPair}><div className={classes.spanText} >Ticket description</div>{ticket?.description}</div>
          </div>
          <div className={classes.subContainer}>
            <div className={classes.labelPair}><div className={classes.spanText}>Project</div>{ticket?.projectId?.name}</div>
            <div className={classes.labelPair}><div className={classes.spanText}>Developer</div>{ticket?.assignee?.name}</div>
          </div>
          <div className={classes.subContainer}>
            <div className={classes.labelPair}><div className={classes.spanText} >Submitter</div>{ticket?.createdBy?.name}</div>
            <div className={classes.labelPair}><div className={classes.spanText}>Priority</div>{ticket?.priority?.name}</div>
          </div>
          <div className={classes.subContainer}>
            <div className={classes.labelPair}><div className={classes.spanText}>Type</div>{ticket?.type?.name}</div>
            <div className={classes.labelPair}><div className={classes.spanText} >Status</div>{ticket?.status?.name}</div>
          </div>
          <div className={classes.subContainer}>
            
            <div className={classes.labelPair}><div className={classes.spanText} >Created</div>{ticket?.createdOn}</div>
          </div>
        </div>
        
      </div>
      <div className={classes.ticketTables}>
        <div className={classes.commentContainer}>
          <TextField
            className={classes.commentBox}
          id="standard-multiline-flexible"
          label="Add a new comment"
          multiline
          maxRows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          variant="standard"
          />
          <div onClick={handleNewComment} className={classes.button}>Add</div>
        </div>
        <div className={classes.table}> 
        
            <div className={classes.tableTitle}>Ticket Comments</div>
            <TableContainer style={{ width: 550 }} component={Paper} className={classes.tableContainer}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Commenter</TableCell>
                    <TableCell align="left">Message</TableCell>
                    <TableCell align="left">Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticket?.comments?.map((data, index) => (
                      <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                    > 
                      <TableCell align="left">{data.commenter?.name}</TableCell>
                        <TableCell align="left">{data.message}</TableCell>
                        <TableCell align="left">{data.timeStamp}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>  
        </div>
      </div>
      </div>
    
    <div className={classes.historytable}> 
          <div className={classes.tableTitle}>Ticket history</div>
          <TableContainer style={{width: 550}} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Property</TableCell>
                  <TableCell align="left">old value</TableCell>
                  <TableCell align="left">new value</TableCell>
                  <TableCell align="left">date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticket?.history?.map((entry, index) => (
                  
                    <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                  >
                      <TableCell align="left">{entry.property}</TableCell>
                      <TableCell align="left">{entry.oldValue?.name}</TableCell>
                      <TableCell align="left">{entry.newValue?.name}</TableCell>
                      <TableCell align="left">{entry.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>  
      </div>
    </div>
  );
}

export default Ticket;
