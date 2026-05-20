import {
  BrowserRouter,
  Routes,
  Route
}
  from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddMess from "./pages/AddMess";
import ViewMess from "./pages/ViewMess";

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
          path="/view-mess"
          element={<ViewMess />}
        />
        <Route
          path="/add-mess"
          element={<AddMess />}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App;