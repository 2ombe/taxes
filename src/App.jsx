import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Strategy from './pages/Strategy';
import Contact from './pages/Contact';
import TaxComputation from './pages/TaxComputation';
import VATCalculator from './pages/VATCalculator';
import PAYECalculator from './pages/PAYECalculator';
import WHTCalculator from './pages/WHTCalculator';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Tax Tools — open to all (results shown, save requires login) */}
          <Route path="/vat" element={<VATCalculator />} />
          <Route path="/paye" element={<PAYECalculator />} />
          <Route path="/wht" element={<WHTCalculator />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tax-engine" element={<ProtectedRoute><TaxComputation /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
