import Card from 'react-bootstrap/Card';
import React from 'react';
import './PizzaCard.css'
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function PizzaCard(props) {
   const navigate = useNavigate();
   function Edit()
   {
        navigate('/edit?id=' + props.id, { replace: true });
   }
   function Delete()
   {
      axios.post(`http://localhost:8080/posts/delete/${props.id}`)
      .then(function (response) {
          // handle success
          console.log(response);
          props.setU(props.price);
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
        <div className='pizcard col-xxl-6 col-xl-6 col-md-6 col-sm-12 flex-nowrap p-1' >
            <Card className='flex-row row m-0 h-100 shadow-lg' key={props.id}>
              <div className='col-5 ps-0'>
                  <img alt="" src={props.img} className='w-100 card-img'></img>
              </div>
              <Card.Body className='col-7 justify-content-center align-items-center'>
                <div className='cardcont d-flex flex-column justify-content-evenly h-100'>
                  <h2>{props.title}</h2>
                  <h4>{props.desc}</h4>
                  <div className='btndiv d-flex align-items-center justify-content-between'>
                    <h3>Rs. {props.price}</h3>
                    <div className='d-flex gap-1'>
                        <button onClick={Edit} className='btn btn-dark shadow-lg'>Edit</button>
                        <button onClick={Delete} className='btn btn-danger shadow-lg'>Delete</button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
        </div>
    );
}
export default PizzaCard;