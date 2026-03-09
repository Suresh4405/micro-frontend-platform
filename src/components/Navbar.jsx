import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const navItems = ["Home", "Events", "Pricing", "Admin"];

export default function Navbar({ toggleTheme, darkMode }) {

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (item) => {

    if (item === "Home") navigate("/");
    if (item === "Events") navigate("/events");
    if (item === "Pricing") navigate("/pricing");
    if (item === "Admin") navigate("/");

  };

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item)}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="logo"
              style={{
                width: "140px",
                height: "auto"
              }}
            />
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  onClick={() => handleNavigation(item)}
                >
                  {item}
                </Button>
              ))}

              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <Box>
              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
}