import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Container, CircularProgress, Alert, Paper, Grid, Card, CardContent, Button } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";
import axios from "axios"; 

import FireIcon from "@mui/icons-material/LocalFireDepartment";
import AreaIcon from "@mui/icons-material/Terrain";
import ContainmentIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";

const BACKEND_URL = "https://wildfire-tracker-backend.onrender.com"; 

function App() {
  const [wildfireData, setWildfireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDangerLevels, setShowDangerLevels] = useState(false);

  useEffect(() => {
    console.log("📡 Fetching live wildfire data...");
    
    const fetchData = async () => {
      try {
        const response = await axios.get("https://wildfire-tracker-backend.onrender.com/wildfire");
        setWildfireData(response.data.fires || []);
        setLoading(false);
      } catch (err) {
        console.error("🔥 Error fetching wildfire data:", err);
        setError("Failed to fetch wildfire data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // ✅ Fetch data every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const totalFires = wildfireData.length;
  const totalAcresBurned = wildfireData.reduce((sum, fire) => sum + (fire.acresBurned || 0), 0);
  const avgContainment = totalFires ? (wildfireData.reduce((sum, fire) => sum + (fire.containment || 0), 0) / totalFires).toFixed(2) : 0;

  const getDangerLevel = (fire) => {
    if (fire.containment >= 90) return { level: "🟢 Low", color: "green" };
    if (fire.containment >= 50) return { level: "🟠 Moderate", color: "orange" };
    return { level: "🔴 High", color: "red" };
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">🔥 LA Wildfire Tracker</Typography>
        </Toolbar>
      </AppBar>

      <Container style={{ marginTop: "20px" }}>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid container spacing={3} style={{ marginBottom: "20px" }}>
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent style={{ display: "flex", alignItems: "center" }}>
                    <FireIcon color="error" style={{ fontSize: 40, marginRight: 10 }} />
                    <div>
                      <Typography variant="h6">Total Fires</Typography>
                      <Typography variant="h4">{totalFires}</Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent style={{ display: "flex", alignItems: "center" }}>
                    <AreaIcon color="primary" style={{ fontSize: 40, marginRight: 10 }} />
                    <div>
                      <Typography variant="h6">Acres Burned</Typography>
                      <Typography variant="h4">{totalAcresBurned}</Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent style={{ display: "flex", alignItems: "center" }}>
                    <ContainmentIcon color="success" style={{ fontSize: 40, marginRight: 10 }} />
                    <div>
                      <Typography variant="h6">Avg Containment</Typography>
                      <Typography variant="h4">{avgContainment}%</Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<WarningIcon />} 
              onClick={() => setShowDangerLevels(!showDangerLevels)}
              style={{ marginBottom: "20px" }}
            >
              {showDangerLevels ? "Hide Danger Levels" : "Show Danger Levels"}
            </Button>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
