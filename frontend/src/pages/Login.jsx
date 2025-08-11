import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }){
  const [user, setUser] = useState(''), [pass, setPass] = useState('');
  const navigate = useNavigate();
  const doLogin = async () => {
    try {
      const r = await API.post('/auth/login', { username: user, password: pass });
      setToken(r.data.token);
      navigate('/');
    } catch (e){ alert('login failed'); }
  };
  return (
    <div>
      <h2>Login</h2>
      <input placeholder="username" value={user} onChange={e=>setUser(e.target.value)} />
      <input placeholder="password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
      <button onClick={doLogin}>Login</button>
      <hr/>
      <p>Or register by trying login on unknown user — backend supports /auth/register.</p>
    </div>
  );
}
