import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from "./context/AppContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppProvider>
    <App />
  </AppProvider>
  </BrowserRouter>,
)
