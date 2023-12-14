import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import { EyeFill, TrashFill } from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";

function Rides() {
  const [rides, setRides] = useState([]);
  const [ridesUpdated, setRidesUpdated] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/rides/`)
      .then(function (response) {
        // handle success
        setRides(response.data);
        setRidesUpdated(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const onFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") setRidesUpdated(rides);
    else if (filter === "Customer")
      setRidesUpdated(rides.filter((item) => item.bkdBy == "Customer"));
    else if (filter === "Shop")
      setRidesUpdated(rides.filter((item) => item.bkdBy == "Shop"));
    else if (filter === "Card")
      setRidesUpdated(rides.filter((item) => item.pMethod == "Card"));
    else if (filter === "COD")
      setRidesUpdated(rides.filter((item) => item.pMethod == "Cash"));
  };

  const Delete = (itemId) => {
    axios
      .post(`http://localhost:8080/rides/delete/${itemId}`)
      .then(function (response) {
        // handle success
        setRidesUpdated(ridesUpdated.filter((item) => item["_id"] !== itemId));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const View = (itemId) => {};

  return (
    <div className="col-lg-10 p-4">
      <div className="bg-white rounded-4 p-3 rightSec">
        <div className="container overflow-y-scroll h-100">
          <h2>Rides</h2>
          <div className="d-flex my-3">
            <ButtonGroup className="flex-fill" aria-label="Filters">
              <Button
                onClick={() => onFilter("Customer")}
                variant={filter == "Customer" ? "primary" : "secondary"}
              >
                Customer
              </Button>
              <Button
                onClick={() => onFilter("Shop")}
                variant={filter == "Shop" ? "primary" : "secondary"}
              >
                Shop
              </Button>
              <Button
                onClick={() => onFilter("Card")}
                variant={filter == "Card" ? "primary" : "secondary"}
              >
                Card Payment
              </Button>
              <Button
                onClick={() => onFilter("COD")}
                variant={filter == "COD" ? "primary" : "secondary"}
              >
                COD
              </Button>
              <Button
                onClick={() => onFilter("All")}
                variant={filter == "All" ? "primary" : "secondary"}
              >
                All
              </Button>
            </ButtonGroup>
          </div>
          <div>
            {ridesUpdated.length > 0 || rides.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Ride #</th>
                      <th>Pickup</th>
                      <th>Drop Off</th>
                      <th>Pay Method</th>
                      <th>Fare</th>
                      <th>Booked By</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ridesUpdated.map((item, index) => (
                      <>
                        <tr className="">
                          <td>{index + 1}</td>
                          <td>{item._id}</td>
                          <td>{item.pLoc}</td>
                          <td>{item.dLoc}</td>
                          <td>{item.pMethod}</td>
                          <td>{item.fare}</td>
                          <td>{item.bkdBy}</td>
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

export default Rides;
