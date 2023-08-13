import React from 'react';

import './App.css';
import Main from './routes/Main';
import Header from './layout/Header';
import Footer from './layout/Footer';

const App: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

export default App;
