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
function Project() 
{
  const [project, setProject] = useState({});

  const [team, setTeam] = useState([]);
  const [tickets, setTickets] = useState([]);
  const useStyles = makeStyles((theme)=>({
    'tableTitle' : {
      backgroundColor: "#ddd",
      margin: theme.spacing(2),
      height: '30px',
      padding: theme.spacing(2),
      width: '500px',
      top: '10px',
      position: 'ABSOLUTE'
    },
    'tableContainer': {
      border: '1px solid #ddd',
      
    },
    'detailsContainer':{
      position: 'relative',
      width: '-webkit-calc(100% - 60px)',
      display: 'flex',
      marginLeft: '20px'
    },
    'detailsTitle':{
      backgroundColor: "#ddd",
      height: '60px',
      width: '-webkit-calc(100% - 50px)',
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
    'projectTables' : {
      display: 'flex',
      justifyContent: 'space-evenly',
    },
    'labelContainer' : {
      marginTop: '80px',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginLeft: '30px',
    },
    'labelPair' : {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px'
    },
    'spanText' : {
      fontSize: '12px',
      marginBottom: '10px',
    }
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

  return (
    showCreateProject ? 
    <CreateProject handleCreateProject={handleCreateProject} projectData = {project} teamDetails={team}/>
    :
    <div className="App"> 
    <div className={classes.detailsContainer}>
      <div className={classes.detailsTitle}>
        Details of the project - {project?.data?.projectName}
        <span onClick={()=>handleCreateProject(true)}>Edit project</span>
        <Link to={`/projects`}>Back to project list</Link>
      </div>
      <div className={classes.labelContainer}>
        <div className={classes.labelPair}><div className={classes.spanText}>Project name</div>{project?.data?.projectName}</div>
        <div className={classes.labelPair}><div className={classes.spanText} >Project description</div>{project?.data?.description}</div>
      </div>
    </div>
    <div className={classes.projectTables}>
      <div className={classes.table}> 
          <div className={classes.tableTitle}>Assigned Personnel</div>
          <TableContainer style={{ width: 550 }} component={Paper} className={classes.tableContainer}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">User name</TableCell>
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
      <div className={classes.table}> 
          <div className={classes.tableTitle}>Tickets under the project</div>
          <TableContainer style={{width: 550}} component={Paper}>
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
                      <Link to={`/ticket/${ticket.id}`}>
                        <TableCell align="left">{ticket.ticketNumber}</TableCell>
                      </Link>
                      <TableCell align="left">{ticket.assignee.name}</TableCell>
                      <TableCell align="left">{ticket.createdBy.name}</TableCell>
                      <TableCell align="left">{ticket.status}</TableCell>
                      <TableCell align="left">{ticket.createdOn}</TableCell>
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
