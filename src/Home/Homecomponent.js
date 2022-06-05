import React from 'react'
import { useEffect, useState } from 'react';
import {db} from '../firebase-config';
import {collection, addDoc, getDocs, deleteDoc, updateDoc, doc, documentId, FieldPath, Firestore,setDoc, getDoc} from 'firebase/firestore';
//import flatpickr from "flatpickr";
import { Ref } from 'react';

export default function Homecomponent() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departuretime, setDeparturetime] = useState('00:00');
    const [trains, setTrains] = useState([]);
   

    useEffect(() => {
        getTrains();
    }, []);
    
    
    const addTrains = async () => {
        
        const docRef = await addDoc(collection(db, "Trains"), {
            from:from,
            to:to,
            departure:departuretime

        }).then(() => {
            alert("Train Successfully Added !");
            clearTexts();
            getTrains();
        }).catch(() => {
            alert("Train Adding Failed !")
        });
        
    }

    const deleteTrain = async (id) => {
       console.log(id);
        await deleteDoc(doc(db, "Trains", id)); // last point - object id
            
    }

    const updateTrain = async (id) =>{
        const docRef = doc(db, "Trains", id);
        const docSnap = await getDoc(docRef);

        document.getElementById("fromid").value=docSnap.data().from;
        document.getElementById("toid").value=docSnap.data().to;
        document.getElementById("timeid").value=docSnap.data().departure;


        }

    const getTrains = async () => {
        const querySnapshot = await getDocs(collection(db, "Trains"));
        setTrains(querySnapshot.docs.map((doc) => ({
            ...doc.data()
            
            
        })));
        
    }

    const clearTexts = () => {
        setFrom('');
        setTo('');
        setDeparturetime('00:00');
    }
    

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">From</label>
                            <input type="text" value={from} id="fromid" name='fromid' onChange={(e) => { setFrom(e.target.value) }} class="form-control"  placeholder="From" />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">To</label>
                            <input type="text" value={to} id="toid" name='toid' onChange={(e) => { setTo(e.target.value) }} class="form-control"  placeholder="To" />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Departure</label>
                            <input type="timeapp"  id="timeid" name='timeid' value={departuretime} onChange={(e) => { setDeparturetime(e.target.value) }} class="form-control"   />
                        </div>
                       
                        <button type="button" class="btn btn-primary" onClick={addTrains}>Save Train</button>
                        
                    </div>
                    <div className="col">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">From</th>
                                    <th scope="col">To</th>
                                    <th scope="col">Departure</th>
                                    <th scope="col">Delete</th>
                                    <th scope="col">Update</th>

                                    
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    trains.map((train) => {
                                        return (
                                            <tr>
                                                <td>{train.from}</td>
                                                <td>{train.to}</td>
                                                <td>{train.departure}</td>
                                                <td> <button type="button" class="btn btn-danger"  onClick={() => {deleteTrain(train.id)}}>Delete</button></td>
                                                <td> <button type="button" class="btn btn-primary" style={{ marginLeft: 10 }} onClick={updateTrain} >Update</button></td>
                                                
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div> 
                </div>
            </div>
        </div>
    );
}
