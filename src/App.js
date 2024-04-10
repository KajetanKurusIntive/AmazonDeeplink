import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AmazonIntentBuilder from './AmazonIntentBuilder';
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/" element={<AmazonIntentBuilder />} />
          <Route path="/AmazonDeeplink" element={<AmazonIntentBuilder />} />
          {/* Add other routes if needed */}
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;