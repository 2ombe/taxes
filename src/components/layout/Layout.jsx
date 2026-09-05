import React from 'react';
import Navigation from '../common/Navigation';
import Footer from '../common/Footer';
import AIAdvisor from '../ai/AIAdvisor';

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
      <AIAdvisor />
    </>
  );
};

export default Layout;
