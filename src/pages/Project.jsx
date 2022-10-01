import { useEffect, useState } from 'react';
import {useParams, Link} from "react-router-dom";
import { addDoc,getDoc,doc, collection, getDocs , query, where, serverTimestamp} from "firebase/firestore";
import { db } from "../firebase.config";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {makeStyles} from "@material-ui/core/styles";
import CreateProject from './CreateProject';
import "../Style/project.css";
import { Box } from '@mui/system';

function Project() 
{
  const [project, setProject] = useState({});

  const [team, setTeam] = useState([]);
  const [tickets, setTickets] = useState([]);
  const useStyles = makeStyles((theme)=>({
    'tableTitle' : {
      fontSize: '18px',
      textAlign: 'left'
    },
    'tableContainer': {
    border: '1px solid #d5d8db',
      
    },
    'userTableContainer':{
      border: '1px solid #d5d8db',
      fontSize: '13px'
    },
    'projectDetContainer': {
      width: '-webkit-calc(100% - 60px)',
      margin: '0 auto',

    },
    'detailsContainer':{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginTop: '40px',

    },
    'detailsTitle':{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',

    },
    'table': {
      position: 'relative',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'left',
    },
    'projectTables' : {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%',
      marginBottom: '20px'
    },
    'projectTitle':{
      fontWeight: '600',
      fontSize: '20px',
      display: 'flex',
      width: '100%'
    },
    'labelContainer' : {
      marginTop: '50px',
      display: 'flex',
      justifyContent: 'left',
      flexDirection: 'column',
      flex: 1,
    },
    'labelPair' : {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
      width: '-webkit-calc(100% - 30px)'
    },
    'spanText' : {
      marginBottom: '10px',
      width: '200px',
      color: '#292c2e',
      fontWeight: '600'

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
  }));
  const [showCreateProject, setShowCreateProject] = useState(false);
  const classes = useStyles();
  const handleCreateProject = (data) => {
    setShowCreateProject(data)
  }
  
  const params = useParams();
  useEffect(() => {
    const getProject = () => {
        getDoc(doc(db, 'projects',params.projectid)).then((pquerySnap) => {
            setProject({id:pquerySnap.id, data:pquerySnap.data()});
            let projects = pquerySnap.data();
            projects.tickets.forEach((ticket)=>{
                getDoc(doc(db, 'ticketListing', ticket)).then((snap) => {
                    let ticket = snap.data();
                    ticket.id = snap.id;
                    setTickets((prev)=>[...prev, ticket]);
                    /* getDoc(doc(db, 'users', ticket.createdBy)).then((snap) => {
                        ticket.createdBy = snap.data().name;
                        getDoc(doc(db, 'users', ticket.assignee)).then((snap) => {
                            ticket.assignee = snap.data().name;
                        }).then(()=>(setTickets((prev) => [...prev,ticket])
                        ))
                    })*/
                    
                });
                
            });
            projects.team.forEach((user)=>{
                 getDoc(doc(db, 'users', user)).then((snap)=>{
                  let team = {id: snap.id, data: snap.data()};
                    setTeam((prev) => [...prev, team]);
                  });
            }); 
        });
  }

  getProject();
},[params.projectid]);
const timeStampToDate = (timeStamp) => {
  let date = new Date(timeStamp).toDateString();;
  console.log(date);
  // date = (`${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
  return date;
}
  return (
    showCreateProject ? 
    <CreateProject handleCreateProject={handleCreateProject} projectData = {project} teamDetails={team}/>
    :
    <div className={classes.projectDetContainer}> 
    <div className={classes.detailsContainer}>
      <div className={classes.detailsTitle}>
        <div className='breadcrumb'>Projects / {project?.data?.projectName}</div> 
        <div className='buttonCont'>
          <div className={classes.button} onClick={()=>handleCreateProject(true)}>Edit</div>
          <Link to={`/projects`}><div className={classes.button}>Back</div></Link>
        </div>
      </div>
      <div className={classes.projectTitle}>{project?.data?.projectName}</div>
      <Box className= "topSection">
      <div className={classes.labelContainer}>
        <div className={classes.labelPair}><div className={classes.spanText} >Description</div>{project?.data?.description}</div>
      </div>
      <div className={classes.table}> 
          <div className={classes.spanText}>Assigned Personnel</div>
          <TableContainer component={Paper} className={classes.userTableContainer}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {team?.map(({data}, index) => (
                    <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                  >
                    <TableCell align="left">{data.name}</TableCell>
                      <TableCell align="left">{data.email}</TableCell>
                      <TableCell align="left">{data.role}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>  
      </div>
      </Box>
      
    </div>
    <div className={classes.projectTables}>
     
      <div className={classes.table}> 
          <div className={classes.spanText}>Tickets under the project</div>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Title</TableCell>
                  <TableCell align="left">Developer</TableCell>
                  <TableCell align="left">Submitter</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Created on</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets?.map((ticket, index) => (
                  
                    <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                  >
                      
                        <TableCell align="left" className="ticketName">
                          <Link to={`/tickets/${ticket.id}`}>
                            {ticket.ticketTitle}
                        </Link>
                      </TableCell>
                      <TableCell align="left">{ticket.assignee.name}</TableCell>
                      <TableCell align="left">{ticket.createdBy.name}</TableCell>
                      <TableCell align="left">{ticket.status?.name}</TableCell>
                      <TableCell align="left">{timeStampToDate(ticket.createdOn)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>  
      </div>
      
    </div>
    </div>
  );
}

export default Project;
