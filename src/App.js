import "./App.css";
import { BrowserRouter as Router, Routes, Route,useLocation  } from "react-router-dom";
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

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Conditionally render Navbar and Footer
  const showLayout = location.pathname !== '/*'; // Update the condition based on your 404 path

  return (
    <>
      {showLayout && <NavbarPage />}
      <div className={showLayout && "container"}>
        <div className={showLayout && "content"}>{children}</div>
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
        <Route path="/contact" element={<ContactPage />} />
        {/* ORDER */}
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/hourlyOrder" element={<HourOrder />} />
        <Route path="/order/dailyOrder" element={<DayOrder />} />
        <Route path="/order/customOrder" element={<CustomOrder />} />
        <Route path="/orderDetail/:orderId" element={<OrderDetail />} />
        <Route path="/inforOrder" element={<InforOrder />} />
        {/* Fallback route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  </Router>
  );
}

export default App;
