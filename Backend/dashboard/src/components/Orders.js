import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./style.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import { EyeFill, TrashFill } from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";

function Orders() {
  const [orders, setOrders] = useState([]);
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

  const Delete = (itemId) => {
    axios
      .post(`http://localhost:8080/rides/delete/${itemId}`)
      .then(function (response) {
        // handle success
        setOrders(orders.filter((item) => item["_id"] !== itemId));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const View = (itemId) => {};

  return (
    <div className="rightSec p-3">
      <div className=" ">
        <div className="container overflow-y-scroll h-100">
          <div className="d-flex my-3">
            <ButtonGroup className="flex-fill" aria-label="Filters">
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
          </div>
          <div>
            {orders.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Order #</th>
                      <th>Address</th>
                      <th>Name</th>
                      <th>Items</th>
                      <th>Delivery Date</th>
                      <th>Delivery Time</th>
                      <th>Pay Method</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((item, index) => (
                      <>
                        <tr className="">
                          <td>{index + 1}</td>
                          <td>{item._id}</td>
                          <td>{item.address.add}</td>
                          <td>{item.address.name}</td>
                          <td>{item.items.length}</td>
                          <td>{item.delivery.date}</td>
                          <td>{item.delivery.time}</td>
                          <td>{item.pMethod}</td>
                          <td>Rs. {item.tprice}</td>
                          <td>{item.status}</td>
                          <td className=" d-flex gap-2 align-items-center justify-content-center">
                            <button
                              onClick={() => Delete(item["_id"])}
                              className="btn btn-danger"
                            >
                              <TrashFill></TrashFill>
                            </button>
                            <button
                              onClick={() => View(item["_id"])}
                              className="btn btn-primary"
                            >
                              <EyeFill></EyeFill>
                            </button>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <Spinner
                className="position-absolute top-50 start-70 translate-middle"
                animation="grow"
                variant="info"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
