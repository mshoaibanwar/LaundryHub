import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./style.css";
import {
  BoxSeamFill,
  PeopleFill,
  Shop,
  Bicycle,
  StarFill,
} from "react-bootstrap-icons";
import HomeCard from "./HomeCard";
import Chart from "react-apexcharts";

function Home() {
  const [ordersCount, setOrdersCount] = useState(null);
  const [ridersCount, setRidersCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [shopsCount, setShopsCount] = useState(null);
  const [ridesCount, setRidesCount] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/shops/count/`)
      .then(function (response) {
        // handle success
        setShopsCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/ratings/count/`)
      .then(function (response) {
        // handle success
        setRatingsCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/users/count/`)
      .then(function (response) {
        // handle success
        setUsersCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/orders/count/`)
      .then(function (response) {
        // handle success
        setOrdersCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/rides/count/`)
      .then(function (response) {
        // handle success
        setRidesCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    axios
      .get(`http://localhost:8080/riders/count/`)
      .then(function (response) {
        // handle success
        setRidersCount(response.data["Count"]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const Data = [
    {
      id: "0",
      name: "Users",
      count: usersCount,
      img: <PeopleFill size={60} fill="#0E1446" />,
    },
    {
      id: "1",
      name: "Shops",
      count: shopsCount,
      img: <Shop size={60} fill="red" />,
    },
    {
      id: "2",
      name: "Riders",
      count: ridersCount,
      img: <PeopleFill size={60} fill="orange" />,
    },
    {
      id: "3",
      name: "Orders",
      count: ordersCount,
      img: <BoxSeamFill size={60} fill="#38304d" />,
    },
    {
      id: "4",
      name: "Rides",
      count: ridesCount,
      img: <Bicycle size={60} fill="green" />,
    },
    {
      id: "5",
      name: "Ratings",
      count: ratingsCount,
      img: (
        <StarFill size={60} fill="#FFD130" stroke="black" strokeWidth="0.5px" />
      ),
    },
  ];

  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "March",
        "April",
        "May",
        "June",
        "july",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  };
  const series = [
    {
      name: "Users",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ];

  return (
    <div className="p-4 rightSec">
      <div className="rounded-4">
        <div className="container-fluid overflow-y-scroll h-100">
          {/* <h2 className="mb-4">Home</h2> */}
          <div className="row m-0">
            {Data.map((item) => {
              return (
                <HomeCard
                  key={item.id}
                  name={item.name}
                  count={item.count}
                  img={item.img}
                />
              );
            })}
          </div>
        </div>
        <Chart options={options} series={series} type="line" width="500" />
      </div>
    </div>
  );
}

export default Home;
