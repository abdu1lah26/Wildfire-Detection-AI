import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Container, CircularProgress, Alert, Paper, Grid, Card, CardContent, Button } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";
import { db } from "./firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import FireIcon from "@mui/icons-material/LocalFireDepartment";
import AreaIcon from "@mui/icons-material/Terrain";
import ContainmentIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";

function App() {
  const [wildfireData, setWildfireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDangerLevels, setShowDangerLevels] = useState(false);

  useEffect(() => {
    console.log("📡 Listening for live wildfire updates...");
    const unsubscribe = onSnapshot(collection(db, "wildfires"), (snapshot) => {
      const fires = snapshot.docs.map((doc) => doc.data());
      setWildfireData(fires);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Calculate Summary Stats
  const totalFires = wildfireData.length;
  const totalAcresBurned = wildfireData.reduce((sum, fire) => sum + (fire.acresBurned || 0), 0);
  const avgContainment = totalFires ? (wildfireData.reduce((sum, fire) => sum + (fire.containment || 0), 0) / totalFires).toFixed(2) : 0;

  // 🔥 Function to determine danger level
  const getDangerLevel = (fire) => {
    if (fire.containment > 80) return { level: "🟢 Low", color: "green" };
    if (fire.containment >= 50) return { level: "🟠 Moderate", color: "orange" };
    return { level: "🔴 High", color: "red" };
  };

  return (
    <>
      {/* 🔥 Top Bar */}
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
            {/* 🔥 Summary Cards */}
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

            {/* 🔥 Button to Show Danger Levels */}
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<WarningIcon />} 
              onClick={() => setShowDangerLevels(!showDangerLevels)}
              style={{ marginBottom: "20px" }}
            >
              {showDangerLevels ? "Hide Danger Levels" : "Show Danger Levels"}
            </Button>

            {/* 🔥 Display Danger Levels (Only if Button is Clicked) */}
            {showDangerLevels && (
              <Paper elevation={3} style={{ padding: "15px", marginBottom: "20px" }}>
                <Typography variant="h6" style={{ marginBottom: "10px" }}>⚠️ Wildfire Danger Levels</Typography>
                {wildfireData.map((fire, index) => {
                  const danger = getDangerLevel(fire);
                  return (
                    <Paper 
                      key={fire.id || index} 
                      elevation={2} 
                      style={{ padding: "10px", marginBottom: "10px", borderLeft: `5px solid ${danger.color}` }}
                    >
                      <Typography variant="h6">{fire.name}</Typography>
                      <Typography>Status: {fire.status} | Acres Burned: {fire.acresBurned} | Containment: {fire.containment}%</Typography>
                      <Typography style={{ color: danger.color, fontWeight: "bold" }}>
                        Danger Level: {danger.level}
                      </Typography>
                    </Paper>
                  );
                })}
              </Paper>
            )}

            {/* 🔥 Data Visualizations */}
            <Grid container spacing={3}>
              {/* 🔥 Bar Chart */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" align="center">🔥 Acres Burned Per Fire</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wildfireData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="acresBurned" fill="#ff5733" name="Acres Burned" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>

              {/* 🔥 Line Chart */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" align="center">🔥 Containment Progress</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={wildfireData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="containment" stroke="#33ff57" name="Containment (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
