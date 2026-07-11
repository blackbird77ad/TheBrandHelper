import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Services = React.lazy(() => import("./pages/Services"));
const Portfolio = React.lazy(() => import("./pages/Portfolio"));
const Contact = React.lazy(() => import("./pages/Contact"));
const WebDevelopment = React.lazy(() => import("./pages/WebDevelopment"));
const ClientRequirements = React.lazy(() => import("./pages/ClientRequirements"));
const WebsiteCalc = React.lazy(() => import("./pages/WebsiteCalc"));
const BlueprintBuilder = React.lazy(() => import("./pages/BlueprintBuilder"));
const Phase2 = React.lazy(() => import("./pages/Phase2"));
const Success = React.lazy(() => import("./pages/Success"));
const Admin = React.lazy(() => import("./pages/Admin"));

function PageFallback({ isAdmin }) {
  return (
    <div className={`flex min-h-[55vh] items-center justify-center ${isAdmin ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="text-center">
        <p className="text-lg font-extrabold">
          The Brand<span className="text-red-600">Helper</span>
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-400">Loading</p>
      </div>
    </div>
  );
}

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function ScrollToTop({ targetRef }) {
  const location = useLocation();
  const { pathname, search } = location;
  const previousRouteRef = React.useRef("");
  const skipDeferredScrollRef = React.useRef(false);

  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  React.useLayoutEffect(() => {
    const route = `${pathname}${search}`;
    const isSameRouteHashJump = previousRouteRef.current === route && Boolean(location.hash);
    skipDeferredScrollRef.current = isSameRouteHashJump;
    previousRouteRef.current = route;
    if (isSameRouteHashJump) return;
    scrollToPageTop();
    targetRef.current?.focus({ preventScroll: true });
  }, [location.hash, location.key, pathname, search, targetRef]);

  React.useEffect(() => {
    if (skipDeferredScrollRef.current) return undefined;
    const frame = window.requestAnimationFrame(scrollToPageTop);
    const timeout = window.setTimeout(scrollToPageTop, 120);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [location.hash, location.key, pathname, search]);

  return null;
}

function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const isAdmin = pathname === "/admin";
  const mainRef = React.useRef(null);

  return (
    <>
      <ScrollToTop targetRef={mainRef} />
      {!isAdmin && (
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
      )}
      {!isAdmin && <Navbar />}
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="outline-none"
        aria-label={isAdmin ? "Admin content" : "Main content"}
        style={{ paddingTop: isAdmin ? 0 : 64 }}
      >
        <React.Suspense fallback={<PageFallback isAdmin={isAdmin} />}>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/about"        element={<About />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/services"     element={<Services />} />
            <Route path="/portfolio"    element={<Portfolio />} />
            <Route path="/ai-data"      element={<Phase2 mode="data" />} />
            <Route path="/ai-projects"  element={<Phase2 mode="projects" />} />
            <Route path="/talent"       element={<Phase2 mode="talent" />} />
            <Route path="/digital-products" element={<Phase2 mode="products" />} />
            <Route path="/contact"      element={<Contact />} />
            <Route path="/contact/:tab" element={<Contact />} />
            <Route path="/blueprint"    element={<BlueprintBuilder />} />
            <Route path="/requirements" element={<ClientRequirements />} />
            <Route path="/calc"         element={<WebsiteCalc />} />
            <Route path="/success"      element={<Success />} />
            <Route path="/admin"        element={<Admin />} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return <Layout />;
}
