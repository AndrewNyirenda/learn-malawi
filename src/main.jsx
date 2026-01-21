import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NewsProvider } from './contexts/NewsContext'
import {StudyNotesProvider} from './contexts/StudyNotesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <StudyNotesProvider>
      <NewsProvider>
        <App />
      </NewsProvider>
    </StudyNotesProvider>
    </BrowserRouter>
  </StrictMode>,
)