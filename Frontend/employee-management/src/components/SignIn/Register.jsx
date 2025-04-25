import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import styled from '@emotion/styled';
import { createUserAsync } from '../../features/employee/index';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const PageContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const SectionTitle = styled(Title)`
  && {
    color: #8b5e3c;
    margin-bottom: 16px;
  }
`;

const InfoCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 10px;
`;

const Register = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const payload = {
      username: values.username,
      email: values.email,
      password: values.password,
    };

    dispatch(createUserAsync(payload))
      .unwrap()
      .then(() => {
        message.success('Registration successful!');
        form.resetFields();
      })
      .catch((error) => {
        message.error(`Error: ${error}`);
      });
  };

  return (
    <PageContainer>
      <SectionTitle level={2}>User Registration</SectionTitle>
      <Form layout="vertical" onFinish={onFinish} form={form}>
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
      </Form>
    </PageContainer>
  );
};

export default Register;
