import React from "react";
import "./LeftNav.css";
import {
  HouseFill,
  BoxSeamFill,
  PeopleFill,
  Bicycle,
  StarFill,
  Shop,
  ChevronRight,
} from "react-bootstrap-icons";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import "./style.css";
import Logo from "../Logo.png";

function LeftNav() {
  return (
    <div className="leftNav col-xl-2 col-lg-3 col-md-3 col-sm-4 p-0">
      <div
        style={{
          height: "60px",
          backgroundColor: "white",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h4 className="text-center m-0">Dashboard</h4>
      </div>
      <div className="text-white text-start p-4">
        <div className="d-flex align-items-center justify-content-center">
          <img className="w-75 mb-4" src={Logo}></img>
        </div>
        <Row>
          <Col className="p-1">
            <Nav variant="pills" className="flex-column gap-4">
              <Link to="/">
                <Nav.Link href="/" eventKey="home" className=" fs-5 fw-medium">
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <HouseFill size={25} className="me-3"></HouseFill>Home
                    </div>
                    <ChevronRight
                      size={20}
                      className="float-end"
                    ></ChevronRight>
                  </div>
                </Nav.Link>
              </Link>
              <Link to="/users">
                <Nav.Link
                  href="/users"
                  eventKey="users"
                  className=" fs-5 fw-medium"
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PeopleFill size={25} className="me-3"></PeopleFill>Users
                    </div>
                    <ChevronRight
                      size={20}
                      className="float-end"
                    ></ChevronRight>
                  </div>
                </Nav.Link>
              </Link>
              <Link to="/shops">
                <Nav.Link
                  href="/items"
                  eventKey="shops"
                  className=" fs-5 fw-medium"
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Shop size={25} className="me-3"></Shop>Shops
                    </div>
                    <ChevronRight
                      size={20}
                      className="float-end"
                    ></ChevronRight>
                  </div>
                </Nav.Link>
              </Link>
              <Link to="/riders">
                <Nav.Link
                  href="/items"
                  eventKey="riders"
                  className=" fs-5 fw-medium"
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PeopleFill size={25} className="me-3"></PeopleFill>Riders
                    </div>
                    <ChevronRight
                      size={20}
                      className="float-end"
                    ></ChevronRight>
                  </div>
                </Nav.Link>
              </Link>
              <Link to="/orders">
                <Nav.Link
                  href="/orders"
                  eventKey="ord"
                  className=" fs-5 fw-medium"
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BoxSeamFill size={25} className="me-3"></BoxSeamFill>
                      Orders
                    </div>
                    <ChevronRight
                      size={20}
                      className="float-end"
                    ></ChevronRight>
                  </div>
                </Nav.Link>
              </Link>
              <Link to="/rides">
                <Nav.Link
                  href="/add"
                  eventKey="rides"
                  className=" fs-5 fw-medium"
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Bicycle size={25} className="me-3"></Bicycle>Rides
                    </div>
                    <ChevronRight
                      size={20}
                      className="float-end"
                    ></ChevronRight>
                  </div>
                </Nav.Link>
              </Link>
              <Link to="/ratings">
                <Nav.Link
                  href="/categories"
                  eventKey="ratings"
                  className=" fs-5 fw-medium"
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <StarFill size={25} className="me-3"></StarFill>Ratings
                    </div>
                    <ChevronRight
                      size={20}
                      className="float-end"
                    ></ChevronRight>
                  </div>
                </Nav.Link>
              </Link>
            </Nav>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default LeftNav;
