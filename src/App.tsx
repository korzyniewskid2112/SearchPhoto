import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Gallery from './components/Gallery';
import Main from './components/Main';
import NotFound from './components/NotFound';

function App() {
  return (
   <Routes>
     <Route path="/" element={<Main />}/>
     <Route path="gallery/" element={<Gallery />}/>
     <Route path="gallery/:slug/" element={<Gallery />}/>
     <Route path="*" element={<NotFound />} />
   </Routes>
  );
}

export default App;
