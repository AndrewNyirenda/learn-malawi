import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NewsProvider } from './contexts/NewsContext'
import {StudyNotesProvider} from './contexts/StudyNotesContext';
import {PastPapersProvider} from './contexts/PastPapersContext';
import {CareerResourcesProvider} from './contexts/CareerResourcesContext';
import {TutorialsProvider} from './contexts/TutorialsContext';
import {QuizzesProvider} from './contexts/QuizzesContext';

import {ContactProvider} from './contexts/ContactContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <StudyNotesProvider>
    <ContactProvider>
    <PastPapersProvider>
    <CareerResourcesProvider>
     <TutorialsProvider>
      <QuizzesProvider>
      
      <NewsProvider>
        <App />
      </NewsProvider>
      </QuizzesProvider>
      </TutorialsProvider>
      </CareerResourcesProvider>
      </PastPapersProvider>
      </ContactProvider>
    </StudyNotesProvider>
    </BrowserRouter>
  </StrictMode>,
)