import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Select, DatePicker, Typography, Card, message } from 'antd';
import styled from '@emotion/styled';
import moment from 'moment';
import { createUserAsync } from '../../features/employee/index';

const { Title } = Typography;
const { Option } = Select;

// Styled Components
const PageContainer = styled.div`
  max-width: 800px;
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

const Application = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const payload = {
      username: values.username,
      email: values.email,
      password: values.password,
      personalInfo: {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName || '',
        preferredName: values.preferredName || '',
        address: {
          building: values.building || '',
          street: values.street,
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
        cellPhone: values.cellPhone,
        workPhone: values.workPhone || '',
      },
      visa: {
        isCitizenOrResident: values.isCitizenOrResident === 'Yes',
        visaType: values.visaType || '',
        startDate: values.visaStartDate ? values.visaStartDate.format('YYYY-MM-DD') : null,
        endDate: values.visaEndDate ? values.visaEndDate.format('YYYY-MM-DD') : null,
      },
    };

    dispatch(createUserAsync(payload))
      .unwrap()
      .then(() => {
        message.success('Application submitted successfully!');
        form.resetFields();
      })
      .catch((error) => {
        message.error(`Error: ${error}`);
      });
  };

  return (
    <PageContainer>
      <SectionTitle level={2}>Employee Application Form</SectionTitle>
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

        <InfoCard title="Personal Information">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="middleName" label="Middle Name">
            <Input />
          </Form.Item>
          <Form.Item name="preferredName" label="Preferred Name">
            <Input />
          </Form.Item>
          <Form.Item name="cellPhone" label="Cell Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="workPhone" label="Work Phone">
            <Input />
          </Form.Item>
        </InfoCard>

        <InfoCard title="Address">
          <Form.Item name="building" label="Building / Apt #">
            <Input />
          </Form.Item>
          <Form.Item name="street" label="Street" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="state" label="State" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="zip" label="Zip Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </InfoCard>

        <InfoCard title="Visa Information">
          <Form.Item name="isCitizenOrResident" label="Citizen / Resident" rules={[{ required: true }]}>
            <Select placeholder="Select Yes or No">
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="visaType" label="Visa Type">
            <Input placeholder="Enter visa type (if applicable)" />
          </Form.Item>
          <Form.Item name="visaStartDate" label="Visa Start Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="visaEndDate" label="Visa End Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </InfoCard>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default Application;
