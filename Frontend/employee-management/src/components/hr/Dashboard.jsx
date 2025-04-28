import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { PageContainer, InfoCard, SectionTitle } from "../../assets/SignInComponents";

const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <SectionTitle level={2}>HR Dashboard</SectionTitle>

      <InfoCard>
        <Title level={4}>Quick Actions</Title>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "16px" }}>
          <Button
            type="primary"
            onClick={() => navigate("/hr/register-token")}
            style={{ minWidth: "200px" }}
          >
            Generate Onboarding Token
          </Button>
          <Button
            type="primary"
            onClick={() => navigate("/hr/employees")}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", minWidth: "200px" }}
          >
            View Employee List
          </Button>
          {/* <Button
            type="primary"
            onClick={() => navigate("/hr/documents")}
            style={{ backgroundColor: "#722ed1", borderColor: "#722ed1", minWidth: "200px" }}
          >
            Review Documents
          </Button> */}
        </div>
      </InfoCard>
    </PageContainer>
  );
};

export default Dashboard;
