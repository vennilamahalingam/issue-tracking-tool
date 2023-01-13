import { updateDoc,doc, collection, getDocs , query, addDoc} from "firebase/firestore";
import { db } from "../firebase.config";
import {makeStyles} from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Select from '@mui/material/Select';
import UserTable from '../components/UserTable';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {useNavigate, useParams} from "react-router-dom";

function CreateProject({handleCreateProject, projectData, teamDetails})
{
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const [isEditPage, setIsEditPage] = useState(params.edit);
    const getUsers = () => {
        const userRef = collection(db,"users");
        const pq = query(userRef);
        let users = [];
        getDocs(pq).then((snap) => {
            snap.forEach((doc) => {
              return users.push({data : doc.data(), id: doc.id});
            })
            setUsers(users);
        });
      }
      useEffect(()=>{
            getUsers();
      },[]);
    const {projectName, description} = projectData ? projectData.data : "";
    const projectTeam = teamDetails ? teamDetails : [];
    let teamInitialValue = "";
    let devInitialValue = [];
    let qaInitialValue = [];

    projectTeam && projectTeam.map((user, index)=>{
        if(user.data.role === "project manager") 
        teamInitialValue = user.id;
        else if(user.data.role === "developer")
        devInitialValue.push(user.id)
        else if(user.data.role === "qa")
        qaInitialValue.push(user.id)
    })
    const [name, setName] = useState(projectName);
    const [desc, setDesc] = useState(description);
    const [team, setTeam] = useState(teamInitialValue);
    const [dev, setDev] = useState(devInitialValue);
    const [qa, setQa] = useState(qaInitialValue);
   

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
        "userForm": {
            display : 'flex',
            flexDirection: 'column',
        },
        "select" : {
            height: '123px',
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
    const handleUserChange = (event) => {
        setTeam(event.target.value);
      };
      const handleDevChange = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        setDev(value);
      };    
      const handleProjectCreation = async () => {
        let formData = {
            projectName: name,
            manager: team,
            description: desc,
            team: [team,...dev,...qa],
        };
        let docRef = ""; 
        if(projectData)
        {
            let docReference = doc(db, "projects", projectData.id);
            await updateDoc(docReference, formData);
            handleCreateProject(false);
        }
        else
        {
            formData.tickets = [];
            docRef = await addDoc(collection(db,"projects"),formData);
            navigate(`/projects/${docRef.id}`);
        }
        
      }
      const handleQaChange = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        setQa(value);
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
                <div className={classes.tableTitleText}>Create project</div>
                <div className={classes.formBox}>
                    <Box className={classes.form}>
                    <TextField
                    id="standard-multiline-flexible"
                    label="Project name"
                    multiline
                    maxRows={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="standard"


                    />
                    <TextField
                    id="standard-multiline-flexible"
                    label="Project description"
                    multiline
                    maxRows={2}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    variant="standard"
                    />
                    </Box>
                    <Box className={classes.teamContainer}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 370,}}>
                            <InputLabel id="demo-simple-select-standard-label">Project Manager</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={team} 
                            onChange={handleUserChange}
                            label="Age"
                            >
                                {users.map((user, index) => (
                                user.data.role === "project manager" && <MenuItem value={user.id}>
                                {user.data.name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mt: 5, minWidth: 120, maxWidth: 300 }}>
                            <InputLabel shrink htmlFor="select-multiple-native">
                            Developer
                            </InputLabel>
                            <Select
                            multiple
                            native
                            value={dev}
                            // @ts-ignore Typings are not considering `native`
                            onChange={handleDevChange}
                            label="Native"
                            inputProps={{
                                id: 'select-multiple-native',
                            }}
                            >
                            {users.map((user, index) => (
                                user.data.role === "developer" && <option value={user.id} data-key={user.id}>
                                {user.data.name}
                                </option>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mt: 5, minWidth: 120, maxWidth: 300 }}>
                            <InputLabel shrink htmlFor="select-multiple-native">
                            Submitter
                            </InputLabel>
                            <Select
                            multiple
                            native
                            value={qa}
                            // @ts-ignore Typings are not considering `native`
                            onChange={handleQaChange}
                            label="Native"
                            inputProps={{
                                id: 'select-multiple-native',
                            }}
                            >
                            {users.map((user, index) => (
                                user.data.role === "qa" && <option value={user.id} data-key={user.id}>
                                {user.data.name}
                                </option>
                            ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <div className={classes.buttonCont}>
                        <div className={classes.button} onClick={handleProjectCreation}>{projectData? 'Update' : 'Create project'}</div>
                        <div className={classes.button} onClick={()=>handleCreateProject(false)}>{projectData? 'back' : 'Back to list'}</div>
                    </div>
                </div>
                </Box>
        </div>
    )
}
export default CreateProject;