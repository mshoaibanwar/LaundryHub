import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./style.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { axiosAPI } from "../AxiosAPI";

function Users() {
  const [users, setUsers] = useState([]);
  const [usersUpdated, setUsersUpdated] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    axios
      .get(`${axiosAPI}/users/`)
      .then(function (response) {
        // handle success
        setUsers(response.data);
        setUsersUpdated(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const onFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") setUsersUpdated(users);
    else if (filter === "Verified")
      setUsersUpdated(users.filter((item) => item.confirmed == true));
    else if (filter === "NotVerified")
      setUsersUpdated(users.filter((item) => item.confirmed == false));
  };

  const Delete = (itemId) => {
    axios
      .post(`${axiosAPI}/users/delete/${itemId}`)
      .then(function (response) {
        // handle success
        setUsersUpdated(usersUpdated.filter((item) => item["_id"] !== itemId));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  function handleSearchClick() {
    if (searchVal === "") {
      setUsersUpdated(users);
      return;
    }
    const filterBySearch = users.filter((item) => {
      if (item.email.toLowerCase().includes(searchVal.toLowerCase())) {
        return item;
      }
    });
    setUsersUpdated(filterBySearch);
  }

  return (
    <div className="p-3 rightSec">
      <div className="">
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
              placeholder="Search by Email"
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
            {usersUpdated.length > 0 || users.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersUpdated.map((item, index) => (
                      <>
                        <tr className="">
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>+92 {item.phone}</td>
                          <td>{item.confirmed ? "Verified" : "Pending"}</td>
                          <td>
                            <button
                              onClick={() => Delete(item["_id"])}
                              className="btn btn-danger"
                            >
                              Delete
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
    </div>
  );
}

export default Users;
