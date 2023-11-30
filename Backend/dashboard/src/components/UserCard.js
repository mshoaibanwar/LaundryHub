import axios from "axios";
import { useState, useEffect } from 'react';

function UserCard(props) {
    function Delete()
    {
        axios.post(`http://localhost:8080/users/delete/${props.item['_id']}`)
            .then(function (response) {
                // handle success
                props.setU(111);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
    return (
        <>
            <div className="d-flex justify-content-between border rounded-3 p-2">
                <div className="row w-100 text-start">
                    <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <h5 className="m-0">Name: </h5>
                        <h5 className="m-0 fw-light">{props.item['name']}</h5>
                    </div>
                    <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <h5 className="m-0">Email: </h5>
                        <h5 className="m-0 fw-light">{props.item['email']}</h5>
                    </div>
                    <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <h5 className="m-0">Status: </h5>
                        <h5 className="m-0 fw-light text-primary">{props.item['confirmed']? "Verified" : "Pending"}</h5>
                    </div>
                </div>
                <div className="">
                    <button onClick={Delete} className="btn btn-danger">Delete</button>
                </div>
            </div>
        </>
    );
}

export default UserCard;