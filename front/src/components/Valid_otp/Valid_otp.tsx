import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import "./Valid_otp.css";

const ValidOtp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const navigate = useNavigate();
  const username = searchParams.get('username');

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/user_auth/VerifyOTP", {
        username,
        otp,
      });

      if (response.status === 200) {
        Cookies.set('access_token', response.data.access, { path: '/' });
        Cookies.set('refresh_token', response.data.refresh, { path: '/' });
        axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('access_token')}`;
        
        // Redirect to the page specified by the backend
        navigate(response.data.redirect_to);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrMsg(error.response.data.detail);
      } else {
        setErrMsg('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <>
      <form className="form_otp" onSubmit={handleSubmit}>
        <p>Hello, {username}</p>
        <input
          type="text"
          name="otp"
          id="otp_code"
          value={otp}
          onChange={handleOtpChange}
          required
        />
        <button type="submit">Verify</button>
        {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
      </form>
    </>
  );
};

export default ValidOtp;
