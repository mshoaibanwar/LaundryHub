import React from "react";
import { PersonCircle, PersonFillGear } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  let name = location.pathname.split("/")[1].toUpperCase();
  if (name === "") name = "HOME";
  return (
    <div
      className="Header"
      style={{
        // borderBottom: "1px solid gray",
        height: "60px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        zIndex: "1",
        position: "relative",
        alignItems: "center",
        display: "flex",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 30px",
          width: "100%",
        }}
      >
        <h5 className=" m-0 ms-4">{name}</h5>
        <div>
          <PersonCircle size={30} className=""></PersonCircle>
        </div>
      </div>
    </div>
  );
};

export default Header;
