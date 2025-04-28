import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../features/hr/hrSlice";
import { patchUser } from "../../features/employee/index"; 
import { PageContainer, InfoCard, SectionTitle } from "../../assets/SignInComponents";
import { Typography, Select, Input, Spin, Alert, Button, List } from "antd";
import { useNavigate } from "react-router-dom";

const { Paragraph } = Typography;
const { Option } = Select;

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.hr);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleChange = (userId, field, value) => {
    dispatch(
      patchUser({
        userId,
        updatedData: {
          onboading: { [field]: value },
        },
      })
    );
  };

  const handlePreviewOrDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <PageContainer>
      <Button
        type="primary"
        onClick={() => navigate("/hr/dashboard")}
        style={{ minWidth: "200px", marginBottom: "16px" }}
      >
        Dashboard
      </Button>
      <SectionTitle level={2}>Employee List with Documents</SectionTitle>

      {loading ? (
        <Spin tip="Loading employees..." size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        employees.map((emp) => (
          <InfoCard key={emp._id}>
            <Paragraph>
              <strong>Username:</strong> {emp.username}
            </Paragraph>
            <Paragraph>
              <strong>Email:</strong> {emp.email}
            </Paragraph>
            <Paragraph>
              <strong>Status:</strong> {emp.onboading?.status || "N/A"}
            </Paragraph>
            <Paragraph>
              <strong>Feedback:</strong> {emp.onboading?.feedback || "N/A"}
            </Paragraph>

            <div style={{ marginTop: 16, marginBottom: 24 }}>
              <Select
                defaultValue={emp.onboading?.status || "Pending"}
                style={{ width: 180, marginRight: 16 }}
                onChange={(value) => handleChange(emp._id, "status", value)}
              >
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>

              <Input
                placeholder="Feedback"
                defaultValue={emp.onboading?.feedback || ""}
                style={{ width: 300 }}
                onBlur={(e) => handleChange(emp._id, "feedback", e.target.value)}
              />
            </div>

            {/* 🟢 Documents Section */}
            <SectionTitle level={4}>Uploaded Documents</SectionTitle>
            {emp.visa?.documents && emp.visa.documents.length > 0 ? (
              <List
                size="small"
                dataSource={emp.visa.documents}
                renderItem={(doc) => (
                  <List.Item>
                    <Paragraph>
                      <strong>{doc.docType}:</strong> {doc.fileName}
                      <Button
                        type="link"
                        onClick={() => handlePreviewOrDownload(doc.fileData)}
                        style={{ marginLeft: 12 }}
                      >
                        Preview / Download
                      </Button>
                    </Paragraph>
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph>No documents uploaded.</Paragraph>
            )}
          </InfoCard>
        ))
      )}
    </PageContainer>
  );
};

export default EmployeeList;
