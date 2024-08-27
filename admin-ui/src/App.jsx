import React, { useState } from "react";
import { Layout, Menu, Button, Grid } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { ThemeProvider, useTheme } from "./ThemeProvider"; // Adjust the path as necessary

import Dashboard from "./components/Dashboard";
import Chart from "./components/Chart";
import Tabledata from "./components/Table";
import CheckboxComponent from "./components/button";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const StyledLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme.backgroundColor};
`;

const StyledHeader = styled(Header)`
  padding: 0;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px; /* Fixed height for header */
`;

const StyledSider = styled(Sider)`
  height: calc(100vh);
  background-color: ${({ theme }) => theme.menuBackground};
  .ant-menu-item {
    color: ${({ theme }) => theme.textColor};
  }
  .ant-menu-item:hover {
    background-color: ${({ theme }) => theme.menuHoverBackground};
    color: ${({ theme }) => theme.menuHoverColor};
  }
  .ant-menu-item-selected {
    background-color: ${({ theme }) => theme.menuSelectedBackground};
    color: ${({ theme }) => theme.menuSelectedColor};
  }
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
  const { theme, toggleTheme } = useTheme(); // Get theme and toggleTheme from the ThemeProvider
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const screens = useBreakpoint();

  const renderContent = () => {
    switch (selectedMenu) {
      case "1":
        return <Dashboard />;
      case "2":
        return <Chart theme={theme} />;
      case "3":
        return <Tabledata />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <StyledLayout>
      <StyledSider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={screens.xs ? 0 : 80}
      >
        <Menu
          theme={theme === "dark" ? "dark" : "light"}
          mode="inline"
          selectedKeys={[selectedMenu]}
          style={{ height: "100%", paddingTop: "60px" }}
        >
          <Menu.Item
            key="1"
            icon={<DashboardOutlined />}
            onClick={() => setSelectedMenu("1")}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<BarChartOutlined />}
            onClick={() => setSelectedMenu("2")}
          >
            Chart
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<SettingOutlined />}
            onClick={() => setSelectedMenu("3")}
          >
            Table
          </Menu.Item>
        </Menu>
      </StyledSider>
      <Layout className="site-layout">
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{ fontSize: "16px", color: theme.textColor }}
          />
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
