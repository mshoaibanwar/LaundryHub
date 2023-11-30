import React from "react";
import './LeftNav.css'
import {PersonSquare, HouseFill, PlusSquareFill, FilePost, BookmarkFill, BoxSeamFill, PeopleFill, CircleFill} from "react-bootstrap-icons"
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import './style.css'

function LeftNav()
{
    return(
            <div className="col-lg-3 text-white text-start p-5">
                <PersonSquare size={70}></PersonSquare>
                <h3 className="my-3 mb-5">M Shoaib Anwar</h3>
                    <Row>
                        <Col className="p-1">
                        <Nav variant="pills" className="flex-column gap-4">
                            <Link to="/">
                                <Nav.Link href="/" eventKey="home" className=" fs-5 fw-medium"> <HouseFill size={25} className="me-3"></HouseFill>Home</Nav.Link>
                            </Link>
                            <Link to="/items">
                                <Nav.Link href="/items" eventKey="pizzas" className=" fs-5 fw-medium"> <FilePost size={25} className="me-3"></FilePost>Items</Nav.Link>
                            </Link>
                            <Link to="/add">
                                <Nav.Link href="/add" eventKey="add" className=" fs-5 fw-medium"> <PlusSquareFill size={25} className="me-3"></PlusSquareFill>Add Item</Nav.Link>
                            </Link>
                            <Link to="/categories">
                                <Nav.Link href="/categories" eventKey="cat" className=" fs-5 fw-medium"> <BookmarkFill size={25} className="me-3"></BookmarkFill>Categories</Nav.Link>
                            </Link>
                            <Link to="/sauces">
                                <Nav.Link href="/sauces" eventKey="sauce" className=" fs-5 fw-medium"> <CircleFill size={25} className="me-3"></CircleFill>Sauces</Nav.Link>
                            </Link>
                            <Link to="/veggies">
                                <Nav.Link href="/veggies" eventKey="veg" className=" fs-5 fw-medium"> <CircleFill size={25} className="me-3"></CircleFill>Veggies</Nav.Link>
                            </Link>
                            <Link to="/orders">
                                <Nav.Link href="/orders" eventKey="ord" className=" fs-5 fw-medium"> <BoxSeamFill size={25} className="me-3"></BoxSeamFill>Orders</Nav.Link>
                            </Link>
                            <Link to="/users">
                                <Nav.Link href="/users" eventKey="users" className=" fs-5 fw-medium"> <PeopleFill size={25} className="me-3"></PeopleFill>Users</Nav.Link>
                            </Link>
                        </Nav>
                        </Col>
                    </Row>  
            </div>
    );
}
export default LeftNav