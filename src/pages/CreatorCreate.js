import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CreatorNewPost from './CreatorNewPost';
import CreatorNewVideo from './CreatorNewVideo';
import '../videos.css';

export default function CreatorCreate() {
  const [sp] = useSearchParams();
  const [tab, setTab] = useState(sp.get('tab') === 'video' ? 'video' : 'post');
  return (
    <div>
      <div className="vp-tabs" style={{ margin: '12px 16px 0' }}>
        <button type="button" className={tab === 'post' ? 'on' : ''} onClick={() => setTab('post')}>Post</button>
        <button type="button" className={tab === 'video' ? 'on' : ''} onClick={() => setTab('video')}>Short video</button>
      </div>
      {tab === 'post' ? <CreatorNewPost /> : <CreatorNewVideo />}
    </div>
  );
}
