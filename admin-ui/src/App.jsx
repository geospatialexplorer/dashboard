import React, { useState } from "react";
import { Layout, Menu, Button, Switch } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
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
  menuBackground: "#fff",
};

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

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

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
            defaultSelectedKeys={["1"]}
            style={{ height: "100%" }}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Profile
            </Menu.Item>
            <Menu.Item key="3" icon={<SettingOutlined />}>
              Settings
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
            Content goes here.
          </Content>
        </Layout>
      </StyledLayout>
    </ThemeProvider>
  );
};

export default App;
