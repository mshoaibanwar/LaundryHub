import axios from "axios";
import { useState, useEffect } from 'react';

function CatCard(props) {
    function Delete()
    {
        axios.post(`http://localhost:8080/categories/delete/${props.id}`)
            .then(function (response) {
                // handle success
                console.log(response);
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
                <div className="d-flex align-items-center">
                    <h4 className="m-0">{props.title}</h4>
                </div>
                <div>
                    <button onClick={Delete} className="btn btn-danger">Delete</button>
                </div>
            </div>
        </>
    );
}

export default CatCard;