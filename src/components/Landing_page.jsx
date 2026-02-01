import React, { useContext, useEffect } from 'react';
import Header from "./Header";
import "../styles/landing_page.css";
import Services from './landing-page/Services';
import EduResources from './landing-page/EduResources';
import Committment from './landing-page/Committment';
import Footer from "./Footer";
import { SearchContext } from '../components/SearchContext';
import HeroSection from './landing-page/HeroSection';

const LandingPage = () => {
  const { query, results, setResults, showResults, setShowResults } = useContext(SearchContext);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = allResources.filter(
      (res) =>
        res.title.toLowerCase().includes(query.toLowerCase()) ||
        res.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setShowResults(true);
  }, [query]);

  return (
    <div className="LandingPageWrapper">
      <Header />

      {showResults ? (
        <div className="search-results">
          
        </div>
      ) : (
        <>
          <HeroSection />
          <EduResources />
          <Services />
          <Committment />
        </>
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;