import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import {
  EyeFill,
  PatchCheckFill,
  SlashCircleFill,
  TrashFill,
} from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";

function Riders() {
  const [riders, setRiders] = useState([]);
  const [ridersUpdated, setRidersUpdated] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/riders/`)
      .then(function (response) {
        // handle success
        setRiders(response.data);
        setRidersUpdated(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const onFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") setRidersUpdated(riders);
    else if (filter === "Verified")
      setRidersUpdated(riders.filter((item) => item.status == "Verified"));
    else if (filter === "NotVerified")
      setRidersUpdated(riders.filter((item) => item.status == "Unverified"));
    else if (filter === "Rejected")
      setRidersUpdated(riders.filter((item) => item.status == "Rejected"));
  };

  const Delete = (itemId) => {
    axios
      .post(`http://localhost:8080/users/delete/${itemId}`)
      .then(function (response) {
        // handle success
        setRidersUpdated(
          ridersUpdated.filter((item) => item["_id"] !== itemId)
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const View = (itemId) => {};

  const Verify = (itemId) => {};
  const Reject = (itemId) => {};

  return (
    <div className="rightSec p-3">
      <div className=" ">
        <div className="container overflow-y-scroll h-100">
          <div className="d-flex my-3">
            <ButtonGroup className="flex-fill" aria-label="Filters">
              <Button
                onClick={() => onFilter("Verified")}
                variant={filter == "Verified" ? "primary" : "secondary"}
              >
                Verified
              </Button>
              <Button
                onClick={() => onFilter("NotVerified")}
                variant={filter == "NotVerified" ? "primary" : "secondary"}
              >
                Not Verified
              </Button>
              <Button
                onClick={() => onFilter("Rejected")}
                variant={filter == "Rejected" ? "primary" : "secondary"}
              >
                Rejected
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
            {ridersUpdated.length > 0 || riders.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Contact</th>
                      <th>CNIC</th>
                      <th>Bike Name</th>
                      <th>Bike #</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ridersUpdated.map((item, index) => (
                      <>
                        <tr className="">
                          <td>{index + 1}</td>
                          <td>{item.user.name}</td>
                          <td>{item.address}</td>
                          <td>{item.user.phone}</td>
                          <td>{item.cnic}</td>
                          <td>{item.bikename}</td>
                          <td>{item.bikenum}</td>
                          <td>{item.status}</td>
                          <td className=" d-flex gap-2 align-items-center justify-content-center">
                            <button
                              onClick={() => Delete(item["_id"])}
                              className="btn btn-danger"
                            >
                              <TrashFill></TrashFill>
                            </button>
                            <button
                              onClick={() => Reject(item["_id"])}
                              className="btn btn-warning"
                            >
                              <SlashCircleFill></SlashCircleFill>
                            </button>
                            {item.status != "Verified" ? (
                              <button
                                onClick={() => Verify(item["_id"])}
                                className="btn btn-success"
                              >
                                <PatchCheckFill></PatchCheckFill>
                              </button>
                            ) : null}
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
                className=" position-absolute top-50 start-70 translate-middle"
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
export default Riders;
