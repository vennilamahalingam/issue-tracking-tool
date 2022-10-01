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

function CreateTicket({userDet, handleShowCreateTicket, ticketDetails})
{
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const trueTicketData = {...ticketDetails}; 
    const [projects, setProjects] = useState([]);
    let ticketInitialData = {
            createdBy: {
                "name": userDet.displayName,
                "id" : userDet.id
            },
            type: {
                id: "bug",
                name: "bug",
            },
            status: {
                id: "open",
                name: "open",
            },
            priority: {
                id: "minor",
                name: "minor",
            },
    };
    const [ticketData, setTicketData] = useState(ticketDetails?ticketDetails: ticketInitialData);
    console.log(ticketDetails);
    const submitter = ticketData.createdBy ? ticketData.createdBy : {name: userDet.displayName, id: userDet.id};
    const useStyles = makeStyles((theme) => ({
        "formContainer":{
            top: "-webkit-calc(50% - 186px)",
            width: '800px',
            position: 'absolute',
            left: '-webkit-calc(50% - 305px)',
        },
        "formBox": {
            border: '1px solid #d3d3d3',
            borderRadius: '7px',
            padding: '40px',
            boxSizing: 'border-box',
        },
        "form": {
            display : 'flex',
            justifyContent: 'space-around',
            alignItems:'flex-end',
            
        },
        'buttonCont':{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: '30px'
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
                marginBottom: '20px'
              },
        "teamContainer": {
            display: "flex",
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: "end"
        },
        "userForm": {
            display : 'flex',
            flexDirection: 'column',
        },
        "select" : {
            height: '123px',
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
        let users = [];
        getDocs(pq).then((snap) => {
            snap.forEach((doc) => {
                let role = doc.data().role;
                if(role === "developer")
                {
                    return users.push({data : doc.data(), id: doc.id});
                }
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
    const dateToTimestamp = () => {
        const currentDate = new Date();
        return currentDate.getTime();
      }
      const timeStampToDate = (timeStamp) => {
        return new Date(timeStamp);
      }
    const handleTicketCreation = async () => {
    if(ticketDetails)
    {
        let history = [...ticketData?.history];
        if(trueTicketData.status.name !== ticketData?.status.name)
        {
            history.push({
                property: 'statusChanged',
                oldValue: trueTicketData.status,
                newValue: ticketData?.status,
                date: dateToTimestamp()
            })
        }
        if(trueTicketData.assignee.name !== ticketData?.assignee.name)
        {
            history.push({
                property: 'reAssigned',
                oldValue: trueTicketData.assignee,
                newValue: ticketData?.assignee,
                date: dateToTimestamp()
            })
        }

        let docReference = doc(db, "ticketListing", ticketData?.id);
        await updateDoc(docReference, ticketData);
        await updateDoc(docReference, {history: history});

        handleShowCreateTicket(false);
    }
    else
    {
        ticketData.ticketNumber = "4";
        ticketData.createdOn = dateToTimestamp();

        ticketData.assignee = ticketData?.assignee !== undefined? ticketData?.assignee : {name: users[0].data.name, id: users[0].id};
        ticketData.projectId = ticketData?.projectId !== undefined ? ticketData?.projectId : {name: projects[0].data.projectName, id: projects[0].id};

        ticketData.history = [
            {
                property: 'ticketCreatedAndAssigned',
                oldValue: ticketData?.createdBy,
                newValue: ticketData?.assignee,
                date: dateToTimestamp(),
            }
        ]
        console.log(ticketData);
        const docRef = await addDoc(collection(db,"ticketListing"),ticketData);
        const ticketId = docRef.id;
        const docReference = doc(db, "projects", ticketData?.projectId.id);
        await updateDoc(docReference, {tickets : arrayUnion(ticketId)});
        navigate(`/ticket/${ticketId}`);
    }
    
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
        return {...prev, [keyName] : value};
    }); 
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
                <div className={classes.tableTitleText}>{ticketDetails ? 'Edit' : 'Create'} ticket</div>
                <div className={classes.formBox}>
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
                            <InputLabel shrink id="demo-simple-select-standard-labels">Developer</InputLabel>
                            <Select
                            native
                            onChange={(e) => handleChange(e, "assignee")}
                            labelId="demo-simple-select-standard-labels"
                            id="demo-simple-select-standard"
                            value={ticketData?.assignee?.name}
                            label="Developer"
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
                            <InputLabel shrink id="demo-simple-select-standard-label">Submitter</InputLabel>
                            <Select
                            native
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={ticketData?.createdBy?.name}
                            onChange = {(e) => handleChange(e, "createdBy")}
                            label="submitter"
                            > 
                                <option data-key= {submitter?.id} value={submitter?.name}>
                                {submitter?.name}
                                </option>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 200,}}>
                            <InputLabel shrink id="demo-simple-select-standard-labelq">Project</InputLabel>
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
                            defaultValue={ticketData?.priority?.name}
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
                        <FormControl
                        variant="standard" sx={{ m: 1, minWidth: 200,}}>
                            <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            defaultValue={ticketData?.status?.name}
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
                        <FormControl
                        variant="standard" sx={{ m: 1, minWidth: 200,}}>
                            <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            defaultValue={ticketData?.type?.name}
                            onChange={(e) => handleChange(e, "type")}
                            label="type"
                            native
                            >
                                <option data-key="bug" value="bug">Bug/Error</option>
                                <option data-key="feature" value="feature">Feature</option>
                            </Select>
                        </FormControl>
                        
                    </Box>
                    <div className={classes.buttonCont}>
                        <div className={classes.button} onClick={handleTicketCreation}>{ticketDetails? 'Save ticket details' : 'Create ticket'}</div>
                        <div className={classes.button} onClick={()=>handleShowCreateTicket(false)}>{ticketDetails? 'back' : 'Back to list'}</div>
                    </div>
                </div>
                </Box>
        </div>
    )
}
export default CreateTicket;