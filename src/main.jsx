import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NewsProvider } from './contexts/NewsContext'
import {StudyNotesProvider} from './contexts/StudyNotesContext';
import {PastPapersProvider} from './contexts/PastPapersContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <StudyNotesProvider>
    <PastPapersProvider>
      <NewsProvider>
        <App />
      </NewsProvider>
      </PastPapersProvider>
    </StudyNotesProvider>
    </BrowserRouter>
  </StrictMode>,
)