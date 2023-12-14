import React, { useState } from "react";
import OrderCard from "./OrderCard";
import { useEffect } from "react";
import axios from "axios";
import "./style.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";

function Orders() {
  const [orders, setOrders] = useState();
  const [updated, setUpdated] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/orders/${filter}`)
      .then(function (response) {
        // handle success
        setOrders(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, [updated, filter]);

  return (
    <div className="col-lg-10 p-4">
      <div className="bg-white rounded-4 p-3 rightSec">
        <div className="container overflow-y-scroll h-100">
          <h2>Orders</h2>
          <ButtonGroup className="flex-fill d-flex my-3" aria-label="Filters">
            <Button
              onClick={() => setFilter("Pending")}
              variant={filter == "Pending" ? "primary" : "secondary"}
            >
              Pending
            </Button>
            <Button
              onClick={() => setFilter("Confirmed")}
              variant={filter == "Confirmed" ? "primary" : "secondary"}
            >
              Confirmed
            </Button>
            <Button
              onClick={() => setFilter("Received")}
              variant={filter == "Received" ? "primary" : "secondary"}
            >
              Received
            </Button>
            <Button
              onClick={() => setFilter("Ready")}
              variant={filter == "Ready" ? "primary" : "secondary"}
            >
              Ready
            </Button>
            <Button
              onClick={() => setFilter("Delivered")}
              variant={filter == "Delivered" ? "primary" : "secondary"}
            >
              Delivered
            </Button>
            <Button
              onClick={() => setFilter("")}
              variant={filter == "" ? "primary" : "secondary"}
            >
              All
            </Button>
          </ButtonGroup>
          {/* <div className="container d-flex justify-content-between align-items-center gap-2 my-3">
            <h3 className="menuhead my-auto">Filters</h3>
            <div className="menupills d-flex justify-content-evenly w-75">
              <button
                onClick={() => setFilter("Pending")}
                className="btn btn-danger shadow-lg p-2 rounded-5 border border-black fw-bold"
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("Confirmed")}
                className="btn btn-secondary shadow-lg p-2 rounded-5 border border-black fw-bold"
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilter("Out for Delivery")}
                className="btn btn-primary shadow-lg p-2 rounded-5 border border-black fw-bold"
              >
                Delivering
              </button>
              <button
                onClick={() => setFilter("Delivered")}
                className="btn btn-success shadow-lg p-2 rounded-5 border border-black fw-bold"
              >
                Delivered
              </button>
            </div>
            <button
              onClick={() => setFilter("")}
              className="btn btn-dark shadow-lg p-2 px-3 rounded-5 border border-black fw-bold"
            >
              All
            </button>
          </div> */}
          {orders ? (
            <div className="container justify-content-between m-0 mb-5 row">
              {orders.map((item, index) => (
                <OrderCard item={item} key={index} setU={setUpdated} />
              ))}
            </div>
          ) : (
            <Spinner
              className=" position-absolute top-50 start-70 translate-middle"
              animation="grow"
              variant="info"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
