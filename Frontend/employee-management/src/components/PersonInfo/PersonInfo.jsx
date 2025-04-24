import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Descriptions, Spin, Alert } from 'antd';
import styled from '@emotion/styled';
import { getUserById } from '../../features/employee/index';  // Adjust path if needed

const { Title } = Typography;

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

const PersonalInformation = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  console.log('Current user', currentUser);

  useEffect(() => {
    // const storedUserId = localStorage.getItem('userId');  
    if (currentUser && currentUser.userId) {
        dispatch(getUserById(currentUser.userId));
        console.log('Confirm getUserById runs for:', currentUser.userId);
      }
  }, [dispatch]);

  if (loading) {
    return (
      <PageContainer>
        <Spin size="large" tip="Loading user information..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Alert message="Error" description={error} type="error" showIcon />
      </PageContainer>
    );
  }

  if (!currentUser) {
    return (
      <PageContainer>
        <Alert message="No user data available" type="info" showIcon />
      </PageContainer>
    );
  }

  const {
    username,
    email,
    role,
    personalInfo = {},
    reference = {},
    emergencyContact = [],
    visa = {},
    onboading = {},
    createdAt
  } = currentUser;

  const {
    firstName,
    lastName,
    middleName,
    preferredName,
    profilePictue,
    address = {},
    cellPhone,
    workPhone
  } = personalInfo;

  return (
    <PageContainer>
      <SectionTitle level={2}>Personal Information</SectionTitle>

      <InfoCard title="Basic Information">
        <Descriptions column={2}>
          <Descriptions.Item label="Username">{username}</Descriptions.Item>
          <Descriptions.Item label="Role">{role}</Descriptions.Item>
          <Descriptions.Item label="First Name">{firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{lastName}</Descriptions.Item>
          <Descriptions.Item label="Middle Name">{middleName || '-'}</Descriptions.Item>
          <Descriptions.Item label="Preferred Name">{preferredName || '-'}</Descriptions.Item>
          <Descriptions.Item label="Profile Picture">
            {profilePictue ? <img src={profilePictue} alt="Profile" style={{ width: '100px' }} /> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Account Created">{new Date(createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </InfoCard>

      <InfoCard title="Address">
        <Descriptions column={2}>
          <Descriptions.Item label="Building / Apt #">{address.building || '-'}</Descriptions.Item>
          <Descriptions.Item label="Street">{address.street || '-'}</Descriptions.Item>
          <Descriptions.Item label="City">{address.city || '-'}</Descriptions.Item>
          <Descriptions.Item label="State">{address.state || '-'}</Descriptions.Item>
          <Descriptions.Item label="Zip Code">{address.zip || '-'}</Descriptions.Item>
        </Descriptions>
      </InfoCard>

      <InfoCard title="Contact Information">
        <Descriptions column={2}>
          <Descriptions.Item label="Cell Phone">{cellPhone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Work Phone">{workPhone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
        </Descriptions>
      </InfoCard>

      <InfoCard title="Onboarding Status">
        <Descriptions column={2}>
          <Descriptions.Item label="Status">{onboading.status}</Descriptions.Item>
          <Descriptions.Item label="Feedback">{onboading.feedback || '-'}</Descriptions.Item>
        </Descriptions>
      </InfoCard>

      <InfoCard title="Visa Information">
        <Descriptions column={2}>
          <Descriptions.Item label="Citizen / Resident">{visa.isCitizenOrResident ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Visa Type">{visa.visaType || '-'}</Descriptions.Item>
          <Descriptions.Item label="Start Date">{visa.startDate ? new Date(visa.startDate).toLocaleDateString() : '-'}</Descriptions.Item>
          <Descriptions.Item label="End Date">{visa.endDate ? new Date(visa.endDate).toLocaleDateString() : '-'}</Descriptions.Item>
        </Descriptions>
      </InfoCard>

      <InfoCard title="Reference Contact">
        <Descriptions column={2}>
          <Descriptions.Item label="First Name">{reference.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{reference.lastName}</Descriptions.Item>
          <Descriptions.Item label="Middle Name">{reference.middleName || '-'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{reference.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{reference.email}</Descriptions.Item>
          <Descriptions.Item label="Relationship">{reference.relationship}</Descriptions.Item>
        </Descriptions>
      </InfoCard>

      <InfoCard title="Emergency Contacts">
        {emergencyContact.length > 0 ? (
          emergencyContact.map((contact, index) => (
            <Descriptions column={2} key={index} style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="First Name">{contact.firstName}</Descriptions.Item>
              <Descriptions.Item label="Last Name">{contact.lastName}</Descriptions.Item>
              <Descriptions.Item label="Middle Name">{contact.middleName || '-'}</Descriptions.Item>
              <Descriptions.Item label="Phone">{contact.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{contact.email}</Descriptions.Item>
              <Descriptions.Item label="Relationship">{contact.relationship}</Descriptions.Item>
            </Descriptions>
          ))
        ) : (
          <p>No emergency contacts available.</p>
        )}
      </InfoCard>
    </PageContainer>
  );
};

export default PersonalInformation;
