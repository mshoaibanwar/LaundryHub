import React, { useState } from "react";
import { useEffect } from "react";
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

function Orders() {
  const [orders, setOrders] = useState([]);
  const [ordersUpdated, setOrdersUpdated] = useState([]);
  const [updated, setUpdated] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/orders/`)
      .then(function (response) {
        // handle success
        setOrders(response.data);
        setOrdersUpdated(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, [updated]);

  const onFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") setOrdersUpdated(orders);
    else if (filter === "Pending")
      setOrdersUpdated(orders.filter((item) => item.status == "Pending"));
    else if (filter === "Confirmed")
      setOrdersUpdated(orders.filter((item) => item.status == "Confirmed"));
    else if (filter === "Received")
      setOrdersUpdated(orders.filter((item) => item.status == "Received"));
    else if (filter === "Ready")
      setOrdersUpdated(orders.filter((item) => item.status == "Ready"));
    else if (filter === "Delivered")
      setOrdersUpdated(orders.filter((item) => item.status == "Delivered"));
  };

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

  const View = (itemId) => {
    setModalShow(true);
    setSelectedItem(orders.filter((item) => item["_id"] === itemId));
  };

  function handleSearchClick() {
    if (searchVal === "") {
      setOrdersUpdated(orders);
      return;
    }
    const filterBySearch = orders.filter((item) => {
      if (item._id.toLowerCase().includes(searchVal.toLowerCase())) {
        return item;
      }
    });
    setOrdersUpdated(filterBySearch);
  }

  return (
    <div className="rightSec p-3">
      <div className=" ">
        <div className="container overflow-y-scroll h-100">
          <div className="d-flex my-3">
            <ButtonGroup className="flex-fill" aria-label="Filters">
              <Button
                onClick={() => onFilter("Pending")}
                variant={filter == "Pending" ? "primary" : "secondary"}
              >
                Pending
              </Button>
              <Button
                onClick={() => onFilter("Confirmed")}
                variant={filter == "Confirmed" ? "primary" : "secondary"}
              >
                Confirmed
              </Button>
              <Button
                onClick={() => onFilter("Received")}
                variant={filter == "Received" ? "primary" : "secondary"}
              >
                Received
              </Button>
              <Button
                onClick={() => onFilter("Ready")}
                variant={filter == "Ready" ? "primary" : "secondary"}
              >
                Ready
              </Button>
              <Button
                onClick={() => onFilter("Delivered")}
                variant={filter == "Delivered" ? "primary" : "secondary"}
              >
                Delivered
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
              placeholder="Search by Order #"
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
                    {ordersUpdated.map((item, index) => (
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
              <h6 className="mb-0">Name:</h6>
              {selectedItem[0]?.address.name}
            </Col>
            <Col>
              <h6 className="mb-0">Contact:</h6>
              +92 {selectedItem[0]?.address.num}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">Address:</h6>
              {selectedItem[0]?.address.add}
            </Col>
            <Col>
              <h6 className="mb-0"># of Items:</h6>
              {selectedItem[0]?.items.length}
            </Col>
          </Row>
          <Row className="mt-2">
            {/* <Col>
              <h6 className="mb-0">Placed On:</h6>
              {selectedItem[0]?.createdAt.split("T")[0]} at{" "}
              {selectedItem[0]?.createdAt.split("T")[1].split(".")[0]}
            </Col> */}
            <Col>
              <h6 className="mb-0">Collection On:</h6>
              {selectedItem[0]?.orderDate} at {selectedItem[0]?.ocollection}
            </Col>
            <Col>
              <h6 className="mb-0">Delivery On:</h6>
              {selectedItem[0]?.delivery.date} at{" "}
              {selectedItem[0]?.delivery.time}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">Amount:</h6>
              Rs. {selectedItem[0]?.tprice}
            </Col>
            <Col>
              <h6 className="mb-0">Payment Method:</h6>
              {selectedItem[0]?.pMethod}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">Rider Booked:</h6>
              {selectedItem[0]?.ride ? "Yes" : "No"}
            </Col>
            <Col>
              <h6 className="mb-0">Delivery Fee:</h6>
              Rs. {selectedItem[0]?.delFee * 2}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">Order Status:</h6>
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
                <th>Price</th>
                <th>Images</th>
              </tr>
            </thead>
            <tbody>
              {selectedItem[0]?.items?.map((item, index) => (
                <tr className="">
                  <td>{item.id}</td>
                  <td>{item.item}</td>
                  <td>{item.serType}</td>
                  <td>{selectedItem[0]?.prices[index]}</td>
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

export default Orders;
