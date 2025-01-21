import { useState } from 'react';
import './styles/App.css';
import AppRouter from './routes/AppRoutes.jsx';
import NavBar from './components/NavBar.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { isAuthenticated } = useAuth();
  const [isNavHidden, setIsNavHidden] = useState(false);

  const handleToggleNav = (isHidden) => {
    setIsNavHidden(isHidden);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        {isAuthenticated && <NavBar isHidden={isNavHidden} onToggleNav={handleToggleNav}/>}
        <div style={{ flex: 1,marginLeft: isAuthenticated && !isNavHidden ? '250px' : '0', 
          transition: 'margin-left 0.3s ease' }}>
          <AppRouter />
        </div>
      </div>
    </>
  );
}

export default App
