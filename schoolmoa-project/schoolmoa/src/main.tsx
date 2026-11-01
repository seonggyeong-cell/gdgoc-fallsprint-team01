// [담당: 역할 D] 진입점
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProviderRoot } from './features/auth/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AuthProviderRoot>
    <App />
  </AuthProviderRoot>,
);
