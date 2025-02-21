// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Card, Tabs, Form, Alert, Button, Input } from 'antd';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import EditableAvatar from '../components/profil/EditableAvatar';
import SensitiveInfo from '../components/profil/sensitiveinfo';
import PersonalInfo from '../components/profil/PersonalInfo';

const { TabPane } = Tabs;

const Profile = () => {
  const { auth, updateUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [errorPersonal, setErrorPersonal] = useState(null);
  const [successPersonal, setSuccessPersonal] = useState(null);
  const [errorSensitive, setErrorSensitive] = useState(null);
  const [successSensitive, setSuccessSensitive] = useState(null);
  const [errorTheme, setErrorTheme] = useState(null);
  const [successTheme, setSuccessTheme] = useState(null);

  const [formPersonal] = Form.useForm();
  const [formSensitive] = Form.useForm();
  const [formTheme] = Form.useForm();

  useEffect(() => {
    
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        setUserData(res.data.user);
      
        formPersonal.setFieldsValue({
          username: res.data.user.username,
          description: res.data.user.description,
          location: res.data.user.location,
          avatar: res.data.user.avatar,
        });
        formSensitive.setFieldsValue({
          email: res.data.user.email,
        });
        formTheme.setFieldsValue({
          primaryColor: res.data.user.primaryColor || '#1890ff',
        });
      } catch (err) {
        console.error('Erreur lors de la récupération du profil', err);
      }
    };

    fetchProfile();
  }, [formPersonal, formSensitive, formTheme]);


  const handlePersonalEdit = async (values) => {
    try {
      const res = await API.put('/users/profile', values);
      setUserData(res.data.user);
      updateUser(res.data.user);
      setSuccessPersonal("Profil personnel mis à jour !");
      setErrorPersonal(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil personnel', err);
      setErrorPersonal("Erreur lors de la mise à jour du profil personnel");
      setSuccessPersonal(null);
    }
  };

  
  const handleSensitiveEdit = async (values) => {
    try {
      const res = await API.put('/users/profile', values);
      setUserData(res.data.user);
      updateUser(res.data.user);
      setSuccessSensitive("Informations sensibles mises à jour !");
      setErrorSensitive(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour des informations sensibles', err);
      setErrorSensitive("Erreur lors de la mise à jour des informations sensibles");
      setSuccessSensitive(null);
    }
  };


  const handleThemeEdit = async (values) => {
    try {
      const res = await API.put('/users/profile', values);
      setUserData(res.data.user);
      updateUser(res.data.user);
      setSuccessTheme("Thème mis à jour !");
      setErrorTheme(null);
      document.documentElement.style.setProperty('--primary-color', values.primaryColor);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du thème', err);
      setErrorTheme("Erreur lors de la mise à jour du thème");
      setSuccessTheme(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <EditableAvatar
            avatarUrl={`http://localhost:5000/${userData?.avatar}`}
            onChangeAvatar={(newUrl) => {
              setUserData({ ...userData, avatar: newUrl });
              updateUser({ ...userData, avatar: newUrl });
            }}
          />
          <div style={{ marginLeft: '20px' }}>
            <h2>{userData?.username}</h2>
            <p>{userData?.email}</p>
          </div>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Informations personnelles" key="1">
            <PersonalInfo
              form={formPersonal}
              error={errorPersonal}
              success={successPersonal}
              onSubmit={handlePersonalEdit}
            />
          </TabPane>

          <TabPane tab="Informations sensibles" key="2">
            <SensitiveInfo
              form={formSensitive}
              error={errorSensitive}
              success={successSensitive}
              onSubmit={handleSensitiveEdit}
            />
          </TabPane>

          <TabPane tab="Personnalisation" key="3">
            {errorTheme && <Alert message={errorTheme} type="error" style={{ marginBottom: '20px' }} />}
            {successTheme && <Alert message={successTheme} type="success" style={{ marginBottom: '20px' }} />}
            <Form form={formTheme} layout="vertical" onFinish={handleThemeEdit}>
              <Form.Item
                label="Couleur principale"
                name="primaryColor"
                rules={[{ required: true, message: 'Veuillez choisir une couleur' }]}
              >
                <Input type="color" style={{ width: '100px' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Enregistrer la personnalisation
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
