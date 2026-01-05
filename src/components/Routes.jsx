import { Routes, Route } from "react-router-dom";
import LandingPage from "./Landing_page";
import CareerResources from "../pages/CareerResources";
import PastPapers from "../pages/PastPapers";
import Quizes from "../pages/Quizes";
import StudyNotes from "../pages/StudyNotes";
import Tutorials from "../pages/Tutorials";
import About from "../pages/Abouts";
import Contact from "../pages/Contact";
import News from "../pages/News";
import NewsFullStory from "../pages/news-full-story";



const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/study-notes" element={<StudyNotes />} />
      <Route path="/past-papers" element={<PastPapers />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/quizes" element={<Quizes />} />
      
      <Route path="/news" element={<News />} />


<Route path="/news/:id" element={<NewsFullStory />} />
      
      
      
      <Route path="/career-resources" element={<CareerResources />} />
      <Route path="/abouts" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
    </Routes>
  );
};

export default RoutesComponent;