import Dashboard from "./Dashboard";
import Login from "./components/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
        stacked
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
