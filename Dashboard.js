import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  ButtonGroup,
} from "reactstrap";
import { chartExample1 } from "variables/charts.js";

function Dashboard(props) {
  const [bigChartData, setBigChartData] = useState("data1");

  const chartContainer = useRef(null);
  const [distanceChartData, setDistanceChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Distance',
      fill: false,
      borderColor: '#1f8ef1',
      data: []
    }]
  });

  const alertChartContainer = useRef(null);
  const [alertChartData, setAlertChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Number of Alerts',
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [],
    }],
  });

  useEffect(() => {
    const fetchDistanceData = async () => {
      try {
        // Fetch distance data from the API
        const response = await axios.get('http://192.168.102.180:5000/api/distances');
        const data = response.data;

        // Extract timestamps and distances
        const timestamps = data.map(item => new Date(item.timestamp).toLocaleString());
        const distances = data.map(item => item.distance);

        // Update the distance chart data
        setDistanceChartData({
          labels: timestamps,
          datasets: [{
            label: 'Distance',
            fill: false,
            borderColor: '#1f8ef1',
            data: distances
          }]
        });

        // Count the occurrences of each distance greater than 1
        const distanceCount = data.reduce((acc, record) => {
          if (record.distance > 1) {
            acc[record.distance] = (acc[record.distance] || 0) + 1;
          }
          return acc;
        }, {});

        // Extract distances and their counts
        const distanceLabels = Object.keys(distanceCount);
        const distanceCounts = Object.values(distanceCount);

        // Update the alert chart data
        setAlertChartData({
          labels: distanceLabels,
          datasets: [{
            label: 'Number of Alerts',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: distanceCounts,
          }],
        });
      } catch (error) {
        console.error("Failed to fetch distance data:", error);
      }
    };

    // Initial fetch
    fetchDistanceData();

    // Set up polling
    const interval = setInterval(fetchDistanceData, 1000); // Fetch data every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">2024</h5>
                    <CardTitle tag="h2">Distance</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      {/* Buttons here */}
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area" style={{ height: "350px" }}>
                  {/* Adjust the height as per your requirement */}
                  <Line
                    ref={chartContainer}
                    data={distanceChartData}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">2024</h5>
                    <CardTitle tag="h2">Alerts by Distance</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      {/* Buttons here */}
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area" style={{ height: "350px" }}>
                  {/* Adjust the height as per your requirement */}
                  <Bar
                    ref={alertChartContainer}
                    data={alertChartData}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1, // Ensure y-axis increments by 1
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
