import React from "react";
import "./LeftNav.css";
import {
  PersonSquare,
  HouseFill,
  PlusSquareFill,
  FilePost,
  BookmarkFill,
  BoxSeamFill,
  PeopleFill,
  CircleFill,
  Bicycle,
  StarFill,
  Shop,
} from "react-bootstrap-icons";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import "./style.css";
import Logo from "../Logo.png";

function LeftNav() {
  return (
    <div className="col-lg-2 text-white text-start p-4 pe-0">
      <div className="d-flex align-items-center justify-content-center">
        <img className=" ms-2 w-75 mb-5" src={Logo}></img>
      </div>
      {/* <h3 className="my-3 mb-5">LaundryHub</h3> */}
      <Row>
        <Col className="p-1">
          <Nav variant="pills" className="flex-column gap-4">
            <Link to="/">
              <Nav.Link href="/" eventKey="home" className=" fs-5 fw-medium">
                {" "}
                <HouseFill size={25} className="me-3"></HouseFill>Home
              </Nav.Link>
            </Link>
            <Link to="/users">
              <Nav.Link
                href="/users"
                eventKey="users"
                className=" fs-5 fw-medium"
              >
                {" "}
                <PeopleFill size={25} className="me-3"></PeopleFill>Users
              </Nav.Link>
            </Link>
            <Link to="/shops">
              <Nav.Link
                href="/items"
                eventKey="shops"
                className=" fs-5 fw-medium"
              >
                {" "}
                <Shop size={25} className="me-3"></Shop>Shops
              </Nav.Link>
            </Link>
            <Link to="/riders">
              <Nav.Link
                href="/items"
                eventKey="riders"
                className=" fs-5 fw-medium"
              >
                {" "}
                <PeopleFill size={25} className="me-3"></PeopleFill>Riders
              </Nav.Link>
            </Link>
            <Link to="/orders">
              <Nav.Link
                href="/orders"
                eventKey="ord"
                className=" fs-5 fw-medium"
              >
                {" "}
                <BoxSeamFill size={25} className="me-3"></BoxSeamFill>Orders
              </Nav.Link>
            </Link>
            <Link to="/rides">
              <Nav.Link
                href="/add"
                eventKey="rides"
                className=" fs-5 fw-medium"
              >
                {" "}
                <Bicycle size={25} className="me-3"></Bicycle>Rides
              </Nav.Link>
            </Link>
            <Link to="/ratings">
              <Nav.Link
                href="/categories"
                eventKey="ratings"
                className=" fs-5 fw-medium"
              >
                {" "}
                <StarFill size={25} className="me-3"></StarFill>Ratings
              </Nav.Link>
            </Link>
          </Nav>
        </Col>
      </Row>
    </div>
  );
}
export default LeftNav;
