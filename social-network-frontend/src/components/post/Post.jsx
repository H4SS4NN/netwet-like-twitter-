// src/components/PostModal.jsx
import React, { useState, useContext } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import API from '../../services/api';
import { PostContext } from '../../context/PostContext';

const PostModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const { addPost } = useContext(PostContext);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      const formData = new FormData();
      formData.append('content', values.content);
      if (values.image && values.image.file) {
        formData.append('image', values.image.file);
      }
      setUploading(true);
      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Post créé avec succès');
      
      addPost(res.data.post);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de la création du post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Créer un post"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Annuler
        </Button>,
        <Button key="submit" type="primary" loading={uploading} onClick={handleOk}>
          Publier
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="content"
          label="Contenu"
          rules={[{ required: true, message: 'Veuillez écrire du contenu pour le post' }]}
        >
          <Input.TextArea rows={4} placeholder="Quoi de neuf ?" />
        </Form.Item>
        <Form.Item name="image" label="Image (optionnel)">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Choisir une image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostModal;
