import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { addDoc,getDoc,doc, collection, getDocs , query, where, serverTimestamp} from "firebase/firestore";
import { db } from "../firebase.config";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Link, useParams} from  "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import CreateTicket from './CreateTicket';
function TicketList({userDet}) 
{
  const [tickets, setTickets] = useState([ ]);
  const [showCreateticket, setShowCreateticket] = useState(false);
  const useStyles = makeStyles((theme)=>({
    'tableTitle' : {
      backgroundColor: "#ddd",
      margin: theme.spacing(2),
      height: '30px',
      padding: theme.spacing(2),
      width: '900px',
      top: '0px',
      position: 'ABSOLUTE'
    },
    'tableContainer': {
      border: '1px solid #ddd',
      
    },
    'table': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '65px',
    },
    'button': {
      marginLeft: '135px',
      marginTop: '15px',
      width: '140px',
      padding: '10px',
      textDecoration: 'underline',
      lineHeight: '18px'
    },
    'buttonLink': {
      color: '#000'
    }
  }));
  const classes = useStyles();
  useEffect(() => {
    const getTickets = () => {
      const ticketRef = collection(db,"ticketListing");
      const pq = query(ticketRef)
      getDocs(pq).then((pquerySnap)=>{
        pquerySnap.forEach((returnedDoc)=>{
            let ticketData = returnedDoc.data();
            ticketData.id = returnedDoc.id;
            setTickets((prev) => [...prev, ticketData]);
          /*   getDoc(doc(db, "users", returnedDoc.data().assignee)).then((snap)=>{
                ticketData.assignee = snap.data();
                getDoc(doc(db, "users", ticketData.createdBy)).then((snap)=>{
                    ticketData.createdBy = snap.data();
                    getDoc(doc(db, "projectList", ticketData.projectId)).then((snap) => {
                        ticketData.project = snap.data();
                        setTickets((prev)=> [...prev, ticketData]);
                    })
                })
            })
            */
        });

       });
      
       
    }
    getTickets();
  },[]);
  const handleCreateTicketState = (data) => {
    setShowCreateticket(data)
  }
  return(showCreateticket ? 
      <CreateTicket userDet={userDet} handleCreateTicket={handleCreateTicketState}/>
      :
      <div className="TicketList">
      <div className={classes.button} onClick={()=>setShowCreateticket(true)}>Create new ticket</div> 
      <div className={classes.table}> 
        <div className={classes.tableTitle}>All tickets</div>
        <TableContainer style={{ width: 950 }} component={Paper} className={classes.tableContainer}>
            <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Ticket Number</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Submitter</TableCell>
                <TableCell align="left">Developer</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Date</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket, index) => (
                
                  
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                  >
                    <Link to={`/ticket/${ticket.id}`}>
                      <TableCell align="left">{ticket.ticketNumber}</TableCell>
                    </Link>
                    <TableCell align="left">{ticket.ticketTitle}</TableCell>
                    <TableCell align="left">{ticket.createdBy.name}</TableCell>
                    <TableCell align="left">{ticket.assignee.name}</TableCell>
                    <TableCell align="left">{ticket.priority}</TableCell>
                    <TableCell align="left">{ticket.createdOn}</TableCell>

                  </TableRow>
                
              ))}
            </TableBody>
            </Table>
          </TableContainer>    
      </div>
    </div>
      );
}

export default TicketList;
