import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import './style.css'
import {BoxSeam, FilePost, BookmarkFill, BoxSeamFill, PeopleFill, CircleFill} from "react-bootstrap-icons"

function Home()
{
    const [oCount, setoCount] = useState(null);
    const [opCount, setopCount] = useState(null);
    const [uCount, setuCount] = useState(null);
    const [cCount, setcCount] = useState(null);
    const [pCount, setpCount] = useState(null);
    const [sCount, setsCount] = useState(null);
    const [vCount, setvCount] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/posts/count/`)
        .then(function (response) {
            // handle success
            setpCount(response.data['Count']);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

        axios.get(`http://localhost:8080/categories/count/`)
        .then(function (response) {
            // handle success
            setcCount(response.data['Count']);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

        axios.get(`http://localhost:8080/users/count/`)
        .then(function (response) {
            // handle success
            setuCount(response.data['Count']);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

        axios.get(`http://localhost:8080/orders/count/`)
        .then(function (response) {
            // handle success
            setoCount(response.data['Count']);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

        axios.get(`http://localhost:8080/orders/count/pending/`)
        .then(function (response) {
            // handle success
            setopCount(response.data['Count']);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

        axios.get(`http://localhost:8080/sauces/count/`)
        .then(function (response) {
            // handle success
            setsCount(response.data['Count']);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

        axios.get(`http://localhost:8080/veggies/count/`)
        .then(function (response) {
            // handle success
            setvCount(response.data['Count']);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

    }, [])

    return(
        <div className="col-lg-9 p-4">
            <div className="bg-white rounded-4 p-3 rightSec">
                <div className='container-fluid overflow-y-scroll h-100'>
                        <h2 className='m-4'>Home</h2> 
                        <div className='row m-0 justify-content-between'>
                            <div className='p-1 col-lg-6'>
                                <div className='card flex-row align-items-center justify-content-between p-2'>
                                    <FilePost size={62}></FilePost>
                                    <div className='text-end me-2'>
                                        <h4>Items</h4>
                                        <h1 className=' fw-light'>{pCount? pCount : "Loading..."}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className='p-1 col-lg-6'>
                                <div className='card flex-row align-items-center justify-content-between p-2'>
                                    <BookmarkFill size={62}></BookmarkFill>
                                    <div className='text-end me-2'>
                                        <h4>Categories</h4>
                                        <h1 className=' fw-light'>{cCount? cCount : "Loading..."}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className='p-1 col-lg-6'>
                                <div className='card flex-row align-items-center justify-content-between p-2'>
                                    <PeopleFill size={62}></PeopleFill>
                                    <div className='text-end me-2'>
                                        <h4>Users</h4>
                                        <h1 className=' fw-light'>{uCount? uCount : "Loading..."}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className='p-1 col-lg-6'>
                                <div className='card flex-row align-items-center justify-content-between p-2'>
                                    <BoxSeamFill size={62}></BoxSeamFill>
                                    <div className='text-end me-2'>
                                        <h4>Orders</h4>
                                        <h1 className=' fw-light'>{oCount? oCount : "Loading..."}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className='p-1 col-lg-6'>
                                <div className='card flex-row align-items-center justify-content-between p-2'>
                                    <BoxSeam size={62}></BoxSeam>
                                    <div className='text-end me-2'>
                                        <h4>New Orders</h4>
                                        <h1 className=' fw-light'>{opCount? opCount : "Loading..."}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className='p-1 col-lg-6'>
                                <div className='card flex-row align-items-center justify-content-between p-2'>
                                    <CircleFill size={62}></CircleFill>
                                    <div className='text-end me-2'>
                                        <h4>Sauces</h4>
                                        <h1 className=' fw-light'>{sCount? sCount : "Loading..."}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className='p-1 col-lg-6'>
                                <div className='card flex-row align-items-center justify-content-between p-2'>
                                    <CircleFill size={62}></CircleFill>
                                    <div className='text-end me-2'>
                                        <h4>Veggies</h4>
                                        <h1 className=' fw-light'>{vCount? vCount : "Loading..."}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default Home;