import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./style.css";
import {
  BoxSeamFill,
  PeopleFill,
  Shop,
  Bicycle,
  StarFill,
} from "react-bootstrap-icons";

function Home() {
  const [ordersCount, setOrdersCount] = useState(null);
  const [ridersCount, setRidersCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [shopsCount, setShopsCount] = useState(null);
  const [ridesCount, setRidesCount] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/shops/count/`)
      .then(function (response) {
        // handle success
        setShopsCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/ratings/count/`)
      .then(function (response) {
        // handle success
        setRatingsCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/users/count/`)
      .then(function (response) {
        // handle success
        setUsersCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/orders/count/`)
      .then(function (response) {
        // handle success
        setOrdersCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/rides/count/`)
      .then(function (response) {
        // handle success
        setRidesCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/riders/count/`)
      .then(function (response) {
        // handle success
        setRidersCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  return (
    <div className="col-lg-10 p-4">
      <div className="bg-white rounded-4 p-3 rightSec">
        <div className="container-fluid overflow-y-scroll h-100">
          <h2 className="m-4">Home</h2>
          <div className="row m-0 justify-content-between">
            <div className="p-1 col-lg-6">
              <div className="card flex-row align-items-center justify-content-between p-2">
                <PeopleFill size={62}></PeopleFill>
                <div className="text-end me-2">
                  <h4>Users</h4>
                  <h1 className=" fw-light">
                    {usersCount ? usersCount : "Loading..."}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-1 col-lg-6">
              <div className="card flex-row align-items-center justify-content-between p-2">
                <Shop size={62}></Shop>
                <div className="text-end me-2">
                  <h4>Shops</h4>
                  <h1 className=" fw-light">
                    {shopsCount ? shopsCount : "Loading..."}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-1 col-lg-6">
              <div className="card flex-row align-items-center justify-content-between p-2">
                <PeopleFill size={62}></PeopleFill>
                <div className="text-end me-2">
                  <h4>Riders</h4>
                  <h1 className=" fw-light">
                    {ridersCount ? ridersCount : "Loading..."}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-1 col-lg-6">
              <div className="card flex-row align-items-center justify-content-between p-2">
                <BoxSeamFill size={62}></BoxSeamFill>
                <div className="text-end me-2">
                  <h4>Orders</h4>
                  <h1 className=" fw-light">
                    {ordersCount ? ordersCount : "Loading..."}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-1 col-lg-6">
              <div className="card flex-row align-items-center justify-content-between p-2">
                <Bicycle size={62}></Bicycle>
                <div className="text-end me-2">
                  <h4>Rides</h4>
                  <h1 className=" fw-light">
                    {ridesCount ? ridesCount : "Loading..."}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-1 col-lg-6">
              <div className="card flex-row align-items-center justify-content-between p-2">
                <StarFill size={62}></StarFill>
                <div className="text-end me-2">
                  <h4>Ratings</h4>
                  <h1 className=" fw-light">
                    {ratingsCount ? ratingsCount : "Loading..."}
                  </h1>
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
