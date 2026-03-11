import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Helmet, HelmetProvider } from "react-helmet-async"; 
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import EventsFrame from "./micro/EventsFrame";
import PricingFrame from "./micro/PricingFrame";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    }
  });

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet>
          <title>Suresh codes - Developer Learning Platform</title>
          <meta
            name="description"
            content="Learn development through podcasts, videos and codebase access."
          />
          <meta name="keywords" content="developer learning, coding tutorials, programming courses" />
        </Helmet>
        <Router>
          <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <PricingFrame darkMode={darkMode} />
                  <EventsFrame darkMode={darkMode} />
                </>
              }
            />
            <Route
              path="/events"
              element={<EventsFrame darkMode={darkMode} />}
            />
            <Route
              path="/pricing"
              element={<PricingFrame darkMode={darkMode} />}
            />
             <Route
              path="/admin"
              element={<AdminDashboard />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;