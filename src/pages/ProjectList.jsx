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
import '../Style/projectList.css';
import {Link, useParams} from  "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import CreateProject from './CreateProject';
function ProjectList() 
{
  const [projects, setProjects] = useState([ ]);
  const [showCreateProject, setShowCreateProject] = useState(false);
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
      width: '100%',
    },
    'table': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '65px',
      width: '100%',
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
    'tableTitleText' :{
      fontSize: '20px',
    },
    'buttonLink': {
      color: '#000'
    }
  }));
 
  const classes = useStyles();
  useEffect(() => {
    const getProjects = () => {
      const projectRef = collection(db,"projects");
      const pq = query(projectRef)
      getDocs(pq).then((pquerySnap)=>{
        pquerySnap.forEach((returnedDoc)=>{
             getDoc(doc(db, "users", returnedDoc.data().manager)).then((snap)=>{
             setProjects((prev)=> [...prev, {
              id: returnedDoc.id,
              data: returnedDoc.data(),
              manager: snap.data()
             }]);
            })
            
        });

       });
      
       
    }
    getProjects();
  },[]);
  const handleCreateProjectState = (data) => {
    setShowCreateProject(data)
  }
  return(showCreateProject ? 
      <CreateProject handleCreateProject={handleCreateProjectState}/>
      :
      <div className="projectList">
      <div className={classes.table}> 
        <div className={classes.tableTitle}>
          <div className={classes.tableTitleText}>Projects</div>
          <div className={classes.button} onClick={()=>setShowCreateProject(true)}>Create new project</div> 
        </div>
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Project name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Manager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                
                  
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                  >
                    
                      <TableCell align="left" className='projectName'><Link to={`/projects/${project.id}`} >{project.data?.projectName}</Link></TableCell>
                    
                    <TableCell align="left">{project.data?.description}</TableCell>
                    <TableCell align="left">{project.manager?.name}</TableCell>

                  </TableRow>
                
              ))}
            </TableBody>
            </Table>
          </TableContainer>    
      </div>
    </div>
      );
}

export default ProjectList;
