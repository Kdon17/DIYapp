import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Home(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  useEffect(()=> {
    API.get('/guides', { params: { q } }).then(r=> setList(r.data)).catch(()=>{});
  }, [q]);
  return (
    <div>
      <h1>Car DIY Guides</h1>
      <input placeholder="search..." value={q} onChange={e=>setQ(e.target.value)} />
      <ul>
        {list.map(g=> (
          <li key={g.id}>
            <Link to={`/g/${g.slug}`}>{g.title}</Link>
            <small> • {g.difficulty} • {g.tags}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
