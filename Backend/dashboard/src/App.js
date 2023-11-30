import React from 'react';
import LeftNav from './components/LeftNav';
import Pizzas from './components/Pizzas'
import AddPost from './components/AddPost'
import EditPost from './components/EditPost'
import Categories from './components/Categories'
import Sauces from './components/Sauces';
import Orders from './components/Orders';
import Users from './components/Users';
import Home from './components/Home';
import Veggies from './components/Veggies';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="row App m-0 p-0">
      <Tab.Container id="left-tabs-example" defaultActiveKey="home">
                <BrowserRouter>
                  <LeftNav/>
                  <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="items" element={<Pizzas />} />
                        <Route path="add" element={<AddPost />} />
                        <Route path="edit" element={<EditPost />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="sauces" element={<Sauces />} />
                        <Route path="veggies" element={<Veggies />} />
                        <Route path="Orders" element={<Orders />} />
                        <Route path="users" element={<Users />} />
                    </Routes>
                </BrowserRouter>
      </Tab.Container>
    </div>
  );
}

export default App;
