import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments, deleteDocument } from "../../features/hr/hrSlice";
import { PageContainer, InfoCard, SectionTitle } from "../../assets/SignInComponents";
import { Button, Typography, List, Spin, Alert, Popconfirm } from "antd";

const { Paragraph } = Typography;

const DocumentReview = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.hr);
  const documentList = documents || [];  // ✅ Safe fallback

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteDocument(id));
  };

  return (
    <PageContainer>
      <SectionTitle level={2}>Uploaded Documents</SectionTitle>

      {loading ? (
        <Spin tip="Loading documents..." size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : documentList.length === 0 ? (
        <Alert message="No documents found." type="info" showIcon />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={documentList}  // ✅ Use safe array here
          renderItem={(doc) => (
            <InfoCard key={doc._id}>
              <Paragraph>
                <strong>Employee ID:</strong> {doc.employeeId}
              </Paragraph>
              <Paragraph>
                <strong>Type:</strong> {doc.docType}
              </Paragraph>
              <Paragraph>
                <strong>File Name:</strong> {doc.fileName}
              </Paragraph>
              <Paragraph>
                <strong>Uploaded:</strong> {new Date(doc.uploadedAt).toLocaleString()}
              </Paragraph>
              <Popconfirm
                title="Are you sure to delete this document?"
                onConfirm={() => handleDelete(doc._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>
            </InfoCard>
          )}
        />
      )}
    </PageContainer>
  );
};

export default DocumentReview;
