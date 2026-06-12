import {
  BrowserRouter,
  Routes,
  Route
}
  from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ContactUs from "./pages/ContactUs";
import SubscriptionPage from "./pages/SubscriptionPage";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/owner-dashboard"
          element={<OwnerDashboard />}
        />
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />

        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />

        <Route
          path="/contact-us"
          element={<ContactUs />}
        />
        <Route
          path="/subscription"
          element={<SubscriptionPage />}
        />
      </Routes>

    </BrowserRouter>

  )

}

export default App;