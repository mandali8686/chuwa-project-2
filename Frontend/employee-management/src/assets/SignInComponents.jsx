import styled from '@emotion/styled';
import { Form, Card, Typography } from 'antd';
const { Title } = Typography;

/* Auth Container */
export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

/* Styled Form */
export const StyledForm = styled(Form)`
  width: 300px;
  .ant-form-item-label {
    color: #333;
  }
`;

/* Responsive Footer */
export const ResponsiveFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const CardContainer = styled(Card)`
  min-height: 100vh;
  min-width:100vw;
  background: rgba(190, 185, 185, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  box-shadow: none;
`;

export const PageContainer = styled.div`
  max-width: 80%;
  margin: 0 auto;
  padding: 24px;
`;

export const SectionTitle = styled(Title)`
  && {
    color: #8b5e3c;
    margin-bottom: 16px;
  }
`;

export const InfoCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 10px;
`;



