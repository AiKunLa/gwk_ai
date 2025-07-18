import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  BrowserRouter as Router,
} from "react-router-dom";

import GlobalContextProvider from './context/GlobalContextProvider.jsx'
createRoot(document.getElementById('root')).render(
    <GlobalContextProvider>
      <Router>
        <App />
      </Router>
    </GlobalContextProvider>
)
