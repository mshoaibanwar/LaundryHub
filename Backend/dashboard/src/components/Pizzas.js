import PizzaCard from './PizzaCard';
import axios from "axios";
import { useState, useEffect } from 'react';
import './style.css'

function Home() {
    const [data, setData] = useState(null);
    const [updated, setUpdated] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8080/posts')
            .then(function (response) {
                // handle success
                setData(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }, [updated])

    return (
        <div className="col-lg-9 p-4">
            <div className="bg-white rounded-4 p-3 rightSec">
                <div className='container overflow-y-scroll h-100'>
                    {data? 
                    <div className='container justify-content-between m-0 mb-5 row'>
                        {data.map((item) => <PizzaCard img={item.img} title={item.title} desc={item.desc} price={item.price} id={item._id} key={item._id} setU={setUpdated}/> )}
                    </div>
                    : <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
  }
  
  export default Home;