// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Form, Input, Button, Alert, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../pages/login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', values);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div
      className="card-login"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height pour centrer verticalement
      }}
    >
      <Card title="Connexion" style={{ width: 400 }}>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            
            name="email"
            rules={[
              { required: true, message: 'Veuillez entrer votre email' },
              { type: 'email', message: 'Email invalide' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
           
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
          >
            <Input.Password placeholder="Mot de passe" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Se connecter
            </Button>
          </Form.Item>
          <Form.Item>
            Pas de compte ?<a href="/signup"> S'inscrire</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
