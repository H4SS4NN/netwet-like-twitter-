import React from 'react';
import { Form, Input, Button, Alert } from 'antd';

const PersonalInfo = ({ form, error, success, onSubmit }) => {
  return (
    <div>
      {error && (
        <Alert message={error} type="error" style={{ marginBottom: '20px' }} />
      )}
      {success && (
        <Alert message={success} type="success" style={{ marginBottom: '20px' }} />
      )}
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item 
          label="Nom d'utilisateur" 
          name="username" 
          rules={[{ required: true, message: 'Ce champ est requis' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Localisation" name="location">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enregistrer les modifications
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PersonalInfo;
