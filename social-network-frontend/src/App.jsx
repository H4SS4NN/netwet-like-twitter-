import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';

import { SocketProvider } from './context/SocketContext';
import RequireAuth from './context/RequireAuth';
import AppHeader from './components/utils/AppHeader';
import Navbar from './components/utils/Navbar';

import { Layout } from 'antd';
import UserList from './components/messages/Userslist';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Conversations from './pages/Conversations'; // 🚀 Ajouter la page des discussions
import Chat from './pages/Chat'; // 🚀 Modifier l'import

const { Content, Sider } = Layout;

const AppLayout = ({ children }) => (
  <>
    <AppHeader />
    <Layout style={{ minHeight: '100vh', marginTop: '64px' }}>
      <Sider width={280} style={{ background: '#fff', padding: '20px' }}>
        <Navbar />
      </Sider>
      <Layout style={{ flex: 1, padding: '20px' }}>
        <Content>{children}</Content>
      </Layout>
      <Sider width={280} style={{ background: '#fff', padding: '20px' }}>
        <UserList />
      </Sider>
    </Layout>
  </>
);

const App = () => (
  <AuthProvider>
   
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Routes protégées */}
            <Route path="/*" element={
              <RequireAuth>
                <PostProvider>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/conversations" element={<Conversations />} /> {/* ✅ Page discussions */}
                      <Route path="/chat/:conversationId" element={<Chat />} /> {/* ✅ Page de chat */}
                    </Routes>
                  </AppLayout>
                </PostProvider>
              </RequireAuth>
            } />
          </Routes>
        </Router>
      </SocketProvider>
   
  </AuthProvider>
);

export default App;



// Styles améliorés
const styles = {
  siderLeft: {
    background: '#fff',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  siderRight: {
    background: '#fff',
    padding: '20px',
    color: '#fff',
    borderRadius: '8px 0 0 8px',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
  },
  content: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  },
};


