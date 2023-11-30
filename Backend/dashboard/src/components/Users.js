import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import './style.css'
import UserCard from './UserCard';

function Users()
{
    const [users, setUsers ] = useState();
    const [updated, setUpdated ] = useState("");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8080/users/${filter}`)
        .then(function (response) {
            // handle success
            setUsers(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
    }, [updated, filter])

    return(
        <div className="col-lg-9 p-4">
            <div className="bg-white rounded-4 p-3 rightSec">
                <div className='container overflow-y-scroll h-100'>
                    <h2>Users</h2> 
                    <div className='container d-flex justify-content-between align-items-center gap-2 my-3'>
                        <h3 className='menuhead my-auto'>Filters</h3>
                        <div className='menupills d-flex justify-content-evenly w-75'>
                            <button onClick={() => setFilter("true")} className='btn btn-success shadow-lg p-2 rounded-5 border border-black fw-bold'>
                                 Verified
                            </button>
                            <button onClick={() => setFilter("false")} className='btn btn-danger shadow-lg p-2 rounded-5 border border-black fw-bold'>
                                 Not Verified
                            </button>
                        </div>
                        <button onClick={() => setFilter("")} className='btn btn-dark shadow-lg p-2 px-3 rounded-5 border border-black fw-bold'>
                                All
                        </button>
                    </div>
                        {users?
                            <div className='container justify-content-between m-0 mb-5 row gap-2'>
                                {users.map((item) => <UserCard item={item} key={item._id} setU={setUpdated}/>)}
                            </div>
                        : "Loading..."}
                </div>
            </div>
        </div>
    );
}

export default Users;