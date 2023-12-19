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

function Shops() {
  const [shops, setShops] = useState([]);
  const [shopsUpdated, setShopsUpdated] = useState([]);
  const [filter, setFilter] = useState("All");

  const getShops = () => {
    axios
      .get(`http://localhost:8080/shops/`)
      .then(function (response) {
        // handle success
        setShops(response.data);
        setShopsUpdated(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  useEffect(() => {
    getShops();
  }, []);

  const onFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") setShopsUpdated(shops);
    else if (filter === "Verified")
      setShopsUpdated(shops.filter((item) => item.status == "Verified"));
    else if (filter === "NotVerified")
      setShopsUpdated(shops.filter((item) => item.status == "Under Review"));
    else if (filter === "Rejected")
      setShopsUpdated(shops.filter((item) => item.status == "Rejected"));
  };

  const Delete = (itemId) => {
    axios
      .post(`http://localhost:8080/shops/delete/${itemId}`)
      .then(function (response) {
        // handle success
        setShopsUpdated(shopsUpdated.filter((item) => item["_id"] !== itemId));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const View = (itemId) => {};

  const Verify = (itemId) => {
    axios
      .post(`http://localhost:8080/shops/verify/${itemId}`)
      .then(function (response) {
        // handle success
        getShops();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  const Reject = (itemId) => {
    axios
      .post(`http://localhost:8080/shops/reject/${itemId}`)
      .then(function (response) {
        // handle success
        getShops();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  return (
    <div className="rightSec p-3">
      <div>
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
            {shopsUpdated.length > 0 || shops.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Address</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopsUpdated.map((item, index) => (
                      <>
                        <tr className="">
                          <td>{index + 1}</td>
                          <td>{item.title}</td>
                          <td>{item.address}</td>
                          <td>+92 {item.contact}</td>
                          <td>{item.status}</td>
                          <td className=" d-flex gap-2 align-items-center justify-content-center">
                            <button
                              onClick={() => Delete(item["_id"])}
                              className="btn btn-danger"
                            >
                              <TrashFill></TrashFill>
                            </button>
                            {item.status != "Rejected" ? (
                              <button
                                onClick={() => Reject(item["_id"])}
                                className="btn btn-warning"
                              >
                                <SlashCircleFill></SlashCircleFill>
                              </button>
                            ) : null}
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
export default Shops;
