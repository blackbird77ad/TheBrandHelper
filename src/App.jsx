import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Trainings from './pages/Trainings.jsx';
import Services from './pages/Services.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
        <Header />

        <main className="pt-20 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
