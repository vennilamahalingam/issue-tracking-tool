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
import "../Style/ticketList.css";



function TicketList() 
{
  const [tickets, setTickets] = useState([ ]);
  const [showCreateticket, setShowCreateticket] = useState(false);
  const useStyles = makeStyles((theme)=>({
    'tableTitle' : {
      alignItems: 'center',
      width: '100%',
      display: 'flex',
      boxSizing: 'border-box',
      padding: '10px',
      justifyContent: 'space-between'
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
      width: '100%',
    },
    'tableTitleText' :{
      fontSize: '20px',
    },
    'button': {
      width: '175px',
      padding: '10px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      backgroundColor: '#0052CC',
      borderRadius: '5px'
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
        });
       });
    }
    getTickets();
  },[]);
  const handleCreateTicketState = (data) => {
    setShowCreateticket(data)
  }
  const timeStampToDate = (timeStamp) => {
    let date = new Date(timeStamp);
    date = (`${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}`);
    return date;
  }
  return(showCreateticket ? 
      <CreateTicket handleShowCreateTicket={handleCreateTicketState}/>
      :
      <div className="TicketList">
      <div className={classes.table}> 
        <div className={classes.tableTitle}>
          <div className={classes.tableTitleText}>Tickets</div>
          <div className={classes.button} onClick={()=>setShowCreateticket(true)}>Create new ticket</div> 
        </div>
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Project</TableCell>
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
                    
                      <TableCell align="left" className='ticketName'><Link to={`/tickets/${ticket.id}`}>{ticket.ticketTitle}</Link></TableCell>
                    
                    <TableCell align="left">{ticket.projectId?.name}</TableCell>
                    <TableCell align="left">{ticket.createdBy?.name}</TableCell>

                    <TableCell align="left">{ticket.assignee?.name}</TableCell>
                    <TableCell align="left">{ticket.priority?.name}</TableCell>
                    <TableCell align="left">{timeStampToDate(ticket.createdOn)}</TableCell>

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
