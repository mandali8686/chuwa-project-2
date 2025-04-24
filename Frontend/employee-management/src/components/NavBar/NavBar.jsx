import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const NavBarContainer = styled.div`
  width: 100%;
  background-color: #001529;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  padding: 0 16px;
`;

const StyledMenu = styled(Menu)`
  background-color: #001529;
  border-bottom: none;

  .ant-menu-item {
    color: #fff;
    &:hover {
      background-color: #1890ff;
    }
  }

  .ant-menu-item-selected {
    background-color: #1890ff !important;
  }
`;

const NavBar = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.key === 'logout') {
      console.log('Logout clicked');
    } else {
      navigate(e.key);
    }
  };

  return (
    <NavBarContainer>
      <Logo>Employee Portal</Logo>
      <StyledMenu
        theme="dark"
        mode="horizontal"
        onClick={handleClick}
        selectable={false}
      >
        <Menu.Item key="/">Home</Menu.Item>
        <Menu.Item key="/employee-profiles">Employee Profiles</Menu.Item>
        <Menu.Item key="/visa-status">Visa Status Management</Menu.Item>
        <Menu.Item key="/hiring-management">Hiring Management</Menu.Item>
        <Menu.Item key="logout">Logout</Menu.Item>
      </StyledMenu>
    </NavBarContainer>
  );
};

export default NavBar;
