import React, { useState } from "react";
import { Layout, Menu, Button, Grid, Drawer } from "antd";
import {
  MenuOutlined,
  DashboardOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import MapIcon from "@mui/icons-material/Map";
import styled from "styled-components";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import Dashboard from "./components/Dashboard";
import Chart from "./components/Chart";
import Tabledata from "./components/Table";
import CheckboxComponent from "./components/button";
import { useGetDistrictDataQuery, useGetHealthDataQuery } from "./services/Api";
import OpenLayersMap from "./components/CombinedMap.jsx";
import logo from "/logo.png";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

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

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  min-height: 400px;
  background: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  overflow-x: auto;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundColor};
`;

const StyledSider = styled(Sider)`
  .ant-layout-sider {
    background-color: ${({ theme }) => theme.menuBackground} !important;
    padding: 0;
  }

  .ant-menu {
    background-color: ${({ theme }) => theme.menuBackground} !important;
    padding: 0;
  }
  .ant-menu-item {
    color: ${({ theme }) => theme.textColor};
  }

  .ant-menu-item-selected {
    background-color: ${({ theme }) => theme.menuSelectedBackground};
    color: ${({ theme }) => theme.menuSelectedColor};
  }
`;

const LogoContainer = styled.div`
  padding: 16px;
  text-align: center;
  background-color: ${({ theme }) => (theme === "dark" ? "#111d2c" : "white")};
`;

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");

  // const { data: districtData, isLoading: districtLoading } = useGetDistrictDataQuery();
  // const {
  //   data: healthData,
  //   error: healthError,
  //   isLoading: healthLoading,
  // } = useGetHealthDataQuery();

  // console.log(healthData,'....ddd......');

  const screens = useBreakpoint();

  const toggleSidebar = () => {
    if (screens.xs) {
      setDrawerVisible(!drawerVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleMenuClick = (key) => {
    setSelectedMenu(key);
    if (screens.xs) {
      setDrawerVisible(false);
    }
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

  const renderMenu = () => (
    <>
      <LogoContainer theme={theme}>
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </LogoContainer>
      <Menu
        theme={theme === "dark" ? "dark" : "light"}
        mode="inline"
        selectedKeys={[selectedMenu]}
        style={{ height: "100%", paddingTop: "0" }}
      >
        <Menu.Item
          key="1"
          icon={<DashboardOutlined />}
          onClick={() => handleMenuClick("1")}
        >
          Dashboard
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={<MapIcon style={{ fontSize: "18px" }} />}
          onClick={() => handleMenuClick("4")}
        >
          Maps
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<BarChartOutlined />}
          onClick={() => handleMenuClick("2")}
        >
          Chart
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<DatabaseOutlined />}
          onClick={() => handleMenuClick("3")}
        >
          Table
        </Menu.Item>
      </Menu>
    </>
  );

  return (
    <StyledLayout>
      {screens.xs ? (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ padding: 0 }}
        >
          <DrawerHeader theme={theme}>
            <span>Menu</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDrawerVisible(false)}
              style={{ fontSize: "16px", color: theme.textColor }}
            />
          </DrawerHeader>
          {renderMenu()}
        </Drawer>
      ) : (
        <StyledSider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          collapsedWidth={80}
        >
          {renderMenu()}
        </StyledSider>
      )}
      <Layout className="site-layout">
        <StyledHeader>
          <Button
            type="text"
            icon={
              collapsed || drawerVisible ? <MenuOutlined /> : <MenuOutlined />
            }
            onClick={toggleSidebar}
            style={{ fontSize: "16px", color: theme.textColor }}
          />
          <center>
            <h1>Health and Air Quality Dashboard </h1>
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
