import React, { useState, useEffect } from 'react';
import { Upload, Modal, Image, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import API from '../../services/api';

// Fonction utilitaire pour convertir le fichier en base64 (pour le preview)
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

// Fonction pour normaliser l'URL en supprimant les slashes en trop
const normalizeUrl = (url) => url.replace(/([^:]\/)\/+/g, '$1');

const EditableAvatar = ({ avatarUrl, onChangeAvatar }) => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);

  // Au chargement ou à la mise à jour, si un avatar existe, on initialise le fileList
  useEffect(() => {
    if (avatarUrl) {
      const normalizedUrl = normalizeUrl(avatarUrl);
      setFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: normalizedUrl,
        },
      ]);
    } else {
      // S'il n'y a pas d'avatar, on vide la fileList
      setFileList([]);
    }
  }, [avatarUrl]);

  // Affichage du preview de l'image
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // Mise à jour de fileList et notification du parent après upload réussi
  const handleChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status === 'done' && file.response) {
      // On suppose que la réponse renvoie { message: 'Avatar mis à jour.', user }
      const updatedUser = file.response.user;
      const newUrl = updatedUser.avatar;
      onChangeAvatar(newUrl);
    }
  };

  // Upload personnalisé via Axios sur votre API (PUT)
  const customRequest = async ({ file, onProgress, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('avatar', file);
    setLoading(true);
    try {
      const response = await API.put('users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress({ percent });
        },
      });
      onSuccess(response.data, file);
      setLoading(false);
    } catch (error) {
      message.error("Erreur lors du téléchargement de l'avatar");
      onError(error);
      setLoading(false);
    }
  };

  // Suppression de l'avatar côté front et appel de la route DELETE du back
  const handleRemove = async (file) => {
    try {
      const response = await API.delete('users/profile/avatar');
      message.success(response.data.message);
      setFileList([]);           // On vide la liste des fichiers
      setPreviewImage('');       // On nettoie le preview
      setPreviewVisible(false);  // On ferme la modale si ouverte
      onChangeAvatar(null);      // On informe le parent qu'il n'y a plus d'avatar
    } catch (error) {
      message.error("Erreur lors de la suppression de l'avatar");
    }
  };

  // Bouton d'upload : s'affiche "Ajouter" si aucun avatar n'est présent, sinon "Modifier"
  const uploadButton = (
    <div style={{ textAlign: 'center' }}>
      <PlusOutlined style={{ fontSize: '24px' }} />
      <div style={{ marginTop: 8 }}>{fileList.length > 0 ? "Modifier" : "Ajouter"}</div>
    </div>
  );

  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        fileList={fileList}
        customRequest={customRequest}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        disabled={loading}
        style={{ borderRadius: '80%', overflow: 'hidden' }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewImage && <Image src={previewImage} alt="avatar" style={{ width: '100%' }} />}
      </Modal>
    </>
  );
};

export default EditableAvatar;
