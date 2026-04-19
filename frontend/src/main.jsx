import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right" autoClose={3000} hideProgressBar={false}
        theme="dark" newestOnTop closeOnClick pauseOnHover
        toastStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, fontSize:13 }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
