import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import { EyeFill, TrashFill } from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosAPI } from "../AxiosAPI";

function Rides() {
  const [rides, setRides] = useState([]);
  const [ridesUpdated, setRidesUpdated] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    axios
      .get(`${axiosAPI}/rides/`)
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
      .post(`${axiosAPI}/rides/delete/${itemId}`)
      .then(function (response) {
        // handle success
        setRidesUpdated(ridesUpdated.filter((item) => item["_id"] !== itemId));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const View = (itemId) => {
    setModalShow(true);
    setSelectedItem(ridesUpdated.filter((item) => item["_id"] === itemId));
  };

  function handleSearchClick() {
    if (searchVal === "") {
      setRidesUpdated(rides);
      return;
    }
    const filterBySearch = rides.filter((item) => {
      if (item._id.toLowerCase().includes(searchVal.toLowerCase())) {
        return item;
      }
    });
    setRidesUpdated(filterBySearch);
  }

  return (
    <div className="rightSec p-3">
      <div className=" ">
        <div className="container overflow-y-scroll h-100">
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
          <div className="d-flex gap-2 mb-3">
            <input
              className="d-flex flex-grow-1"
              placeholder="Search by Ride #"
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
                          <td>{item.fare * 2}</td>
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
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedItem[0]?._id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <h6 className="mb-0">Booked By:</h6>
              {selectedItem[0]?.bkdBy}
            </Col>
            <Col>
              <h6 className="mb-0">Pickup Location:</h6>
              {selectedItem[0]?.pLoc}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">DropOff Location:</h6>
              {selectedItem[0]?.dLoc}
            </Col>
            <Col>
              <h6 className="mb-0">Payment Method:</h6>
              {selectedItem[0]?.pMethod}
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">Fare:</h6>
              Rs. {selectedItem[0]?.fare * 2}
            </Col>
            <Col>
              <h6 className="mb-0">Ride Status:</h6>
              {selectedItem[0]?.status}
            </Col>
          </Row>
          <h6 className="mb-1 mt-2">Order Items:</h6>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>id</th>
                <th>Name</th>
                <th>Service</th>
                <th>Images</th>
              </tr>
            </thead>
            <tbody>
              {selectedItem[0]?.oItems?.map((item, index) => (
                <tr className="">
                  <td>{item.id}</td>
                  <td>{item.item}</td>
                  <td>{item.serType}</td>
                  <td>
                    {item?.images?.map((img) => (
                      <Image src={img} rounded fluid />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Rides;
