import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const SensitiveInfo = () => {
  const { auth, updateUser } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pré-remplir l'email à partir des informations du contexte
  useEffect(() => {
    if (auth.user) {
      form.setFieldsValue({
        email: auth.user.email,
      });
    }
  }, [auth.user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Envoi des données au back via la route /profile/sensitive
      const response = await API.put('users/profile/sensitive', values);
      updateUser(response.data.user);
      setSuccess("Informations sensibles mises à jour !");
      // Réinitialiser les champs de mot de passe
      form.resetFields(['oldPassword', 'newPassword']);
    } catch (err) {
      setError("Erreur lors de la mise à jour des informations sensibles");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Veuillez saisir votre email.' },
            { type: 'email', message: 'Veuillez saisir un email valide.' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="oldPassword"
          label="Ancien mot de passe"
          dependencies={['newPassword']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('newPassword') && !value) {
                  return Promise.reject("Veuillez saisir l'ancien mot de passe.");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password placeholder="Saisir uniquement si vous changez le mot de passe" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Nouveau mot de passe"
          rules={[
            {
              validator: (_, value) => {
                if (value && value.length < 12) {
                  return Promise.reject("Le mot de passe doit contenir au moins 12 caractères.");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder="Laisser vide si inchangé" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Enregistrer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SensitiveInfo;
