import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Result from "./pages/result";
import Admin from "./pages/admin";
import AddNew from "./pages/add_new.jsx";

import NotFound from "./pages/404.jsx";



function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add_new" element={<AddNew />} />    
        <Route path="/*"  element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
