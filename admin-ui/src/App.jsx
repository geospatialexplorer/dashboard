import React, { useState } from "react";
import { Layout, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import Dashboard from "./components/Dashboard";
import Chart from "./components/Chart";
import Tabledata from "./components/Table";
import CheckboxComponent from "./components/button";
import OpenLayersMap from "./components/CombinedMap.jsx";
import logo from "/logo.png";

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme.backgroundColor};
  margin: 0;
`;

const StyledHeader = styled(Header)`
  padding: 0;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px; /* Fixed height for header */
`;

const StyledLogo = styled.img`
  max-width: 50px;
  height: auto;
  margin-left: 16px;
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  min-height: 400px;
  background: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  overflow-x: auto;
`;

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedMenu, setSelectedMenu] = useState("1");

  const handleMenuClick = (key) => {
    setSelectedMenu(key);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "1":
        return <Dashboard />;
      case "2":
        return <Chart />;
      case "3":
        return <Tabledata />;
      case "4":
        return <OpenLayersMap />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <StyledLayout>
      <Layout className="site-layout">
        <StyledHeader>
        
          <StyledLogo src={logo} alt="Logo" />
          <center>
            <h1>Health and Air Quality Dashboard</h1>
          </center>
          <CheckboxComponent toggleTheme={toggleTheme} />
        </StyledHeader>
        <StyledContent>{renderContent()}</StyledContent>
      </Layout>
    </StyledLayout>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
