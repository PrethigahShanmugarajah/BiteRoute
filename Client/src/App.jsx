// BiteRoute / Client / src / App.jsx
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default App;
