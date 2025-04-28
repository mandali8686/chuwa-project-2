import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateToken } from "../../features/hr/hrSlice";
import { PageContainer, InfoCard, SectionTitle } from "../../assets/SignInComponents";
import { Input, Button, Typography, Alert, Spin } from "antd";

const { Paragraph, Text } = Typography;

const RegisterToken = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { token, loading, error } = useSelector((state) => state.hr);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }
    dispatch(generateToken({ email }));
  };

  return (
    <PageContainer>
      <SectionTitle level={2}>Generate Onboarding Token</SectionTitle>
      <InfoCard>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter employee email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: 16, width: 300 }}
          />
          <Button type="primary" htmlType="submit" loading={loading}>
            Email Token
          </Button>
        </form>
        {token && (
          <Paragraph style={{ marginTop: 24 }}>
            🎉 <Text strong>Token Generated:</Text>{" "}
            <code style={{ color: "#389e0d", background: "#f6ffed", padding: "2px 6px", borderRadius: "4px" }}>
              {token}
            </code>
            Employee Registration Email Sent.
          </Paragraph>
        )}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </InfoCard>
    </PageContainer>
  );
};

export default RegisterToken;
