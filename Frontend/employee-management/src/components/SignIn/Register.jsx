import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, message } from 'antd';
import { updateUser } from '../../features/employee/index';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { CardContainer, AuthContainer, StyledForm, SectionTitle, InfoCard } from '../../assets/SignInComponents';

// const { Title } = Typography;

const Register = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const [form] = Form.useForm();
  const decoded = jwtDecode(token);
  const { employeeId, email } = decoded;
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({ email });  
  }, [email, form]);

  const onFinish = (values) => {
    const payload = {
      userId: employeeId,                          
      updatedData: {                               
        username: values.username,
        email: values.email,
        password: values.password,
      },
    };

    dispatch(updateUser(payload))
      .unwrap()
      .then(() => {
        message.success('Registration successful!');
        form.resetFields();
      })
      .catch((error) => {
        message.error(`Error: ${error}`);
      });
    localStorage.setItem('userId', employeeId);
    navigate(`/application/${employeeId}`);
  };

  return (
    <CardContainer>
      <AuthContainer>
        <SectionTitle level={2}>User Registration</SectionTitle>
        <StyledForm
          layout="vertical"
          onFinish={onFinish}
          form={form}
          initialValues={{ email }}  
        >
          <InfoCard title="Account Information">
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input placeholder="Enter username" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </InfoCard>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </StyledForm>
      </AuthContainer>
    </CardContainer>
  );
};

export default Register;
