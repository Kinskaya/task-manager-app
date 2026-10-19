import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ListsPage, LoginPage, TasksPage } from './pages';
import { MainLayout } from './components/MainLayout.tsx';

const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';

function RequireAuth() {
  return isAuthenticated() ? <Outlet/> : <Navigate to="/login" replace/>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route element={<RequireAuth/>}>
          <Route element={<MainLayout/>}>
            <Route path="/lists" element={<ListsPage/>}/>
            <Route path="/lists/:listId" element={<TasksPage/>}/>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated() ? '/lists' : '/login'} replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
