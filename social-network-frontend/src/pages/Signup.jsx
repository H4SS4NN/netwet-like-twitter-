import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';


const { Title } = Typography;

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', values);
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            background: 'url("path-to-your-background-image.jpg") no-repeat center center fixed', 
            backgroundSize: 'cover' 
        }}>
            <div style={{ 
                maxWidth: 400, 
                width: '100%', 
                padding: '20px', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
            }}>
                <Title level={2}>Inscription</Title>
                {error && <Alert message={error} type="error" showIcon />}
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        
                        name="username"
                        rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisateur!' }]}
                    >
                        <Input value={username} placeholder="Username" prefix={<UserOutlined />} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Item>
                    <Form.Item
            
                        name="email"
                        rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
                    >
                        <Input type="email" placeholder="Adresse mail" prefix={<MailOutlined />} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        
                        name="password"
                        rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
                    >
                        <Input.Password placeholder="Mot de passe" prefix={<LockOutlined />} value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            S'inscrire
                        </Button>
                    </Form.Item>
                     <Form.Item>
                        Vous possedez un compte ? <a href="/login">Se connecter</a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Signup;
