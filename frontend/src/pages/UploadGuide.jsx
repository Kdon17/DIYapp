import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function UploadGuide(){
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [content, setContent] = useState('## Steps\n1. ...');
  const [file, setFile] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const r = await API.post('/guides', { title, slug, tags, difficulty, content, est_time_minutes: 30 });
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('guide_id', r.data.id);
        fd.append('step_index', stepIndex);
        await API.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
      navigate(`/g/${slug}`);
    } catch (e) { alert(e?.response?.data?.error || 'error'); }
  };

  return (
    <div>
      <h2>Upload Guide</h2>
      <input value={title} placeholder="Title" onChange={e=>setTitle(e.target.value)} /><br/>
      <input value={slug} placeholder="slug (unique)" onChange={e=>setSlug(e.target.value)} /><br/>
      <input value={tags} placeholder="tags,comma,separated" onChange={e=>setTags(e.target.value)} /><br/>
      <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <h4>Markdown content (guide steps)</h4>
      <textarea value={content} onChange={e=>setContent(e.target.value)} rows={10} cols={80}></textarea>
      <h4>Attach media (optional)</h4>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <input type="number" value={stepIndex} onChange={e=>setStepIndex(Number(e.target.value))} />
      <br/>
      <button onClick={submit}>Publish</button>

      <h3>Preview</h3>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
