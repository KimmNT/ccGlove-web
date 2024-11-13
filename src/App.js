import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
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
import ContactPage from "./components/ContactPage";
import OrderPage from "./components/Order/OrderPage";
import InforOrder from "./components/Order/InforOrder";
import SummaryOrder from "./components/Order/SummaryOrder";
import PaymentOrder from "./components/Order/PaymentOrder";
import SuccessPage from "./components/SuccessPage";
import Testing from "./components/Testing";
import AdminPage from "./components/Management/AdminPage";
import StaffPage from "./components/Management/StaffPage";
import LoginPage from "./components/Management/LoginPage";
import HistoryPage from "./components/HistoryPage";
import ProtectedRoute from "./ProtectedRoute";
import YearroundOrder from "./components/Order/YearroundOrder";

const Layout = ({ children }) => {
  const location = useLocation();

  const showLayout =
    location.pathname !== "/completed" &&
    location.pathname !== "/loginPage" &&
    location.pathname !== "/adminPage" &&
    location.pathname !== "/staffPage";

  return (
    <>
      {showLayout && <NavbarPage />}
      <div className={showLayout ? "container" : ""}>
        <div className={showLayout ? "content" : ""}>{children}</div>
      </div>
      {showLayout && <FooterPage />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/completed" element={<SuccessPage />} />
          {/* ORDER */}
          <Route path="/order" element={<OrderPage />} />
          <Route path="/order/hourlyOrder" element={<HourOrder />} />
          <Route path="/order/dailyOrder" element={<DayOrder />} />
          <Route path="/order/customOrder" element={<CustomOrder />} />
          <Route path="/order/yearroundOrder" element={<YearroundOrder />} />
          <Route path="/orderDetail/:orderId" element={<OrderDetail />} />
          <Route path="/inforOrder" element={<InforOrder />} />
          <Route path="/summaryOrder" element={<SummaryOrder />} />
          <Route path="/paymentOrder" element={<PaymentOrder />} />
          {/* MANAGEMENT */}
          <Route path="/loginPage" element={<LoginPage />} />
          <Route
            path="/adminPage"
            element={<ProtectedRoute element={<AdminPage />} />}
          />
          <Route
            path="/staffPage"
            element={<ProtectedRoute element={<StaffPage />} />}
          />
          {/* Fallback route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/testing" element={<Testing />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
