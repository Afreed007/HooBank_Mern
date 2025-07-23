import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "./style";
import { Navbar, Hero, Business, Stats, Billing, CardDeal, Testimonials, Clients, CTA, Footer, LoginModal, Dashboard } from "./components";

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <div className="bg-primary w-full overflow-hidden">
              <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Navbar />
                </div>
              </div>

              <div className={`bg-primary ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                  <Hero setIsLoginOpen={setIsLoginOpen} />
                </div>
              </div>

              <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter} ml-10`}>
                <div className={`${styles.boxWidth}`}>
                  <Stats />
                  <Business />
                  <Billing />
                  <CardDeal />
                  <Testimonials />
                  <Clients />
                  <CTA isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
                  <Footer />
                </div>
              </div>

              {/* Login Modal */}
              <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </div>
          }
        />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
