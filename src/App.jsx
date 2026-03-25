import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home               from "./pages/Home";
import About              from "./pages/About";
import Services           from "./pages/Services";
import Portfolio          from "./pages/Portfolio";
import Contact            from "./pages/Contact";
import ClientRequirements from "./pages/ClientRequirements";
import WebsiteCalc        from "./pages/WebsiteCalc";
import Success            from "./pages/Success";
import Admin              from "./pages/Admin";

function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname === "/admin";

  return (
    <>
      {!isAdmin && <Navbar />}
      <div style={{ paddingTop: isAdmin ? 0 : 64 }}>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/about"        element={<About />} />
          <Route path="/services"     element={<Services />} />
          <Route path="/portfolio"    element={<Portfolio />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/contact/:tab" element={<Contact />} />
          <Route path="/requirements" element={<ClientRequirements />} />
          <Route path="/calc"         element={<WebsiteCalc />} />
          <Route path="/success"      element={<Success />} />
          <Route path="/admin"        element={<Admin />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Layout />
    </HelmetProvider>
  );
}