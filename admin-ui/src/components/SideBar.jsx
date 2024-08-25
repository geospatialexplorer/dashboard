import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  background-color: ${({ theme }) => theme.menuBackground};
  position: fixed;
  height: 100vh;
`;

const Sidebar = ({ collapsed }) => {
  return (
    <StyledSider trigger={null} collapsible collapsed={collapsed} width={250}>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
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
  );
};

export default Sidebar;
