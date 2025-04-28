import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Descriptions, Spin, Alert, Button } from 'antd';
import styled from '@emotion/styled';
import { getUserById } from '../../features/employee/index';
import { useParams } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer, InfoCard, SectionTitle } from '../../assets/SignInComponents';

const { Title } = Typography;

const DocumentLink = styled.a`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const VisaDocuments = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
      console.log('Fetching user by ID from route param:', id);
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <PageContainer>
        <Spin size="large" tip="Loading visa information..." />
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

  const { username, role, visa = {} } = currentUser;
  const { isCitizenOrResident, visaType, startDate, endDate, documents = [] } = visa;

  return (
    <PageContainer>
      <SectionTitle level={2}>Visa Information & Documents</SectionTitle>

      <InfoCard title="Visa Details">
        <Descriptions column={2}>
          <Descriptions.Item label="Username">{username}</Descriptions.Item>
          <Descriptions.Item label="Role">{role}</Descriptions.Item>
          <Descriptions.Item label="Citizen / Resident">{isCitizenOrResident ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Visa Type">{visaType || '-'}</Descriptions.Item>
          <Descriptions.Item label="Start Date">{startDate ? new Date(startDate).toLocaleDateString() : '-'}</Descriptions.Item>
          <Descriptions.Item label="End Date">{endDate ? new Date(endDate).toLocaleDateString() : '-'}</Descriptions.Item>
        </Descriptions>
      </InfoCard>

      <InfoCard title="Uploaded Visa Documents">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <DocumentLink
              key={index}
              href={doc.fileData} // Assuming fileData is the download URL from Firebase
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon={<DownloadOutlined />} type="link">
                {doc.fileName} ({doc.docType})
              </Button>
            </DocumentLink>
          ))
        ) : (
          <p>No visa documents uploaded.</p>
        )}
      </InfoCard>
    </PageContainer>
  );
};

export default VisaDocuments;
