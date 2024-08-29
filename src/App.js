import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/sass/shareStyle.scss";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import AboutPage from "./components/AboutPage";
import HourOrder from "./components/Order/HourOrder";
import DayOrder from "./components/Order/DayOrder";
import CustomOrder from "./components/Order/CustomOrder";
import OrderDetail from "./components/OrderDetail";
import NavbarPage from "./components/NavbarPage";
import FooterPage from "./components/FooterPage";

function App() {
  return (
    <Router>
      <NavbarPage />
      <div className="container">
        <div className="content">
          <Routes>
            <Route path="/" index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />{" "}
            {/* Fallback route for 404 */}
            {/* ORDER */}
            <Route path="/hourlyOrder" element={<HourOrder />} />
            <Route path="/dailyOrder" element={<DayOrder />} />
            <Route path="/customOrder" element={<CustomOrder />} />
            <Route path="/orderDetail/:orderId" element={<OrderDetail />} />
          </Routes>
        </div>
      </div>
      <FooterPage />
    </Router>
  );
}

export default App;
