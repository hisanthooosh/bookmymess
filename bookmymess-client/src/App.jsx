import {
  BrowserRouter,
  Routes,
  Route
}
  from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";


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

      </Routes>

    </BrowserRouter>

  )

}

export default App;