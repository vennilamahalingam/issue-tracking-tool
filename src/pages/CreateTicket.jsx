import { updateDoc,doc, collection, getDocs , query, addDoc, serverTimestamp, arrayUnion} from "firebase/firestore";
import { db } from "../firebase.config";
import {makeStyles} from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {useNavigate, useParams} from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';

import NativeSelect from '@mui/material/NativeSelect';

function CreateTicket({userDet, handleCreateTicket, ticketDetails})
{
    
    const useStyles = makeStyles((theme) => ({
        "formContainer":{
            padding: '250px',
            paddingTop: '100px'
        },
        "form": {
            display : 'flex',
            justifyContent: 'space-around',
        },
        "userForm": {
            display : 'flex',
            flexDirection: 'column',
        },
        "select" : {
            height: '123px',
        },
        'button': {
            marginLeft: '10px',
            marginTop: '50px',
            width: '140px',
            textDecoration: 'underline',
            lineHeight: '18px'
          },
        "teamContainer": {
            display: "flex",
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: "end"
        },
        "mainContainer": {
            display: 'flex',
            marginTop: '50px',
            justifyContent: "space-between",
        },
        "tableContainer": {
            width: "600px",
            fontSize: '10px'
        }
    }));      
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
      const getProjects = () => {
        const projectRef = collection(db,"projects");
        const pq = query(projectRef)
        getDocs(pq).then((pquerySnap)=>{
          pquerySnap.forEach((returnedDoc)=>{
            setProjects((prev)=> [...prev, {
                id: returnedDoc.id,
                data: returnedDoc.data(),
               }]);
            });
            
         });
         
      }
      useEffect(()=>{
            getUsers();
            getProjects();
      },[]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const ticketInitialData = {
        assignee : {
            "name" : "",
            "id" : ""
        }
    }
    const [ticketData, setTicketData] = useState(ticketDetails?ticketDetails: ticketInitialData);
    const [projects, setProjects] = useState([]);
   
    const dateToTimestamp = () => {
        const currentDate = new Date();
        return currentDate.getTime();
      }
      const timeStampToDate = (timeStamp) => {
        return new Date(timeStamp);
      }
    const handleTicketCreation = async () => {
    let ticketId = "";
    if(ticketDetails)
    {
        let docReference = doc(db, "ticketListing", ticketData.id);
        await updateDoc(docReference, ticketData);
        ticketId = ticketDetails.id;
    }
    else
    {
        ticketData.ticketNumber = "4";
        ticketData.createdOn = dateToTimestamp();
        ticketData.history = [
            {
                property: 'ticketCreated',
                oldValue: ticketData.createdBy,
                newValue: ticketData.assignee,
                date: dateToTimestamp(),
            }
        ]
        console.log(ticketData);
        const docRef = await addDoc(collection(db,"ticketListing"),ticketData);
        ticketId = docRef.id;
        const docReference = doc(db, "projects", ticketData.projectId.id);
        await updateDoc(docReference, {tickets : arrayUnion(ticketId)});
    }
    navigate(`/ticket/${ticketId}`);
    }
    const handleChange = (event, keyName) => {
        const { options } = event.target;
        let value = {};
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value = {id: options[i].dataset.key, name : options[i].value};
          }
        }
    setTicketData((prev) => {
        prev[keyName] = value;
        return prev;});
        console.log(ticketData)
    };
    const classes = useStyles();
    return (
        <div>
            <Box
            component="form"
            className={classes.formContainer}
            sx={{
                '& .MuiTextField-root': { width: '42ch'},
              }}
            >
                <Box className={classes.form}>
                <TextField
                id="standard-multiline-flexible"
                label="Ticket title"
                multiline
                maxRows={4}
                value={ticketData?.ticketTitle}
                onChange={(e) => setTicketData((prev) => {return {...prev, "ticketTitle": e.target.value}})}
                variant="standard"
                />
                <TextField
                id="standard-multiline-flexible"
                label="Ticket description"
                multiline
                maxRows={4}
                value={ticketData?.description}
                onChange={(e) => setTicketData((prev) => {return {...prev, "description": e.target.value}})}
                variant="standard"
                />
                </Box>
                <Box className={classes.teamContainer}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200,}}>
                        <InputLabel id="demo-simple-select-standard-labels">Developer</InputLabel>
                        <Select
                        native
                        onChange={(e) => handleChange(e, "assignee")}
                        labelId="demo-simple-select-standard-labels"
                        id="demo-simple-select-standard"
                        value={ticketData?.assignee?.name}
                        label="Native"
                        inputProps={{
                            id: 'select-native',
                        }}
                        >
                            {users.map((user, index) => (
                            user.data?.role === "developer" && <option value ={user.data?.name} data-key= {user.id}>
                            {user.data?.name}
                            </option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200,}}>
                        <InputLabel id="demo-simple-select-standard-label">Submitter</InputLabel>
                        <Select
                        native
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={ticketData?.createdBy?.name}
                        onChange = {(e) => handleChange(e, "createdBy")}
                        label="submitter"
                        > 
                            <option data-key= {userDet?.id} value={userDet?.displayName}>
                            {userDet?.displayName}
                            </option>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200,}}>
                        <InputLabel id="demo-simple-select-standard-labelq">Project</InputLabel>
                        <Select
                        native
                        labelId="demo-simple-select-standard-labelq"
                        id="demo-simple-select-standardq"
                        value={ticketData?.projectId?.name}
                        onChange = {(e) => handleChange(e, "projectId")}
                        label="Project"
                        >
                            {projects?.map((project, index) => (
                            <option value={project.data.projectName} data-key={project.id}>
                            {project.data.projectName}
                            </option>
                        ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box className={classes.teamContainer}>
                    
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200,}}>
                        <InputLabel id="demo-simple-select-standard-label">Priority</InputLabel>
                        <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={ticketData?.priority?.name}
                        onChange={(e) => handleChange(e, "priority")}
                        label="type"
                        native
                        >
                        <option data-key="minor" value="minor">Minor</option>
                        <option data-key="medium" value="medium">Medium</option>

                        <option data-key="major" value="major">Major</option>
                        <option data-key="critical" value="critical">Critical</option>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200,}}>
                        <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                        <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={ticketData?.status?.name}
                        onChange={(e) => handleChange(e, "status")}
                        label="type"
                        native
                        >
                            <option data-key="open" value="open">Open</option>
                        <option data-key="closed" value="closed">Closed</option>

                        <option data-key="resolved" value="resolved">Resolved</option>
                        <option data-key="inprogress" value="inprogress">Inprogress</option>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200,}}>
                        <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
                        <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={ticketData?.type?.name}
                        onChange={(e) => handleChange(e, "type")}
                        label="type"
                        >
                           <option data-key="bug" value="bug">Bugs/Errors</option>
                            <option data-key="feature" value="feature">Feature</option>
                        </Select>
                    </FormControl>
                </Box>
                <div className={classes.button} onClick={handleTicketCreation}>{ticketDetails? 'Save ticket details' : 'Create ticket'}</div>
                <div className={classes.button} onClick={()=>handleCreateTicket(false)}>{ticketDetails? 'back' : 'Back to list'}</div>
                </Box>
        </div>
    )
}
export default CreateTicket;