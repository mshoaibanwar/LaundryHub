import React, { useState } from 'react';
import OrderCard from './OrderCard';
import { useEffect } from 'react';
import axios from "axios";
import './style.css'

function Orders()
{
    const [orders, setOrders ] = useState();
    const [updated, setUpdated ] = useState("");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8080/orders/${filter}`)
        .then(function (response) {
            // handle success
            setOrders(response.data);
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
                    <h2>Orders</h2> 
                    <div className='container d-flex justify-content-between align-items-center gap-2 my-3'>
                        <h3 className='menuhead my-auto'>Filters</h3>
                        <div className='menupills d-flex justify-content-evenly w-75'>
                            <button onClick={() => setFilter("Pending")} className='btn btn-danger shadow-lg p-2 rounded-5 border border-black fw-bold'>
                                 Pending
                            </button>
                            <button onClick={() => setFilter("Confirmed")} className='btn btn-secondary shadow-lg p-2 rounded-5 border border-black fw-bold'>
                                 Confirmed
                            </button>
                            <button onClick={() => setFilter("Out for Delivery")} className='btn btn-primary shadow-lg p-2 rounded-5 border border-black fw-bold'>
                                Delivering
                            </button>
                            <button onClick={() => setFilter("Delivered")} className='btn btn-success shadow-lg p-2 rounded-5 border border-black fw-bold'>
                                Delivered
                            </button>
                        </div>
                        <button onClick={() => setFilter("")} className='btn btn-dark shadow-lg p-2 px-3 rounded-5 border border-black fw-bold'>
                                All
                        </button>
                    </div>
                        {orders?
                            <div className='container justify-content-between m-0 mb-5 row'>
                                {orders.map((item, index) => <OrderCard item={item} key={index} setU={setUpdated}/>)}
                            </div>
                        : "Loading..."}
                </div>
            </div>
        </div>
    );
}

export default Orders;