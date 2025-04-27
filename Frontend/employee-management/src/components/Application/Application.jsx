import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Select, DatePicker, Typography, Card, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { patchUser } from '../../features/employee/index';
import { storage } from '../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const { Title } = Typography;
const { Option } = Select;

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
  const userId = localStorage.getItem('userId');
  const [fileList, setFileList] = useState([]);
  const [docType, setDocType] = useState('Visa'); 

  useEffect(() => {
    if (!userId) {
      message.error('User ID not found. Please log in again.');
    }
  }, [userId]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const uploadDocumentsToFirebase = async (files) => {
    const uploadedDocs = [];
    for (const fileObj of files) {
      const file = fileObj.originFileObj;
      const storageRef = ref(storage, `documents/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      uploadedDocs.push({
        docType,              
        fileName: file.name,
        fileData: downloadUrl, 
      });
    }
    return uploadedDocs;
  };

  const onFinish = async (values) => {
    if (!userId) {
      message.error('User ID missing.');
      return;
    }

    let uploadedDocuments = [];
    try {
      if (fileList.length > 0) {
        uploadedDocuments = await uploadDocumentsToFirebase(fileList);
      }
    } catch (error) {
      message.error('Error uploading documents');
      return;
    }

    const payload = {
      userId,
      updatedData: {
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
          documents: uploadedDocuments, 
        },
      },
    };

    dispatch(patchUser(payload))
      .unwrap()
      .then(() => {
        message.success('Application updated successfully!');
        form.resetFields();
        setFileList([]);
      })
      .catch((error) => {
        message.error(`Error: ${error}`);
      });
  };

  return (
    <PageContainer>
      <SectionTitle level={2}>Employee Application Form</SectionTitle>
      <Form layout="vertical" onFinish={onFinish} form={form}>
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

        <InfoCard title="Visa Information & Document Upload">
          
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

          
          <Form.Item label="Document Type">
            <Select value={docType} onChange={setDocType}>
              <Option value="Passport">Passport</Option>
              <Option value="I-9">I-9</Option>
              <Option value="EAD">EAD</Option>
              <Option value="Visa">Visa</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Upload Visa Documents">
            <Upload
              multiple
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={fileList}
              listType="text"
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
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
