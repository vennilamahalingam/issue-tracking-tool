import { updateDoc,doc, collection, getDocs , query} from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Grid} from "@material-ui/core";
import UserTable from '../components/UserTable';

function UserRoleManagement() {
    const [users, setUsers] = useState([]);
    const roles = [
      'developer',
      'project manager',
      'qa'
    ];
    const [userRole, setUserRole] = useState({user: '', role: 'developer'});
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
    const handleUserChange = (event) => {
      const { options } = event.target;
      let value = '';
      for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
          value = options[i].value;
        }
      }
      setUserRole((prev) => {return {...prev, 'user': value}});
    };
    const handleRoleChange = (event) => {
      setUserRole((prev) => {return {...prev, 'role': event.target.value}});
    }
    const onSubmit = async () => {
      const userRef = doc(db, "users", userRole.user);
      await updateDoc(userRef, {
        role: userRole.role,
    });
    getUsers();
    }
  return (
    <>
        <div><h2>Manage user roles</h2></div>
    <Grid container>
      <Grid item xs={4}>
      <div className="leftSection">
        <div>
          <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
            <InputLabel shrink htmlFor="select-multiple-native">
            Select user
            </InputLabel>
            <Select
              native
              value={userRole.user}
              // @ts-ignore Typings are not considering `native`
              onChange={handleUserChange}
              label="Select user"
              inputProps={{
                id: 'select-multiple-native',
              }}
        >
          {users.map((user, index) => (
            <option key={user.id} value={user.id}>
              {user.data.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
    <div>
      <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
              <InputLabel shrink htmlFor="select-multiple-native">
              role
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={userRole.role}
                label="role"
                onChange={handleRoleChange}
          >
            {roles.map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
      <Button variant="outlined" onClick={onSubmit}>SUBMIT</Button>
      </div>
    </div>
      </Grid>
      <Grid item xs={8}>
        <UserTable users={users}/>
      </Grid>
    </Grid>
    </>

    
  );
}

export default UserRoleManagement;
