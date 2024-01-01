import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider, useCookies } from 'react-cookie';

import Layout from './pages/Layout.js'
import Home from './pages/Home.js'
import Events from './pages/Events.js'
import SingleEvent from './pages/SingleEvent.js'
import PlayerProfile from './pages/PlayerProfile.js'
import Login from './pages/Login.js'
import Logout from './pages/Logout.js';
import Error from './pages/Error.js'

import "./style.css"


export default function App() {

  const [cookies, setCookie, removeCookie] = useCookies(["user"])
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultError = { referrer: "/", error: "This is an error." }

  function login(user) {
    setCookie("sessionID", user, { path: "/" });
  }

  function logout() {
    removeCookie("sessionID", { path: "/" })
  }

  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_BACKENDAPI}/session`, { withCredentials: true }).then(response => {
      setUser(response.data.player);
      setLoading(false);
    })
  }, [])

  if (loading) return <p>Loading...</p>

  console.log(user);

  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout auth={user} />} >
            <Route index element={<Home />} />
            <Route path="/events" element={<Events auth={user} />} />
            <Route path="/events/:id" element={<SingleEvent auth={user} />} />
            <Route path="/players/:id" element={<PlayerProfile auth={user} />} />
            <Route path="/login" element={<Login auth={user} onLogin={login} />} />
            <Route path="/logout" element={<Logout auth={user} onLogout={logout} />} />
            <Route path="/error" element={<Error error={defaultError} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
