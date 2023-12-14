import React from "react";
import LeftNav from "./components/LeftNav";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Tab from "react-bootstrap/Tab";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Shops from "./components/Shops";
import Riders from "./components/Riders";
import Rides from "./components/Rides";
import Ratings from "./components/Ratings";

function App() {
  return (
    <div className="row App m-0 p-0">
      <Tab.Container id="left-tabs" defaultActiveKey="home">
        <BrowserRouter>
          <LeftNav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="ratings" element={<Ratings />} />
            <Route path="shops" element={<Shops />} />
            <Route path="riders" element={<Riders />} />
            <Route path="rides" element={<Rides />} />
            <Route path="Orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Routes>
        </BrowserRouter>
      </Tab.Container>
    </div>
  );
}

export default App;
