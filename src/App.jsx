import React, { useMemo, useState } from 'react';
import { Link2, Instagram, Music2, Download, ShieldCheck, Clipboard, X, ArrowUpRight, FileVideo, CheckCircle2 } from 'lucide-react';

function detectPlatform(raw) {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    const h = u.hostname.toLowerCase().replace(/^www\./, '');
    if (h === 'instagram.com' || h.endsWith('.instagram.com')) return 'Instagram';
    if (h === 'tiktok.com' || h.endsWith('.tiktok.com')) return 'TikTok';
    return null;
  } catch { return null; }
}

export default function App() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const validPlatform = useMemo(() => detectPlatform(url.trim()), [url]);

  function checkLink(e) {
    e.preventDefault();
    setMessage('');
    const found = detectPlatform(url.trim());
    if (!found) {
      setPlatform('');
      setMessage('Please paste a valid public Instagram or TikTok link beginning with https://.');
      return;
    }
    setPlatform(found);
    setMessage(`${found} link recognized. Open the original post to view it. This site does not bypass platform restrictions or extract videos from third-party links.`);
  }

  async function pasteLink() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setMessage('');
    } catch {
      setMessage('Clipboard access was blocked. Please paste the link into the field manually.');
    }
  }

  function chooseFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setMessage('Please choose a video file.');
      return;
    }
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileName(file.name);
    setFileUrl(URL.createObjectURL(file));
    setMessage('Your local video is ready to save.');
  }

  function downloadOwnFile() {
    if (!fileUrl) return;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName || 'my-video';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { setMessage('Could not copy the link.'); }
  }

  const openUrl = validPlatform && platform === validPlatform ? url.trim() : '';

  return <main>
    <nav className="nav wrap">
      <a className="brand" href="#"><span className="brand-icon"><FileVideo size={21}/></span> ReelSave</a>
      <span className="nav-note"><ShieldCheck size={16}/> Simple · Private · Free</span>
    </nav>

    <section className="hero wrap">
      <div className="eyebrow"><span className="dot"/> VIDEO LINK HELPER</div>
      <h1>Save what’s <span>yours.</span></h1>
      <p className="lead">A simple place to check Instagram and TikTok links, and save video files you own.</p>

      <div className="panel">
        <div className="tabs"><span className="tab active"><Instagram size={17}/> Instagram</span><span className="tab"><Music2 size={17}/> TikTok</span></div>
        <form onSubmit={checkLink}>
          <label htmlFor="video-url">Paste a video link</label>
          <div className="url-row">
            <Link2 size={19} className="link-icon"/>
            <input id="video-url" value={url} onChange={e => {setUrl(e.target.value); setMessage(''); setPlatform('');}} placeholder="https://www.instagram.com/reel/..." />
            {url && <button className="icon-btn" type="button" aria-label="Clear" onClick={() => {setUrl('');setPlatform('');setMessage('');}}><X size={17}/></button>}
            <button className="paste-btn" type="button" onClick={pasteLink}><Clipboard size={16}/> Paste</button>
          </div>
          <button className="primary" type="submit">Check link <ArrowUpRight size={18}/></button>
        </form>
        {message && <div className={`notice ${platform ? 'good' : ''}`}><CheckCircle2 size={17}/><span>{message}</span></div>}
        {platform && openUrl && <a className="open-original" href={openUrl} target="_blank" rel="noreferrer">Open original {platform} post <ArrowUpRight size={16}/></a>}
      </div>
      <div className="trust"><span><ShieldCheck size={16}/> No login required</span><span>•</span><span>Links are checked in your browser</span></div>
    </section>

    <section className="own wrap">
      <div className="section-head"><div><div className="eyebrow">YOUR OWN CONTENT</div><h2>Download a video file</h2></div><span className="free-pill">Free tool</span></div>
      <p className="muted">Choose a video stored on your device to save a copy. This works for files you own or have permission to use.</p>
      <div className="file-box">
        <div className="file-symbol"><Download size={22}/></div>
        <div className="file-copy"><strong>{fileName || 'Choose a video from your device'}</strong><span>{fileName ? 'Ready to save locally' : 'MP4, MOV, WebM and other browser-supported video files'}</span></div>
        <label className="secondary" htmlFor="video-file">Choose file</label>
        <input id="video-file" type="file" accept="video/*" onChange={chooseFile} hidden/>
      </div>
      {fileUrl && <div className="file-actions"><video src={fileUrl} controls className="preview"/><button className="primary" onClick={downloadOwnFile}><Download size={17}/> Download my video</button></div>}
    </section>

    <section className="steps wrap">
      <div className="eyebrow">HOW IT WORKS</div><h2>Simple by design.</h2>
      <div className="step-grid">
        <article><b>01</b><h3>Paste a link</h3><p>Use a public Instagram or TikTok URL.</p></article>
        <article><b>02</b><h3>Check the platform</h3><p>ReelSave recognizes supported link formats.</p></article>
        <article><b>03</b><h3>Open the post</h3><p>View it on the original platform, or save your own video file.</p></article>
      </div>
    </section>

    <section className="faq wrap"><div className="eyebrow">GOOD TO KNOW</div><h2>Frequently asked questions</h2>
      <details><summary>Can I download any Instagram Reel or TikTok video from its link?</summary><p>No. This starter version validates links and opens the original post. It does not bypass platform restrictions or download other people's content.</p></details>
      <details><summary>Can I save videos I own?</summary><p>Yes. Use the “Download a video file” section to choose a video from your device and save a copy.</p></details>
      <details><summary>Do I need an account?</summary><p>No account is needed to use this page.</p></details>
    </section>
    <footer className="wrap"><a className="brand" href="#"><span className="brand-icon"><FileVideo size={18}/></span> ReelSave</a><span>Use responsibly. Respect creators’ rights and platform terms.</span></footer>
  </main>;
}
