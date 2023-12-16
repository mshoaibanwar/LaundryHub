import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import { EyeFill, TrashFill } from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";

function Ratings() {
  const [ratings, setRatings] = useState([]);
  const [ratingsUpdated, setRatingsUpdated] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/ratings/`)
      .then(function (response) {
        // handle success
        setRatings(response.data);
        setRatingsUpdated(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const onFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") setRatingsUpdated(ratings);
    else setRatingsUpdated(ratings.filter((item) => item.rating == filter));
  };

  const Delete = (itemId) => {
    axios
      .post(`http://localhost:8080/ratings/delete/${itemId}`)
      .then(function (response) {
        // handle success
        setRatingsUpdated(
          ratingsUpdated.filter((item) => item["_id"] !== itemId)
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const View = (itemId) => {};

  return (
    <div className="rightSec p-3">
      <div className="">
        <div className="container overflow-y-scroll h-100">
          <div className="d-flex my-3">
            <ButtonGroup className="flex-fill" aria-label="Filters">
              <Button
                onClick={() => onFilter("0.5")}
                variant={filter == "0.5" ? "primary" : "secondary"}
              >
                0.5
              </Button>
              <Button
                onClick={() => onFilter("1")}
                variant={filter == "1" ? "primary" : "secondary"}
              >
                1
              </Button>
              <Button
                onClick={() => onFilter("1.5")}
                variant={filter == "1.5" ? "primary" : "secondary"}
              >
                1.5
              </Button>
              <Button
                onClick={() => onFilter("2")}
                variant={filter == "2" ? "primary" : "secondary"}
              >
                2
              </Button>
              <Button
                onClick={() => onFilter("2.5")}
                variant={filter == "2.5" ? "primary" : "secondary"}
              >
                2.5
              </Button>
              <Button
                onClick={() => onFilter("3")}
                variant={filter == "3" ? "primary" : "secondary"}
              >
                3
              </Button>
              <Button
                onClick={() => onFilter("3.5")}
                variant={filter == "3.5" ? "primary" : "secondary"}
              >
                3.5
              </Button>
              <Button
                onClick={() => onFilter("4")}
                variant={filter == "4" ? "primary" : "secondary"}
              >
                4
              </Button>
              <Button
                onClick={() => onFilter("4.5")}
                variant={filter == "4.5" ? "primary" : "secondary"}
              >
                4.5
              </Button>
              <Button
                onClick={() => onFilter("5")}
                variant={filter == "5" ? "primary" : "secondary"}
              >
                5
              </Button>
              <Button
                onClick={() => onFilter("All")}
                variant={filter == "All" ? "primary" : "secondary"}
              >
                All
              </Button>
            </ButtonGroup>
          </div>
          <div>
            {ratingsUpdated.length > 0 || ratings.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Rating ID</th>
                      <th>User Name</th>
                      <th>Review</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingsUpdated.map((item, index) => (
                      <>
                        <tr className="">
                          <td>{index + 1}</td>
                          <td>{item._id}</td>
                          <td>{item.uname}</td>
                          <td>{item.review}</td>
                          <td>{item.rating}</td>
                          <td>{item.feedback}</td>
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
    </div>
  );
}

export default Ratings;
