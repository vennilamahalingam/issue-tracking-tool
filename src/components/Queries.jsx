import {useState, useEffect} from "react";
import { addDoc,getDoc,doc, collection, getDocs , query, where, serverTimestamp} from "firebase/firestore";
import { db } from "../firebase.config";

function Queries()
{
    const [users,setUsers] = useState(null);
    const [projects,setProjects] = useState(null);
    const [tickets,setTickets] = useState(null);
    const ticket_info = {
        assignee : "GJUQ0gXl3CxZcIMWzsfw",
        createdBy :"nNmtCOOGXzjgg5BnPbZ4",
        createdOn : "serverTimestamp",
        description : "Adding queried perform write operation",
        priority : "major",
        projectId : "Yk12JqWUaetNlvL1Ygqd",
        status :"open",
        ticketNumber : 1,
        ticketTitle : "Performing writes",
        type : "feature"
    }
    useEffect(()=>{
        const fetchUsers = async()=> {
            let listings = [];
            let projectListing = [];
            let ticketListing = [];

            const userRef = collection(db,"users");

            const q = query(userRef)
            const querySnap = await getDocs(q);
            querySnap.forEach((doc)=>{
                listings.push(
                    {
                        id: doc.id,
                        data: doc.data()
                    }
                )
            });
                setUsers(listings);
            
            const projectRef = collection(db,"projectListing");

           const pq = query(projectRef)
            const pquerySnap = await getDocs(pq);
            pquerySnap.forEach((doc)=>{
                projectListing.push(
                    {
                        id: doc.id,
                        data: doc.data()
                    }
                )
            });
            setProjects(projectListing);
           console.log( projectListing);
           const docRef_5 = doc(db, 'users/GJUQ0gXl3CxZcIMWzsfw');
            const docSnap_5 = await getDoc(docRef_5);
            console.log(docSnap_5.data())
           /*projectListing[0].data.team.map(async (item) => {
            const docRef_4 = doc(db, "users", item);
            const docSnap_4 = await getDoc(docRef_4);
            console.log(docSnap_4.data())
           })
            */
            const docRef_1 = doc(db, "users", "FdSHbGhyAY983VvpiKhS");
            const docSnap_1 = await getDoc(docRef_1);
            console.log(docSnap_1.data())
            const docRef_2 = doc(db, "tickets", "ekiAzoV7q45Z5x6AumIg");
            const docSnap_2 = await getDoc(docRef_2);
            console.log(docSnap_2.data())
            
            const ticketRef = collection(db,"tickets");
            const tq = query(ticketRef)
            const tquerySnap = await getDocs(tq);
            tquerySnap.forEach((doc)=>{
                ticketListing.push(
                    {
                        id: doc.id,
                        data: doc.data()
                    }
                )
            });
            setTickets(ticketListing);
            console.log(ticketListing)
        }
        fetchUsers();
    },[]);

    return <>
    <div>
    {
        
    }
    </div>
    </>
}
export default Queries;