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

import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosAPI } from "../AxiosAPI";

function Riders() {
  const [riders, setRiders] = useState([]);
  const [ridersUpdated, setRidersUpdated] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  const getRiders = () => {
    axios
      .get(`${axiosAPI}/riders/`)
      .then(function (response) {
        // handle success
        setRiders(response.data);
        setRidersUpdated(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  useEffect(() => {
    getRiders();
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
      .post(`${axiosAPI}/users/delete/${itemId}`)
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

  const View = (itemId) => {
    setModalShow(true);
    setSelectedItem(ridersUpdated.filter((item) => item["_id"] === itemId));
  };

  const Verify = (itemId) => {
    axios
      .post(`${axiosAPI}/riders/verify/${itemId}`)
      .then(function (response) {
        // handle success
        getRiders();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  const Reject = (itemId) => {
    axios
      .post(`${axiosAPI}/riders/reject/${itemId}`)
      .then(function (response) {
        // handle success
        getRiders();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  function handleSearchClick() {
    if (searchVal === "") {
      setRidersUpdated(riders);
      return;
    }
    const filterBySearch = riders.filter((item) => {
      if (item.cnic.toLowerCase().includes(searchVal.toLowerCase())) {
        return item;
      }
    });
    setRidersUpdated(filterBySearch);
  }

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
          <div className="d-flex gap-2 mb-3">
            <input
              className="d-flex flex-grow-1"
              placeholder="Search by CNIC"
              onChange={(e) => {
                setSearchVal(e.target.value);
              }}
              onKeyPress={(e) => {
                setSearchVal(e.target.value);
                if (e.key === "Enter") handleSearchClick();
              }}
            ></input>
            <Button onClick={handleSearchClick}>Search</Button>
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
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedItem[0]?.user.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <h6 className="mb-0">Address:</h6>
              {selectedItem[0]?.address}
            </Col>
            <Col>
              <h6 className="mb-0">Contact:</h6>
              +92 {selectedItem[0]?.user.phone}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">CNIC:</h6>
              {selectedItem[0]?.cnic}
            </Col>
            <Col>
              <h6 className="mb-0">Bike Name:</h6>
              {selectedItem[0]?.bikename}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">Bike Number:</h6>
              {selectedItem[0]?.bikenum}
            </Col>
            <Col>
              <h6 className="mb-0">Status:</h6>
              {selectedItem[0]?.status}
            </Col>
          </Row>
          <Row>
            <Col>
              <h6 className="mb-1 mt-2">User Profile:</h6>
              <Image src={selectedItem[0]?.img} rounded fluid />
            </Col>
            <Col>
              <h6 className="mb-1 mt-2">License:</h6>
              <Image src={selectedItem[0]?.licenseimg} rounded fluid />
            </Col>
          </Row>
          <h6 className="mt-2">CNIC Images:</h6>
          <Row>
            <Col>
              <Image src={selectedItem[0]?.cnicimgs[0]} rounded fluid />
            </Col>
            <Col>
              <Image src={selectedItem[0]?.cnicimgs[1]} rounded fluid />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Riders;
