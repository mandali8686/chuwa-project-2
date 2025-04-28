import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Select, DatePicker, Typography, Card, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { patchUser } from '../../features/employee/index';
import { storage } from '../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams,useNavigate } from 'react-router-dom';

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
  // const userId = localStorage.getItem('userId');
  // const [fileList, setFileList] = useState([]);
  const [documents, setDocuments] = useState([{ docType: 'Visa', fileList: [] }]);

  const [docType, setDocType] = useState('Visa'); 
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null); 
  const [profileImageUrl, setProfileImageUrl] = useState(''); 
  const { id: userId } = useParams();


  useEffect(() => {
    if (!userId) {
      message.error('User ID not found. Please log in again.');
    }
  }, [userId]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleDocumentFileChange = (index, { fileList }) => {
    const newDocuments = [...documents];
    newDocuments[index].fileList = fileList;
    setDocuments(newDocuments);
  };
  
  const handleDocTypeChange = (index, value) => {
    const newDocuments = [...documents];
    newDocuments[index].docType = value;
    setDocuments(newDocuments);
  };

  const addDocumentSection = () => {
    setDocuments([...documents, { docType: 'Visa', fileList: [] }]);
  };  
  

  const uploadDocumentsToFirebase = async (files) => {
    const uploadedDocs = [];
    for (const fileObj of files) {
      const file = fileObj.originFileObj;
      const storageRef = ref(storage, `documents/${userId}/${file.name}`);
      console.log(storageRef);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      uploadedDocs.push({
        employeeId: userId,    
        docType,              
        fileName: file.name,
        fileData: downloadUrl, 
      });
    }
    return uploadedDocs;
  };

  const handleProfileImageChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setProfileImage(fileList[0].originFileObj);
    } else {
      setProfileImage(null);
    }
  };
  
  const uploadProfilePicture = async () => {
    if (profileImage) {
      const profileRef = ref(storage, `profilePictures/${userId}/${profileImage.name}`);
      console.log(profileRef);
      await uploadBytes(profileRef, profileImage);
      const downloadUrl = await getDownloadURL(profileRef);
      setProfileImageUrl(downloadUrl);
      return downloadUrl;
    }
    return '';
  };
  

  const onFinish = async (values) => {
    if (!userId) {
      message.error('User ID missing.');
      return;
    }
  
    let uploadedDocuments = [];
    let profilePictureUrl = '';
  
    try {
      
      profilePictureUrl = await uploadProfilePicture();
      uploadedDocuments = [];
      for (let doc of documents) {
        if (doc.fileList.length > 0) {
          const fileObj = doc.fileList[0].originFileObj;
          const storageRef = ref(storage, `documents/${userId}/${fileObj.name}`);
          await uploadBytes(storageRef, fileObj);
          const downloadUrl = await getDownloadURL(storageRef);
          uploadedDocuments.push({
            employeeId: userId,
            docType: doc.docType,
            fileName: fileObj.name,
            fileData: downloadUrl,
          });
        }
      }

    } catch (error) {
      message.error('Error uploading files');
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
          profilePictue: profilePictureUrl || '',
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
        onboading: {
            status: "Pending"
        },
        visa: {
          isCitizenOrResident: values.isCitizenOrResident === 'Yes',
          visaType: values.visaType || '',
          startDate: values.visaStartDate ? values.visaStartDate.format('YYYY-MM-DD') : null,
          endDate: values.visaEndDate ? values.visaEndDate.format('YYYY-MM-DD') : null,
          documents: uploadedDocuments, 
        },
        reference: {
          firstName: values.referenceFirstName,
          lastName: values.referenceLastName,
          middleName: values.referenceMiddleName || '',
          phone: values.referencePhone,
          email: values.referenceEmail,
          relationship: values.referenceRelationship,
        },
        emergencyContact: [
          {
            firstName: values.emergencyFirstName,
            lastName: values.emergencyLastName,
            middleName: values.emergencyMiddleName || '',
            phone: values.emergencyPhone,
            email: values.emergencyEmail,
            relationship: values.emergencyRelationship,
          },
        ],
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
      console.log('UserID Check', userId);
      navigate(`/person-info/${userId}`);
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
        <InfoCard title="Profile Picture Upload">
        <Form.Item label="Upload Profile Picture">
          <Upload
            beforeUpload={() => false}
            onChange={handleProfileImageChange}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select Profile Picture</Button>
          </Upload>
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

          <SectionTitle level={4}>Upload Visa Documents</SectionTitle>
          {documents.map((doc, index) => (
            <div key={index} style={{ marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '16px' }}>
              <Form.Item label={`Document Type ${index + 1}`}>
                <Select
                  value={doc.docType}
                  onChange={(value) => handleDocTypeChange(index, value)}
                  style={{ width: '200px' }}
                >
                  <Option value="Passport">Passport</Option>
                  <Option value="I-9">I-9</Option>
                  <Option value="EAD">EAD</Option>
                  <Option value="Visa">Visa</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Upload Document">
                <Upload
                  multiple={false}  // One file per entry
                  beforeUpload={() => false}
                  onChange={(info) => handleDocumentFileChange(index, info)}
                  fileList={doc.fileList}
                  listType="text"
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
            </div>
          ))}
          <Button type="dashed" onClick={addDocumentSection} block>
            + Add Another Document
          </Button>
        </InfoCard>


        <InfoCard title="Reference Contact">
          <Form.Item name="referenceFirstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="referenceLastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="referenceMiddleName" label="Middle Name">
            <Input />
          </Form.Item>
          <Form.Item name="referencePhone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="referenceEmail" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="referenceRelationship" label="Relationship" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </InfoCard>

        
        <InfoCard title="Emergency Contact">
          <Form.Item name="emergencyFirstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="emergencyLastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="emergencyMiddleName" label="Middle Name">
            <Input />
          </Form.Item>
          <Form.Item name="emergencyPhone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="emergencyEmail" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="emergencyRelationship" label="Relationship" rules={[{ required: true }]}>
            <Input />
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
