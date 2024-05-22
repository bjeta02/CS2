import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Input, InputGroup } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function TableList() {
  const [distances, setDistances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(null);

  useEffect(() => {
    const fetchDistances = async () => {
      try {
        const response = await axios.get("http://192.168.102.180:5000/api/distances");
        setDistances(response.data);
      } catch (error) {
        console.error("Error fetching distances:", error);
      }
    };

    fetchDistances();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const filterByDate = (data, date) => {
    if (!date) return data; // Return all data if no date is selected

    // Extract the year, month, and day from the selected date
    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth();
    const selectedDay = date.getDate();

    return data.filter(item => {
      // Convert the item's date string to a Date object
      const itemDate = new Date(item.timestamp);
      // Extract year, month, and day to compare
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth();
      const itemDay = itemDate.getDate();

      // Compare year, month, and day for exact match
      return itemYear === selectedYear && itemMonth === selectedMonth && itemDay === selectedDay;
    });
  };

  const filteredDistances = filterByDate(distances, searchDate);

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader style={{ paddingRight: "100px" }}>
                <CardTitle tag="h2">Distance Records</CardTitle>
              </CardHeader>
              <CardBody>
                <InputGroup className="mb-3" style={{ width: "250px", marginLeft: "20px" }}>
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ borderRadius: "20px", paddingLeft: "15px" }}
                  />
                </InputGroup>

                <div className="d-flex align-items-center mb-3" style={{ width: "250px", marginLeft: "20px" }}>
                  <span style={{ marginRight: "10px" }}>Select Date:</span>
                  <DatePicker
                    selected={searchDate}
                    onChange={date => setSearchDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    placeholderText="Select a date"
                    isClearable={true}
                  />
                </div>

                <div style={{ height: "700px", overflowY: "auto" }}>
                  <Table className="tablesorter" style={{ width: "1650px", marginLeft: "20px" }} responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Alert #</th>
                        <th>Distance (in CM)</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Alert Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistances
                        .filter(distance =>
                          distance.distance.toString().includes(searchTerm) ||
                          distance.alertStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          new Date(distance.timestamp).toLocaleString().includes(searchTerm)
                        )
                        .map((distance, index) => (
                          <tr key={distance._id}>
                            <td>{index + 1}</td>
                            <td>{distance.distance}</td>
                            <td>{formatDate(distance.timestamp)}</td>
                            <td>{formatTime(distance.timestamp)}</td>
                            <td>{distance.alertStatus}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TableList;
