import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import RoutesComponent from "./components/Routes";
import {SearchProvider} from './components/SearchContext'
function App() {
  return (
    <SearchProvider>
      <>
      <Header />
      <RoutesComponent /> 
    </>
    </SearchProvider>
    
  );
}

export default App;
