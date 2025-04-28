import React from 'react';
import { Menu, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useSelector,useDispatch } from 'react-redux';
import { clearUser } from '../../features/employee';

const NavBarContainer = styled.div`
  width: 100%;
  background-color: #001529;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const Logo = styled.div`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  padding: 0 16px;
  white-space: nowrap;
`;

const MenuContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  margin-right:20px;
  overflow-x: auto;
  .ant-menu {
    flex: none;
    background-color: #001529;
    border-bottom: none;
  }
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
  const { currentUser } = useSelector((state) => state.user);
  const localStorageUserId = localStorage.getItem('userId');
  const userId = currentUser?._id || localStorageUserId;
  const dispatch = useDispatch();

  const handleClick = (e) => {
    if (e.key === 'logout') {
      console.log('Logout clicked');
      message.info('You have signed out.');
      navigate('/');
      dispatch(clearUser());
    } else if (e.key === 'employee-profiles') {
      if (userId) {
        navigate(`/person-info/${userId}`);
      } else {
        console.error('User ID not found');
        navigate('/');
      }
    } else if (e.key === 'visa-status') {  
      if (userId) {
        navigate(`/visa-status/${userId}`);   
      } else {
        console.error('User ID not found');
        navigate('/');
      }
    } else {
      navigate(e.key);
    }
  };
  

  return (
    <NavBarContainer>
      <Logo>Employee Portal</Logo>
      <MenuContainer>
      <StyledMenu
        theme="dark"
        mode="horizontal"
        onClick={handleClick}
        selectable={false}
      >
        <Menu.Item key="logout">Logout</Menu.Item>
        <Menu.Item key="employee-profiles">Profile</Menu.Item>
        <Menu.Item key="visa-status">Visa Status Management</Menu.Item> 
      </StyledMenu>

      </MenuContainer>
    </NavBarContainer>
  );
};

export default NavBar;
