import { useEffect, useState } from 'react';
import "../Style/ticket.css"
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
  const [showHistoryTab, setShowHistoryTab] = useState(true); 


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
    'button': {
      width: '55px',
      padding: '10px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      backgroundColor: '#0052CC',
      borderRadius: '5px'
    },
    'tableContainer': {
      border: '1px solid #ddd',
   
    },
    'detailsContainer':{
      display: 'flex',
      width: '100%',
    },
    'detailsTitle':{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',

    },
    'detailsTitleText': {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    'table': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '40px',
    },
    'historytable': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      paddingTop: '40px',

    },
    'ticketTables' : {
      display: 'flex',
      flexDirection: 'column',
    },
    'labelContainer' : {
      display: 'flex',
      marginRight: '30px',
      flex: '2',
      flexDirection: 'column',
    },
    'subContainer':{
      display: 'flex',
      justifyContent: 'space-between',
     
      flexDirection: 'column'
    },
    'ticketTitle':{
      fontWeight: '600',
      fontSize: '20px',
      display: 'flex',
      width: '100%'
    },
    'spanText' : {
      marginBottom: '10px',
      width: '200px',
      color: '#292c2e',
      fontWeight: '600'
    },
    'commentContainer':{
      display: 'flex',
      alignItems:'end',
      marginTop: '40px'
    },
    'upperContainer': {
      display: 'flex',
      marginTop: '20px'
    },
    'commentBox': {
      width: '500px'
    },
    'labelPair' : {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '10px',
      fontSize: '13px',
    },
    'statusText': {
      color: '#0052CC',
      width: 'auto',
      border: '1px solid #0052CC',
      paddingRight: '10px',
      fontSize: '15px',
      height: '20px',
      lineHeight: '20px',
      padding: '5px',
      borderRadius: '5px',
      marginBottom: '20px',
      paddingLeft: '10px',
      marginRight: '10px'
    },
    'adjacentSection' : {
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
     
    },
    'blueText': {
      color: '#0052CC'
    },
    'detailsBtn': {
        display: 'flex',

    },
    'detailsTable' : {
      border: '1px solid #ddd',
      paddingBottom: '10px',
      borderRadius: '7px'
    },
    'ticketContainer': {
      padding: '20px',
      paddingRight: '50px',
      paddingLeft: '50px',
      boxSizing: 'border-box'
    }
  }));
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [users, setUsers] = useState([]);
  const classes = useStyles(); 
  const handleShowCreateTicket = (data) => {
    setShowCreateTicket((prev) => {return data;});
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
      let docReference = doc(db, "ticketListing", params.ticketId);
      await updateDoc(docReference, {comments : arrayUnion(commentData)});
      getTicket();
    }
  }
  const dateToTimestamp = () => {
    const currentDate = new Date();
    return currentDate.getTime();
  }
  useEffect(() => {
    getTicket();
    getUsers();
  },[params.ticketid,showCreateTicket]);
  
  const timeStampToDate = (timeStamp) => {
    let date = new Date(timeStamp).toDateString();;
    console.log(date);
    // date = (`${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
    return date;
  }
  return (
    showCreateTicket ? 
    <CreateTicket handleShowCreateTicket={handleShowCreateTicket} userDet={userDet} ticketDetails = {ticket}/>
    :
    <div className={classes.ticketContainer}> 
     <div className={classes.detailsTitle}>
          <div className='breadcrumb'>Tickets / {ticket?.ticketTitle}</div> 
          <div className='buttonCont'>
            <div className={classes.button} onClick={()=>handleShowCreateTicket(true)}>Edit</div>
            <Link to={`/tickets`}><div className={classes.button}>Back</div></Link>
          </div>
        </div>
    <div className={classes.ticketTitle}>{ticket?.ticketTitle} -  <div className={classes.blueText}> {ticket.type?.name}</div></div>
    <div className={classes.upperContainer}>
      <div className={classes.detailsContainer}>
          <div className={classes.labelContainer}>
            <div className={classes.subContainer}>
              <div className={classes.desc}><div className={classes.spanText} >Description</div>
              <div>
              {ticket?.description}
              </div>
              </div>
            </div>
          </div>
          <div className={classes.adjacentSection}>
            <div className={classes.detailsBtn}>
              <div className={classes.statusText}>{ticket?.status?.name}</div>
              <div className={classes.statusText}>{ticket?.priority?.name}</div>
            </div>
              <div className={classes.detailsTable}>
                <div className={classes.detailsTitleText}>Details</div>
                <div className={classes.labelPair}><div className={classes.spanText}>Project</div><div className={classes.spanVal}>{ticket?.projectId?.name}</div></div>
                <div className={classes.labelPair}><div className={classes.spanText}>Developer</div><div className={classes.blueText}>{ticket?.assignee?.name}</div></div>
                <div className={classes.labelPair}><div className={classes.spanText} >Submitter</div><div className={classes.blueText}>{ticket?.createdBy?.name}</div></div>
      
              </div>
              <div className='createdOn'>Created on {timeStampToDate(ticket?.createdOn)} </div>
          </div>
      </div>
    </div>
    
    <div className='activityTab'>
        <div className='activityTitle'>Activity</div>
        <div className='showSection'>
          <div className='showTitle'>Show :</div>
          <div className={`tabName ${showHistoryTab? 'selected' : ''}`} onClick={(e) => setShowHistoryTab(true)}>History</div>
          <div className={`tabName ${!showHistoryTab? 'selected' : ''}`} onClick={(e) => setShowHistoryTab(false)}>Comment</div>
        </div>
    </div>
    
    {showHistoryTab ? <div className={classes.historytable}> 
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
                      <TableCell align="left">{timeStampToDate(entry.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>  
      </div> :
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
                       <TableCell align="left">{timeStampToDate(data.timeStamp)}</TableCell>
 
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>  
       </div>
     </div>
      }
   
      
    
    
    </div>
  );
}

export default Ticket;
