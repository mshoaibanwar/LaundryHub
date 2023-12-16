import React from "react";

const HomeCard = (props) => {
  return (
    <div className="p-1 col-xl-3 col-lg-4 col-md-4 col-sm-6 align-self-start">
      <div className="card flex-row align-items-center justify-content-between p-3">
        {props.img}
        <div className="text-end me-2">
          <h4 className="my-2">{props.name}</h4>
          <h1 className=" my-2 fw-light">
            {props?.count ? props?.count : "Loading..."}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
