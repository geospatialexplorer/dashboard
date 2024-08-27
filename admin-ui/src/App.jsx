import React, { useState } from "react";
import { Layout, Menu, Button, Switch, Grid } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styled, { ThemeProvider } from "styled-components";
import Dashboard from "./components/Dashboard";
import Chart from "./components/Chart";
import Tabledata from "./components/Table";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const darkTheme = {
  background: "#001529",
  textColor: "#fff",
  menuBackground: "#001529",
  logoColor: "#fff",
};

const lightTheme = {
  background: "#fff",
  textColor: "#000",
  menuBackground: "#f0f2f5",
  logoColor: "#1890ff",
};

// Styled components
const StyledLayout = styled(Layout)`
  height: 150vh;
`;

const StyledHeader = styled(Header)`
  padding: 0;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledSider = styled(Sider)`
  background-color: ${({ theme }) => theme.menuBackground};
`;

const Logo = styled.div`
  height: 64px;
  margin: 16px;
  color: ${({ theme }) => theme.logoColor};
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.menuBackground};
  border-radius: 4px;
`;



const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [selectedMenu, setSelectedMenu] = useState("1");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const screens = useBreakpoint();

  const renderContent = () => {
    switch (selectedMenu) {
      case "1":
        return <Dashboard />;
      case "2":
        return <Chart theme={currentTheme} />; // Pass the current theme to Chart
      case "3":
        return <Tabledata/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <StyledLayout>
        <StyledSider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          collapsedWidth={screens.xs ? 0 : 80} // Hide Sider on extra small screens
        >
       
          <Menu
            theme={isDarkMode ? "dark" : "light"}
            mode="inline"
            selectedKeys={[selectedMenu]}
            style={{ height: "90%",paddingTop: "60px" }}
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
              style={{ fontSize: "16px", color: currentTheme.textColor }}
            />
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </StyledHeader>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              
              background: currentTheme.menuBackground,
              color: currentTheme.textColor,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </StyledLayout>
    </ThemeProvider>
  );
};

export default App;
