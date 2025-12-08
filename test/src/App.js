import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from "react";
import './App.css';

import AboutGct from './Pages/AboutGct.jsx';
import Courses from './Pages/Courses.jsx';
import Library from './Pages/Library.jsx';
import History from './Pages/History.jsx';
import StudentScanner from './Components/StudentScanner.jsx';

import Admin from './Pages/AdminPannel.jsx' ;
import BookInventory from './Pages/LibraryInventory.jsx';
import StudentUser from './Pages/StudentsUser.jsx';

function LocalhostOnly({ children }) {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return isLocalhost ? children : <Navigate to="/" replace />;
}

const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("student");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (student) => {
    localStorage.setItem("student", JSON.stringify(student));
    setUser(student);
  };

  const logout = () => {
    localStorage.removeItem("student");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
            <Routes>
              <Route path='/' element={<AboutGct />} />
              <Route path='/Courses' element={<Courses />} />
              <Route path='/Library' element={<Library />} />
              <Route path='/History' element={<History />} />
              <Route path='/QRscann' element={<StudentScanner />} />
              <Route
                path='/Admin'
                element={
                  <LocalhostOnly>
                    <Admin />
                  </LocalhostOnly>
                }
              />
              <Route
                path='/BookInventory'
                element={
                  <LocalhostOnly>
                    <BookInventory />
                  </LocalhostOnly>
                }
              />
              <Route
                path='/StudentUser'
                element={
                  <LocalhostOnly>
                    <StudentUser />
                  </LocalhostOnly>
                }
              />
            </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
export { useAuth };
/* Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Remotesigned */