import axios from "axios";
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import * as formik from 'formik';
import * as yup from 'yup';
import CatCard from "./CatCard";
import './style.css'

function Sauces() {
    const [data, setData] = useState(null);
    const [updated, setUpdated] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8080/sauces')
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

    const { Formik } = formik;

    const schema = yup.object().shape({
        title: yup.string().required(),
    });


    function Add(values)
    {
        console.log(values);
        axios.post('http://localhost:8080/sauces/add', values)
            .then(function (response) {
                // handle success
                console.log(response);
                setUpdated(updated+1);
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
        <div className="col-lg-9 p-4">
            <div className="bg-white rounded-4 p-3 rightSec">
                <div className='container'>
                    <h3>Add Sauce</h3>
                    <Formik
                        validationSchema={schema}
                        onSubmit={(values) => Add(values)}
                        initialValues={{
                            title: '',
                        }}
                        >
                        {({ handleSubmit, handleChange, values }) => (
                            <Form onSubmit={handleSubmit} className="d-flex gap-2 m-3">
                                    <Form.Control type="text" name="title" value={values.title} onChange={handleChange} placeholder="Category Name" required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a name.
                                    </Form.Control.Feedback>
                                    <button type="submit" className="btn btn-success btn-lg w-25">Add</button>
                            </Form>
                        )}
                    </Formik>

                    {data? 
                    <div className='container d-flex gap-2 row m-0'>
                        <h3>Sauces</h3>
                        {data.map((item) => <CatCard title={item.title} id={item._id} key={item._id} setU={setUpdated}/> )}
                    </div>
                    : <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
  }
  
  export default Sauces;