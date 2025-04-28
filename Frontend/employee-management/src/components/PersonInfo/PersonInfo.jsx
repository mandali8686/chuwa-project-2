import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Descriptions, Spin, Alert, Button, Input, message, Upload, DatePicker, Select } from 'antd';
import styled from '@emotion/styled';
import { getUserById } from '../../features/employee/index';  
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, InfoCard, SectionTitle } from '../../assets/SignInComponents';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { patchUser } from '../../features/employee/index';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebaseConfig';
import dayjs from 'dayjs';

const { Title } = Typography;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;


const PersonalInformation = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  console.log('Current user', currentUser);
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [editingSection, setEditingSection] = useState(null);
  const [editValues, setEditValues] = useState({});



  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
      console.log('Fetching user by ID from route param:', id);
    }
  }, [dispatch, id]);

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
    workPhone,
    SSN,
    dateOfBirth,
    gender
  } = personalInfo;

  const handleEditClick = (section) => {
    setEditingSection(section);
    setEditValues(JSON.parse(JSON.stringify(currentUser)));
  };
  
  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditValues({});
  };
  
  const handleSaveEdit = async (section) => {
    let updatedData = {};
  
    const currentPersonalInfo = currentUser.personalInfo || {};
    const currentVisa = currentUser.visa || {};
    const currentOnboading = currentUser.onboading || {};
    const currentReference = currentUser.reference || {};
    const currentEmergencyContact = currentUser.emergencyContact || [];
  
    if (section === 'profilePicture' && editValues.personalInfo?.profilePictueFile) {
      const file = editValues.personalInfo.profilePictueFile;
      const profileRef = ref(storage, `profilePictures/${currentUser._id}/${file.name}`);
      await uploadBytes(profileRef, file);
      const downloadUrl = await getDownloadURL(profileRef);
  
      updatedData = {
        personalInfo: {
          ...currentPersonalInfo,  // Keep existing fields
          profilePictue: downloadUrl,
        },
      };
    } else {
      updatedData =
        section === 'personalInfo'
          ? { personalInfo: { ...currentPersonalInfo, ...editValues.personalInfo } }
          : section === 'address'
          ? { personalInfo: { ...currentPersonalInfo, address: editValues.personalInfo.address } }
          : section === 'visa'
          ? { visa: { ...currentVisa, ...editValues.visa } }
          : section === 'onboading'
          ? { onboading: { ...currentOnboading, ...editValues.onboading } }
          : section === 'reference'
          ? { reference: { ...currentReference, ...editValues.reference } }
          : section === 'emergencyContact'
          ? { emergencyContact: [...editValues.emergencyContact] }
          : {};
    }
  
    dispatch(patchUser({
      userId: currentUser._id,
      updatedData: updatedData,
    }))
      .unwrap()
      .then(() => {
        message.success('Update saved successfully!');
        setEditingSection(null);
        setEditValues({});
      })
      .catch((error) => {
        message.error(`Error saving update: ${error}`);
      });
  };
  
  
  const handleFieldChange = (fieldPath, value) => {
    setEditValues((prev) => {
      const newValues = { ...prev };
      const keys = fieldPath.split('.');
      let obj = newValues;
      keys.slice(0, -1).forEach((k) => { obj[k] = obj[k] || {}; obj = obj[k]; });
      obj[keys[keys.length - 1]] = value;
      return newValues;
    });
  };
  

  return (
    <PageContainer>
      <TopBar>
        <SectionTitle level={2}>Personal Information</SectionTitle>
        {role === 'HR' && (
          <Button type="primary" onClick={() => navigate('/hr/dashboard')}>
            Go to HR Dashboard
          </Button>
        )}
      </TopBar>

      <InfoCard
        title="Profile Picture"
        extra={
          editingSection === 'profilePicture' ? (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleSaveEdit('profilePicture')}
              />
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
              />
            </>
          ) : (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditClick('profilePicture')}
            />
          )
        }
      >
        {editingSection === 'profilePicture' ? (
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture-card"
            onChange={({ fileList }) =>
              handleFieldChange('personalInfo.profilePictueFile', fileList[0]?.originFileObj)
            }
          >
            <div>Upload</div>
          </Upload>
        ) : (
          profilePictue ? (
            <img src={profilePictue} alt="Profile" style={{ width: '120px', borderRadius: '8px' }} />
          ) : (
            <p>No profile picture uploaded.</p>
          )
        )}
      </InfoCard>

      <InfoCard
        title="Basic Information"
        extra={
          editingSection === 'personalInfo' ? (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleSaveEdit('personalInfo')}
              />
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
              />
            </>
          ) : (
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditClick('personalInfo')} />
          )
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="Username">{username}</Descriptions.Item>
          <Descriptions.Item label="Role">{role}</Descriptions.Item>
          <Descriptions.Item label="First Name">
            {editingSection === 'personalInfo' ? (
              <Input
                value={editValues.personalInfo?.firstName || ''}
                onChange={(e) => handleFieldChange('personalInfo.firstName', e.target.value)}
              />
            ) : (
              firstName
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {editingSection === 'personalInfo' ? (
              <Input
                value={editValues.personalInfo?.lastName || ''}
                onChange={(e) => handleFieldChange('personalInfo.lastName', e.target.value)}
              />
            ) : (
              lastName
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Middle Name">
            {editingSection === 'personalInfo' ? (
              <Input
                value={editValues.personalInfo?.middleName || ''}
                onChange={(e) => handleFieldChange('personalInfo.middleName', e.target.value)}
              />
            ) : (
              middleName || '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Preferred Name">
            {editingSection === 'personalInfo' ? (
              <Input
                value={editValues.personalInfo?.preferredName || ''}
                onChange={(e) => handleFieldChange('personalInfo.preferredName', e.target.value)}
              />
            ) : (
              preferredName || '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Cell Phone">
            {editingSection === 'personalInfo' ? (
              <Input
                value={editValues.personalInfo?.cellPhone || ''}
                onChange={(e) => handleFieldChange('personalInfo.cellPhone', e.target.value)}
              />
            ) : (
              cellPhone  || '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Work Phone">
            {editingSection === 'personalInfo' ? (
              <Input
                value={editValues.personalInfo?.workPhone || ''}
                onChange={(e) => handleFieldChange('personalInfo.workPhone', e.target.value)}
              />
            ) : (
              workPhone || '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="SSN">
            {editingSection === 'personalInfo' ? (
              <Input
                value={editValues.personalInfo?.SSN || ''}
                onChange={(e) => handleFieldChange('personalInfo.SSN', e.target.value)}
              />
            ) : (
              SSN || '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
          {editingSection === 'personalInfo' ? (
            <DatePicker
              style={{ width: '100%' }}
              value={editValues.personalInfo?.dateOfBirth ? dayjs(editValues.personalInfo.dateOfBirth) : null}
              onChange={(date) => handleFieldChange('personalInfo.dateOfBirth', date ? date.toISOString() : '')}
            />
          ) : (
            dateOfBirth ? dayjs(dateOfBirth).format('YYYY-MM-DD') : '-'
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Gender">
          {editingSection === 'personalInfo' ? (
            <Select
              value={editValues.personalInfo?.gender || ''}
              onChange={(value) => handleFieldChange('personalInfo.gender', value)}
              style={{ width: '100%' }}
            >
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Not Declared">Not Declared</Select.Option>
            </Select>
          ) : (
            gender || '-'
          )}
        </Descriptions.Item>
        </Descriptions>
      </InfoCard>


      <InfoCard
          title="Address"
          extra={
            editingSection === 'address' ? (
              <>
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSaveEdit('address')}
                />
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={handleCancelEdit}
                />
              </>
            ) : (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditClick('address')}
              />
            )
          }
        >
          <Descriptions column={2}>
            <Descriptions.Item label="Building / Apt #">
              {editingSection === 'address' ? (
                <Input
                  value={editValues.personalInfo?.address?.building || ''}
                  onChange={(e) =>
                    handleFieldChange('personalInfo.address.building', e.target.value)
                  }
                />
              ) : (
                address.building || '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Street">
              {editingSection === 'address' ? (
                <Input
                  value={editValues.personalInfo?.address?.street || ''}
                  onChange={(e) =>
                    handleFieldChange('personalInfo.address.street', e.target.value)
                  }
                />
              ) : (
                address.street || '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {editingSection === 'address' ? (
                <Input
                  value={editValues.personalInfo?.address?.city || ''}
                  onChange={(e) =>
                    handleFieldChange('personalInfo.address.city', e.target.value)
                  }
                />
              ) : (
                address.city || '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              {editingSection === 'address' ? (
                <Input
                  value={editValues.personalInfo?.address?.state || ''}
                  onChange={(e) =>
                    handleFieldChange('personalInfo.address.state', e.target.value)
                  }
                />
              ) : (
                address.state || '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Zip Code">
              {editingSection === 'address' ? (
                <Input
                  value={editValues.personalInfo?.address?.zip || ''}
                  onChange={(e) =>
                    handleFieldChange('personalInfo.address.zip', e.target.value)
                  }
                />
              ) : (
                address.zip || '-'
              )}
            </Descriptions.Item>
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

      <InfoCard
          title="Reference Contact"
          extra={
            editingSection === 'reference' ? (
              <>
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSaveEdit('reference')}
                />
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={handleCancelEdit}
                />
              </>
            ) : (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditClick('reference')}
              />
            )
          }
        >
          <Descriptions column={2}>
            <Descriptions.Item label="First Name">
              {editingSection === 'reference' ? (
                <Input
                  value={editValues.reference?.firstName || ''}
                  onChange={(e) =>
                    handleFieldChange('reference.firstName', e.target.value)
                  }
                />
              ) : (
                reference.firstName
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {editingSection === 'reference' ? (
                <Input
                  value={editValues.reference?.lastName || ''}
                  onChange={(e) =>
                    handleFieldChange('reference.lastName', e.target.value)
                  }
                />
              ) : (
                reference.lastName
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Middle Name">
              {editingSection === 'reference' ? (
                <Input
                  value={editValues.reference?.middleName || ''}
                  onChange={(e) =>
                    handleFieldChange('reference.middleName', e.target.value)
                  }
                />
              ) : (
                reference.middleName || '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {editingSection === 'reference' ? (
                <Input
                  value={editValues.reference?.phone || ''}
                  onChange={(e) =>
                    handleFieldChange('reference.phone', e.target.value)
                  }
                />
              ) : (
                reference.phone
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {editingSection === 'reference' ? (
                <Input
                  value={editValues.reference?.email || ''}
                  onChange={(e) =>
                    handleFieldChange('reference.email', e.target.value)
                  }
                />
              ) : (
                reference.email
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Relationship">
              {editingSection === 'reference' ? (
                <Input
                  value={editValues.reference?.relationship || ''}
                  onChange={(e) =>
                    handleFieldChange('reference.relationship', e.target.value)
                  }
                />
              ) : (
                reference.relationship
              )}
            </Descriptions.Item>
          </Descriptions>
        </InfoCard>


        <InfoCard
          title="Emergency Contacts"
          extra={
            editingSection === 'emergencyContact' ? (
              <>
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSaveEdit('emergencyContact')}
                />
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={handleCancelEdit}
                />
              </>
            ) : (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditClick('emergencyContact')}
              />
            )
          }
        >
          {emergencyContact.length > 0 ? (
            emergencyContact.map((contact, index) => (
              <Descriptions column={2} key={index} style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="First Name">
                  {editingSection === 'emergencyContact' ? (
                    <Input
                      value={editValues.emergencyContact?.[index]?.firstName || ''}
                      onChange={(e) =>
                        handleFieldChange(`emergencyContact.${index}.firstName`, e.target.value)
                      }
                    />
                  ) : (
                    contact.firstName
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                  {editingSection === 'emergencyContact' ? (
                    <Input
                      value={editValues.emergencyContact?.[index]?.lastName || ''}
                      onChange={(e) =>
                        handleFieldChange(`emergencyContact.${index}.lastName`, e.target.value)
                      }
                    />
                  ) : (
                    contact.lastName
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Middle Name">
                  {editingSection === 'emergencyContact' ? (
                    <Input
                      value={editValues.emergencyContact?.[index]?.middleName || ''}
                      onChange={(e) =>
                        handleFieldChange(`emergencyContact.${index}.middleName`, e.target.value)
                      }
                    />
                  ) : (
                    contact.middleName || '-'
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {editingSection === 'emergencyContact' ? (
                    <Input
                      value={editValues.emergencyContact?.[index]?.phone || ''}
                      onChange={(e) =>
                        handleFieldChange(`emergencyContact.${index}.phone`, e.target.value)
                      }
                    />
                  ) : (
                    contact.phone
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {editingSection === 'emergencyContact' ? (
                    <Input
                      value={editValues.emergencyContact?.[index]?.email || ''}
                      onChange={(e) =>
                        handleFieldChange(`emergencyContact.${index}.email`, e.target.value)
                      }
                    />
                  ) : (
                    contact.email
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Relationship">
                  {editingSection === 'emergencyContact' ? (
                    <Input
                      value={editValues.emergencyContact?.[index]?.relationship || ''}
                      onChange={(e) =>
                        handleFieldChange(`emergencyContact.${index}.relationship`, e.target.value)
                      }
                    />
                  ) : (
                    contact.relationship
                  )}
                </Descriptions.Item>
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
