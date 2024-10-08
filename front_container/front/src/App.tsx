import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Landing_Page from "./pages/Landing_Page/Landing_page_com/Landing_Page";
import Login_Page from "./pages/Login_Page/Login_Page";
import Signup_Page from "./pages/Signup_Page/Signup_Page";
import My_profile from "./pages/My_rofile/My_profile"
import Valid_otp from "./pages/Valid_otp/Valid_otp";
function App() {
  
  return (
    <>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Landing_Page />} />
            <Route path="login" element={<Login_Page />} />
            <Route path="signup" element={<Signup_Page />} />
            <Route path="My_profile" element={<My_profile />} />
            <Route path="Valid_otp" element={<Valid_otp />} />
          </Routes>
        </main>
      </BrowserRouter>
      {/* <Login_Page/> */}
      {/* <Signup_Page/> */}
    </>
  );
}

export default App;
