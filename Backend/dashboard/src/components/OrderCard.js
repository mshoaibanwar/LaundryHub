import React, { useState, useEffect } from "react";
import OrderItem from "./OrderItem";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import { axiosAPI } from "../AxiosAPI";

function OrderCard(props) {
  const pitem = props.item;
  const [status, setStatus] = useState();
  const [items, setItems] = useState(pitem);

  function handleChange() {
    axios
      .post(`${axiosAPI}/orders/update/${items["_id"]}`, { status: status })
      .then(function (response) {
        // handle success
        console.log(response.data);
        props.setU("123");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }
  return (
    <div className="container p-1 col-xxl-6 col-xl-6 col-md-6 col-sm-12 flex-nowrap m-0">
      <div className="shadow-lg p-3 rounded rounded-4 h-100">
        <div>
          <h5>Order ID: {items["_id"]}</h5>
        </div>
        {items["items"].map((item, key) => (
          <OrderItem item={item} price={items["prices"][key]} sc={true} />
        ))}
        <div className="p-2">
          <div className="d-flex justify-content-between">
            <h5>Total Amount: </h5>
            <h5 className="fw-normal">Rs. {items["tprice"]}</h5>
          </div>
          <div className="d-flex justify-content-between">
            <h5>Payment Method: </h5>
            <h5 className="fw-normal">{items["pMethod"]}</h5>
          </div>
          <div className="d-flex justify-content-between">
            <h5>Ordered On: </h5>
            <h5 className="fw-normal">{items["createdAt"]}</h5>
          </div>
          <div className="d-flex justify-content-between">
            <h5>Order Status: </h5>
            <h5 className="fw-normal">{items["status"]}</h5>
          </div>
        </div>
        <div>
          <Accordion
            defaultActiveKey="1"
            className="d-flex flex-column gap-3 mb-2"
          >
            <Accordion.Item
              eventKey="0"
              className="border rounded overflow-hidden"
            >
              <Accordion.Header>Delivery Details</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex justify-content-between">
                  <h5>Name: </h5>
                  <h5 className="fw-normal">{items.address["name"]}</h5>
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Contact: </h5>
                  <h5 className="fw-normal">{items.address["num"]}</h5>
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Address: </h5>
                  <h5 className="fw-normal">{items.address["add"]}</h5>
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Time: </h5>
                  <h5 className="fw-normal">{items.delivery["time"]}</h5>
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Date: </h5>
                  <h5 className="fw-normal">{items.delivery["date"]}</h5>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div>
          <h5>Change Status:</h5>
          <Form.Select
            aria-label="Default select example"
            name="statusSelector"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Open this select menu</option>
            <option name="statusSelector" value="Pending">
              Pending
            </option>
            <option name="statusSelector" value="Confirmed">
              Confirmed
            </option>
            <option name="statusSelector" value="Out for Delivery">
              Out for Delivery
            </option>
            <option name="statusSelector" value="Delivered">
              Delivered
            </option>
          </Form.Select>
        </div>
        <button onClick={handleChange} className="btn btn-success mt-2">
          Update
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
