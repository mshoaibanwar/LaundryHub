import React from "react";
import LeftNav from "./LeftNav";
import Orders from "./Orders";
import Users from "./Users";
import Home from "./Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Tab from "react-bootstrap/Tab";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";
import Shops from "./Shops";
import Riders from "./Riders";
import Rides from "./Rides";
import Ratings from "./Ratings";
import Header from "./Header";
import Login from "./Login";

function Main() {
  return (
    <div className="row App m-0 p-0">
      <Tab.Container id="left-tabs" defaultActiveKey="home">
        <BrowserRouter>
          <LeftNav />
          <div className=" col-xl-10 col-lg-9 col-md-9 col-sm-8 p-0 m-0">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="ratings" element={<Ratings />} />
              <Route path="shops" element={<Shops />} />
              <Route path="riders" element={<Riders />} />
              <Route path="rides" element={<Rides />} />
              <Route path="Orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
            </Routes>
          </div>
        </BrowserRouter>
      </Tab.Container>
    </div>
  );
}

export default Main;
