import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";


function Test(){
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const token = Cookies.get("access_token");
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/loby/?token=${token}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('Connected');
      setError(null);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div>
      <h2>WebSocket Status: {connectionStatus}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    
  );
};

export default Test;
