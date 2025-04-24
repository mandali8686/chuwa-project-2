import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Input, Button, Typography} from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../features/employee/index';
import { AuthContainer, StyledForm, ResponsiveFooter, CardContainer } from '../../assets/SignInComponents';

const { Title } = Typography;

const SignIn = () => {
  const { error, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/person-info");
    }
  }, [isAuthenticated]);

  const onFinish = async (values) => {
    dispatch(clearError())
    const { username, password } = values;
    await dispatch(loginUser({ username, password }))
  };

  const handleFieldChange = () => {
    if (error) dispatch(clearError());
  };

  return (
    <CardContainer>
      <AuthContainer>
        <Title level={3}>Sign In to Your Account</Title>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <StyledForm name="signin" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' }
            ]}
          >
            <Input onChange={handleFieldChange} placeholder="Enter your usename" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password onChange={handleFieldChange} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
          <ResponsiveFooter>
                <p style={{ marginRight: '0.5rem' }}>
                  Don't have an account? <a href="/signup">Sign Up</a>
                </p>
                <p>
                <a href="/forget-password">Forget Password?</a>
                </p>
          </ResponsiveFooter>
        </StyledForm>
      </AuthContainer>
    </CardContainer>
  );
};

export default SignIn;
