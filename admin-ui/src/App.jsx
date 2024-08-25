import React, { useState } from "react";
import { Layout, Menu, Button, Switch } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styled, { ThemeProvider } from "styled-components";

const { Header, Sider, Content } = Layout;

const darkTheme = {
  background: "#001529",
  textColor: "#fff",
  menuBackground: "#001529",
};

const lightTheme = {
  background: "#fff",
  textColor: "#000",
  menuBackground: "#f0f2f5",
};

// Styled components
const StyledLayout = styled(Layout)`
  height: 100vh;
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

const Dashboard = () => <div>Dashboard Content</div>;
const Chart = () => <div>Chart Content</div>;
const Table = () => <div>Table Content</div>;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light theme
  const [selectedMenu, setSelectedMenu] = useState("1");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const renderContent = () => {
    switch (selectedMenu) {
      case "1":
        return <Dashboard />;
      case "2":
        return <Chart />;
      case "3":
        return <Table />;
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
        >
          <div className="logo" />
          <Menu
            theme={isDarkMode ? "dark" : "light"}
            mode="inline"
            selectedKeys={[selectedMenu]}
            style={{ height: "100%" }}
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
