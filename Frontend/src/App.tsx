// App.tsx
import { Routes } from 'react-router';
import { Route } from 'react-router';

import LoginPage from './Pages/LoginPage/LoginPage.tsx';
import AboutPage from './Pages/AboutPage/AboutPage.tsx';
import AdminPage from './Pages/AdminPage/AdminPage.tsx';
import MainPage from './Pages/MainPage/MainPage.tsx';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage.tsx';
function App() {
  
  return (
    <>
    <Routes>
      <Route path='/WebMail'element={<MainPage/>}/>
      <Route path='/Login'element={<LoginPage/>}/>
      <Route path='/Admin'element={<AdminPage/>}/>
      <Route path='/About'element={<AboutPage/>}/>
      <Route path='*'element={<NotFoundPage/>}/>
    </Routes>
  </>);
}
export default App;
