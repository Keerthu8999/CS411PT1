import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
//import useAuthCheck from './hooks/AuthCheck';
import LoginPage from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderNav from './Navbar';
import DataViz from './DataViz';
import Dashboard from './Dashboard';
import SignupPage from './SignupPage';
import UserProfilePage from './UserProfile';


const RootComponent = () => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />;
  };

function App() {
    

    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootComponent />
        },
        {
            path: "/login",
            element: <LoginPage />
        },
        {
            path: "/signup",
            element: <SignupPage />
        },
        {
            path: "/userprofile",
            element: <Container>
            <Row>
                <HeaderNav />
            </Row>
            <Row>
            <UserProfilePage />
            </Row>
            </Container>
            
        },
        {
            path: "/main",
            element: <Container>
            <Row>
                <HeaderNav />
            </Row>
            <Row>
                <p>Choose tab</p>
            </Row>
            </Container>
        },
        {
            path: "/main/dashboard",
            element: <Container>
                <Row>
                    <HeaderNav />
                </Row>
                <Row>
                <Dashboard/>
                </Row>
                </Container>
        },
        {
            path: "/main/data",
            element: <Container>
                <Row>
                    <HeaderNav />
                </Row>
                <Row>
                    <DataViz />
                </Row>
                </Container>
        }
      ]);

  return (
     <RouterProvider router={router} fallbackElement={<p>Some error seems to have occured</p>} >
     </RouterProvider>
  );
}

export default App;