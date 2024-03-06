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

function Shops() {
  const [shops, setShops] = useState([]);
  const [shopsUpdated, setShopsUpdated] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [searchVal, setSearchVal] = useState("");

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

  const View = (itemId) => {
    setModalShow(true);
    setSelectedItem(shopsUpdated.filter((item) => item["_id"] === itemId));
  };

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

  function handleSearchClick() {
    if (searchVal === "") {
      setShopsUpdated(shops);
      return;
    }
    const filterBySearch = shops.filter((item) => {
      if (item.title.toLowerCase().includes(searchVal.toLowerCase())) {
        return item;
      }
    });
    setShopsUpdated(filterBySearch);
  }

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
          <div className="d-flex gap-2 mb-3">
            <input
              className="d-flex flex-grow-1"
              placeholder="Search by Title"
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
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedItem[0]?.title}
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
              {selectedItem[0]?.contact}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">CNIC:</h6>
              {selectedItem[0]?.cnic}
            </Col>
            <Col>
              <h6 className="mb-0">Minimum Order Price:</h6>
              Rs. {selectedItem[0]?.minOrderPrice}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h6 className="mb-0">Minimum Delivery Time:</h6>
              {selectedItem[0]?.minDelTime} Days
            </Col>
            <Col>
              <h6 className="mb-0">Status:</h6>
              {selectedItem[0]?.status}
            </Col>
          </Row>
          <h6 className="mb-1 mt-2">Shop Timings:</h6>
          <Table striped bordered hover>
            <thead>
              <tr>
                {selectedItem[0]?.timing?.map((item) => (
                  <th>{item.day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="">
                {selectedItem[0]?.timing?.map((item) => (
                  <td>
                    {item.status == "on"
                      ? item.time.start + " - " + item.time.end
                      : "Closed"}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>

          {/* <div style={{ height: "30vh", width: "100%" }}>
            <GoogleMapReact
              defaultCenter={{
                lat: selectedItem[0]?.lati,
                lng: selectedItem[0]?.longi,
              }}
              // defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              <AnyReactComponent
                lat={selectedItem[0]?.lati}
                lng={selectedItem[0]?.longi}
                text="My Marker"
              />
            </GoogleMapReact>
          </div> */}

          <h6 className="mb-2 mt-2">CNIC Images:</h6>
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
export default Shops;
