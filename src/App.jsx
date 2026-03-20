import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Trainings from './pages/Trainings.jsx';
import Services from './pages/Services.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Success from "./pages/Success.jsx";
import Store from './pages/Store.jsx';
import WebsiteCalc from './pages/WebsiteCalc.jsx';
import ClientRequirements from './pages/ClientRequirements.jsx';

export default function App() {
  const location = useLocation();
  const isPrivate = ['/calc', '/requirements'].includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <Helmet>
        <meta name="google-adsense-account" content="ca-pub-8623456276380303" />
      </Helmet>

      {!isPrivate && <Header />}

      <main className={!isPrivate ? 'pt-20 flex-1' : 'flex-1'}>
        <Routes>
          <Route path="/"             element={<Home />}               />
          <Route path="/trainings"    element={<Trainings />}          />
          <Route path="/services"     element={<Services />}           />
          <Route path="/about"        element={<About />}              />
          <Route path="/contact"      element={<Contact />}            />
          <Route path="/success"      element={<Success />}            />
          <Route path="/store"        element={<Store />}              />
          <Route path="/calc"         element={<WebsiteCalc />}        />
          <Route path="/requirements" element={<ClientRequirements />} />
        </Routes>
      </main>

      {!isPrivate && <Footer />}
    </div>
  );
}