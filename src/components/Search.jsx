
import React, { useState } from 'react'
import SearchIcon from "@material-ui/icons/Search";
import { InputBase } from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel"
import {makeStyles} from "@material-ui/core/styles";
import { useEffect } from 'react';
import { collection, getDocs , query} from "firebase/firestore";
import { db } from "../firebase.config";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import '../Style/search.css';
import ListSubheader from '@mui/material/ListSubheader';

const useStyles = makeStyles((theme)=>({
    search:{
      display : "flex",
      alignItems: "center",
      borderRadius: theme.shape.borderRadius,
      width: "100%",
      marginLeft: "40px",
      marginRight: "40px",
        [theme.breakpoints.down("sm")] : {
            display: (props) => (props.open ? "flex" : "none"),
        },
  
    },
    input:{
        color: "black",
        marginLeft: theme.spacing(1),
        borderBottom: "1px solid #ddd",
        borderRadius: "0",
        width: "100%"
    },
    searchButton:{
      display: "block",
      [theme.breakpoints.up("sm")] : {
          display: "none"
      }
    }
  }));

  /*useEffect(()=>{
    const 
  },[searchTerm])
  */
function Search() {
    
    const classes = useStyles();
    const [startedTyping, setStartedTyping] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredList, setFilteredList] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [projects, setProjects] = useState([]);


    const getProjects = () => {
      const projectRef = collection(db,"projects");
      const pq = query(projectRef)
      getDocs(pq).then((pquerySnap)=>{
        pquerySnap.forEach((returnedDoc)=>{
          setProjects((prev) => [...prev, {title: returnedDoc.data().projectName, id: returnedDoc.id}]);
          
        });
       });
      
       
    }
    useEffect(() => {
        const getTickets = () => {
          const ticketRef = collection(db,"ticketListing");
          const pq = query(ticketRef)
          getDocs(pq).then((pquerySnap)=>{
            pquerySnap.forEach((returnedDoc)=>{
                let {ticketTitle} = returnedDoc.data();
                setTickets((prev) => [...prev, {title: ticketTitle, id: returnedDoc.id}]);
            });
    
           });
        }
        getTickets();getProjects();
      },[]);

    const onSearchInpChange = (e) => {
        setSearchTerm(e.target.value);
        setFilteredList(null);
        if(e.target.value.length)
        {
            setStartedTyping(true);
            const list = tickets.filter((ticket)=>{
              return (ticket.title.toLowerCase().includes(e.target.value))
          })
          const projectList = projects.filter((project)=>{
              return (project.title.toLowerCase().includes(e.target.value))
          })
          console.log(list);
          console.log(projectList);
          setFilteredList({"list":list, "projects":projectList});
        }
        else
        {
            setStartedTyping(false);
        }
       
    }
    const clearBox = () => {
        setSearchTerm("");
        setStartedTyping(false);
    }
  return (
    <div className='searchCont'>
        <div className={classes.search}>
            <SearchIcon style= {{color: 'black'}}/>
            <InputBase placeholder="Search..." className={classes.input} value={searchTerm} onChange={onSearchInpChange}/>
            {startedTyping && <Cancel onClick={clearBox} className={classes.cancel} />}
        </div>
        <SearchIcon className={classes.searchButton} />
        {filteredList && 
            <div className='suggestionList'>
                {filteredList.list && filteredList.list.length !== 0 && 
                  <ListSubheader>Tickets</ListSubheader>} 
                    {filteredList.list?.map((item)=>(
                          <ListItemButton component="a" href={`/tickets/${item.id}`}>
                              <ListItemText primary= {item.title} />
                          </ListItemButton>
                      ))}
                {filteredList.projects && filteredList.projects.length !== 0 &&
                  <ListSubheader>Projects</ListSubheader>} 
                    {filteredList.projects?.map((item)=>(
                          <ListItemButton component="a" href={`/projects/${item.id}`}>
                              <ListItemText primary= {item.title} />
                          </ListItemButton>
                      ))}
          </div>
        }
        
 

      </div>
  )
}

export default Search;