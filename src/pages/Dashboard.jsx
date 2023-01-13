import { useEffect, useState } from 'react';
import {collection, getDocs , query} from "firebase/firestore";
import { db } from "../firebase.config";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { flexbox } from '@mui/system';
import { useSelector } from "react-redux";

function Dashboard()
{
    const userDetails = useSelector(state => state);
    const [tickets, setTickets] = useState([]);
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
    useEffect(() => { 
        getTickets();
      },[]);
      let caseQuantity = {
        'minor': 0,
        'major': 0,
        'critical': 0,
        'medium': 0
      };
      let typeQuantity = {
        'bug' : 0,
        'feature' : 0
      };
      let statusQuantity = {
        'open' : 0,
        'closed' : 0,
        'resolved' : 0,
        'inprogress': 0,
      };
    tickets.map((ticket) => {
        if(caseQuantity[ticket?.priority?.name] !== undefined)
        {
            caseQuantity[ticket?.priority?.name]++;
        }
        if(statusQuantity[ticket?.status?.name] !== undefined)
        {
            statusQuantity[ticket?.status?.name]++;
        }
        if(typeQuantity[ticket?.type?.name] !== undefined)
        {
            typeQuantity[ticket?.type?.name]++;
        }
        
    })
    const priorityData = [
        {
          priority: "Minor",
          number: caseQuantity.minor,
        },
        {
            priority: "Major",
            number: caseQuantity.major,
          },
          
        {
            priority: "Critical",
            number: caseQuantity.critical,
          },
          {
            priority: "Medium",
            number: caseQuantity.medium,
          },
      ];
    const statusData = [
        {
            status: "open",
            number: statusQuantity.open,
        },
        {
            status: "closed",
            number: statusQuantity.closed,
        },
        {
            status: "resolved",
            number: statusQuantity.resolved,
        },
        {
            status: "inprogress",
            number: statusQuantity.inprogress,
        },
    ];
    const typeData = [
        {
            type: "bug",
            number: typeQuantity.bug
        },
        {
            type: "feature",
            number: typeQuantity.feature,
        }
    ]
    return (
        <div style={{marginTop: '50px'}}>
            <div>{console.log(userDetails)}</div>
            <div style={{display:'flex',}}>
                <div>
                    <BarChart
                        width={400}
                        height={300}
                        data={priorityData}
                        margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                        }}
                    >
                        
                        <XAxis dataKey="priority"       />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="number" fill="#8884d8" />
                    </BarChart>
                </div>
                <div>
                    <BarChart
                        width={400}
                        height={300}
                        data={statusData}
                        margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                        }}
                    >
                        
                        <XAxis dataKey="status"       />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="number" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
            <div>
                <BarChart
                    width={400}
                    height={300}
                    data={typeData}
                ><CartesianGrid strokeDasharray="3 3" />
                    
                    <XAxis dataKey="type"       />
                    <YAxis />
                    
                    <Tooltip />
                    <Legend content="asd"/>
                    <Bar dataKey="number" fill="#8884d8" />
                </BarChart>
            </div>
        </div>
       
    )
}
export default Dashboard;