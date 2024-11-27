import { useState } from 'react';
import Form from './components/form';
import Crearusuarios from './components/crearusers';
import UserHome from './components/UserHome';
import BlackTube from './components/BlackTube'; // Importar BlackTube
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route index element={<Form callback={setUser} />} />

        {/* Crear usuarios */}
        <Route path="/crearusers" element={<Crearusuarios />} />

        {/* Página de UserHome con barra de navegación */}
        <Route
          path="/UserHome"
          element={
            <MainLayout>
              <UserHome user={user} />
            </MainLayout>
          }
        />

        {/* Página de BlackTube con barra de navegación */}
        <Route
          path="/BlackTube"
          element={
            <MainLayout>
              <BlackTube />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

