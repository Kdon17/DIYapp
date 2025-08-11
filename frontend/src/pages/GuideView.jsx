import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import ReactMarkdown from 'react-markdown';

export default function GuideView(){
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [comment, setComment] = useState('');
  useEffect(()=> {
    API.get(`/guides/${slug}`).then(r=> setData(r.data)).catch(()=> {});
  }, [slug]);

  const postComment = async () => {
    try {
      await API.post(`/guides/${slug}/comments`, { body: comment, rating: 5 });
      setComment('');
      const r = await API.get(`/guides/${slug}`);
      setData(r.data);
    } catch (e) { alert('login required'); }
  };

  if (!data) return <div>Loading...</div>;
  const { guide, media, comments } = data;
  return (
    <div>
      <h2>{guide.title}</h2>
      <small>Difficulty: {guide.difficulty} • Tags: {guide.tags}</small>
      <article style={{marginTop:12}}>
        <ReactMarkdown>{guide.content}</ReactMarkdown>
      </article>
      {media.length > 0 && (
        <div>
          <h3>Media</h3>
          {media.map(m => (
            <div key={m.id}>
              {m.mime.startsWith('video') ? (
                <video controls width="480" src={`/uploads/${m.filename}`} />
              ) : (
                <img alt="" style={{maxWidth:480}} src={`/uploads/${m.filename}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop:20}}>
        <h3>Comments</h3>
        <ul>{comments.map(c => <li key={c.id}><b>{c.username}</b>: {c.body}</li>)}</ul>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment"></textarea>
        <br/>
        <button onClick={postComment}>Post comment</button>
      </div>
    </div>
  );
}
