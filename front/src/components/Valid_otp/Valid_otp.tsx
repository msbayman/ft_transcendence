import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import "./Valid_otp.css";

const ValidOtp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [errMsg, setErrMsg] = useState<string>("");
  const navigate = useNavigate();
  const username = searchParams.get('username');
  
  // Refs for the input fields
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleOtpChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) { // Ensures only numbers are entered
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically focus the next input field if the current one is filled
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join('');

    try {
      const response = await axios.post("http://127.0.0.1:8000/user_auth/VerifyOTP", {
        username,
        otp: otpCode,
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
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      className="form_otp" 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      p={2}
    >
      <Typography variant="h6" mb={2} sx={{ color: 'white' }}>Hello, {username}</Typography>
      <Box display="flex" justifyContent="space-between" mb={2} >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputsRef.current[index] = el)}
            value={digit}
            onChange={handleOtpChange(index)}
            onKeyDown={handleKeyDown(index)}
            inputProps={{ maxLength: 1, style: { textAlign: 'center', color: 'white' } }}
            variant="outlined"
            sx={{
              width: '40px',
              margin: '0 4px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
        ))}
      </Box>
      <Button variant="contained" color="primary" type="submit">
        Verify
      </Button>
      {errMsg && (
       <Alert severity="error" sx={{ marginTop: 2, color: 'red', backgroundColor: 'red' }}>
       {errMsg}
     </Alert>
      )}
    </Box>
  );
};

export default ValidOtp;
