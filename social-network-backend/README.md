# Social Network Backend

Ce projet constitue le backend d'un réseau social développé avec Node.js, Express et Sequelize (MySQL). Il gère l'authentification, les utilisateurs, les posts (création, mise à jour, suppression, likes, commentaires) et les messages.

## Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement du serveur](#lancement-du-serveur)
- [Structure des dossiers](#structure-des-dossiers)
- [API Endpoints](#api-endpoints)
- [Utilisation de Multer pour les fichiers](#utilisation-de-multer-pour-les-fichiers)
- [WebSocket](#websocket)
- [Journalisation](#journalisation)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/votre-utilisateur/social-network-backend.git
cd social-network-backend
```

Installer les dépendances :

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet et définissez-y les variables d'environnement nécessaires. Par exemple :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_utilisateur
DB_PASS=votre_mot_de_passe
DB_NAME=social_network
JWT_SECRET=votre_secret_jwt
```

## Lancement du serveur

Avant de lancer le serveur, assurez-vous que votre base de données est configurée et accessible.

Pour synchroniser la base de données et démarrer le serveur, exécutez :

```bash
npm start
```

Le serveur démarre sur le port défini dans votre fichier `.env` (par défaut 5000).

## Structure des dossiers

```
/social-network-backend
│   app.js
│   .env
│   package.json
│
├── controllers/
│   ├── userController.js
│   ├── postController.js
│   ├── commentController.js
│   ├── messageController.js
│
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Like.js
│   ├── Message.js
│
├── routes/
│   ├── index.js
│   ├── userRoutes.js
│   ├── postRoutes.js
│   ├── messageRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── upload.js
│   ├── uploadAvatar.js
│
├── config/
│   ├── database.js
│   ├── logger.js
```

## API Endpoints

### Utilisateurs

- `GET /api/users/profile` → Récupère le profil de l'utilisateur connecté.
- `PUT /api/users/profile` → Met à jour les informations du profil de l'utilisateur.
- `GET /api/users` → Récupère la liste de tous les utilisateurs.

### Posts

- `POST /api/posts` → Crée un nouveau post.
- `GET /api/posts` → Récupère tous les posts.
- `GET /api/posts/:id` → Récupère un post par son ID.
- `PUT /api/posts/:id` → Met à jour un post.
- `DELETE /api/posts/:id` → Supprime un post.
- `POST /api/posts/:id/like` → Ajoute un like à un post.
- `DELETE /api/posts/:id/like` → Retire le like d'un post.
- `DELETE /api/posts/admin/:id` → Permet à un administrateur de supprimer un post.

### Commentaires

- `POST /api/posts/:postId/comments` → Ajoute un commentaire à un post.
- `GET /api/posts/:postId/comments` → Récupère tous les commentaires d'un post.
- `DELETE /api/comments/:commentId` → Supprime un commentaire.

### Messages

- `POST /api/messages` → Envoie un message entre utilisateurs.
- `GET /api/messages/:conversationWith` → Récupère les messages d'une conversation.

## Utilisation de Multer pour les fichiers

Le middleware `upload.js` (pour les posts) et `uploadAvatar.js` (pour les avatars) gère l'upload des fichiers images. Les fichiers sont enregistrés dans le dossier `uploads/` (ou `uploads/avatars` pour les avatars).

## WebSocket

Si vous souhaitez intégrer une communication en temps réel (chat, notifications), vous pouvez ajouter une implémentation de WebSocket (par exemple avec `Socket.io`).

Exemple d'utilisation : Créez un fichier `socket.js` et intégrez-le dans votre serveur Express après le démarrage.

## Journalisation

Le fichier de configuration `config/logger.js` permet de configurer la journalisation des événements et erreurs.

## Contribuer

Les contributions sont les bienvenues !

1. Forkez le dépôt.
2. Créez votre branche de fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos modifications (`git commit -am 'Ajout de ma fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
