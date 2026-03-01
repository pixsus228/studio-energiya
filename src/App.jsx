import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import siteDataRaw from './data.json';

const getValue = (item, key) => {
  if (!item) return "";
  if (typeof item === 'string') return item;
  return item[key] || "";
};

const getImgSrc = (path) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith('http')) return path;

  // Витягуємо тільки назву файлу, щоб не було каші з папками
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];

  // Завжди повертаємо чистий шлях до папки images
  return `/images/${fileName}`;
};

const InstaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const Lightbox = ({ images, index, onClose, setIndex }) => {
  if (index === null || !images || !images[index]) return null;
  const onNext = (e) => { e.stopPropagation(); setIndex((index + 1) % images.length); };
  const onPrev = (e) => { e.stopPropagation(); setIndex((index - 1 + images.length) % images.length); };
  const item = images[index];
  const src = getImgSrc(getValue(item, 'cert_item') || getValue(item, 'gallery_item') || getValue(item, 'cup_item') || item);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="lightbox-container" onClick={e => e.stopPropagation()}>
        <button className="nav-btn prev" onClick={onPrev}>‹</button>
        <img src={src} className="lightbox-img animate-in" alt="zoom" />
        <button className="nav-btn next" onClick={onNext}>›</button>
      </div>
    </div>
  );
};

const Header = () => (
  <>
    <header className="fixed-header">
      <Link to="/" className="logo-link">
        <div className="logo-oval-container">
          <img src="/images/logo_new.jpg" alt="Logo" className="logo-oval-img" />
        </div>
      </Link>
    </header>
    <a href="/admin/index.html" className="admin-shortcut-btn" title="Адмінка">⚙️</a>
  </>
);

const LessonPage = () => {
  const { trainerId, lessonTitle } = useParams();
  const trainer = siteDataRaw?.trainers?.find(t => t.id === trainerId);
  const lesson = trainer?.schedule?.find(s => s.title === decodeURIComponent(lessonTitle));

  if (!lesson) return <div className="container"><h2>Не знайдено</h2></div>;

  return (
    <div className="container animate-in page-padding">
      <img src={getImgSrc(trainer.photo)} className="photo-large color-glow-pulse" alt={trainer.name} />
      <p className="trainer-name-tag text-shimmer">Викладач: {trainer.name}</p>
      <h2 className="glow-text text-shimmer">{lesson.title}</h2>

      <div className="info-section-grid">
        <div className="glass-card">
          <h3 className="card-label text-shimmer">🕒 Розклад занять</h3>
          <div className="details-list">
            {lesson.details?.map((d, i) => (
              <div key={i} className="detail-item">✦ {getValue(d, 'detail_line')}</div>
            ))}
          </div>
        </div>
        {lesson.priceInfo && (
          <div className="glass-card">
            <h3 className="card-label text-shimmer">💰 Вартість</h3>
            <div className="details-list">
              {lesson.priceInfo.map((p, i) => (
                <div key={i} className="price-item">{getValue(p, 'price_line')}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TrainerPage = () => {
  const { id } = useParams();
  const [imgIdx, setImgIdx] = useState(null);
  const trainer = siteDataRaw?.trainers?.find(t => t.id === id);
  if (!trainer) return <div className="container"><h2>Не знайдено</h2></div>;

  return (
    <div className="container animate-in page-padding">
      <img src={getImgSrc(trainer.photo)} className="photo-large color-glow-pulse" alt={trainer.name} />
      <h1 className="glow-text text-shimmer">{trainer.name}</h1>
      <p className="role-badge text-shimmer">{trainer.role}</p>
      {trainer.instagram && (
        <a href={trainer.instagram} target="_blank" rel="noopener noreferrer" className="insta-btn-glass">
          <InstaIcon /> <span>Instagram</span>
        </a>
      )}
      <div className="content-block">
        <h3 className="section-title text-shimmer">Напрямки тренувань:</h3>
        <div className="lesson-list-column">
          {trainer.schedule?.map((l, i) => (
            <Link to={`/trainer/${id}/lesson/${encodeURIComponent(l.title)}`} key={i} className="lesson-glass-btn">
              <span>{l.title}</span> <span className="arrow-icon">➔</span>
            </Link>
          ))}
        </div>
      </div>
      {trainer.certs?.length > 0 && (
        <div className="content-block">
          <h3 className="section-title text-shimmer">📜 Сертифікати та дипломи:</h3>
          <div className="cert-grid-fixed">
            {trainer.certs.map((c, i) => (
              <div key={i} className="cert-wrapper">
                <img src={getImgSrc(getValue(c, 'cert_item'))} className="cert-img" onClick={() => setImgIdx(i)} alt="cert" />
              </div>
            ))}
          </div>
        </div>
      )}
      {trainer.videos?.length > 0 && (
        <div className="content-block animate-in">
          <h3 className="section-title text-shimmer">🎥 Відео тренувань:</h3>
          <div className="video-grid">
            {trainer.videos.map((v, i) => (
              <div key={i} className="video-wrapper-glass">
                <video controls className="video-item-glass">
                  <source src={getImgSrc(getValue(v, 'video_item'))} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
      <Lightbox images={trainer.certs} index={imgIdx} onClose={() => setImgIdx(null)} setIndex={setImgIdx} />
    </div>
  );
};

const HomePage = () => {
  const [modal, setModal] = useState({ list: [], index: null });
  return (
    <div className="container animate-in page-padding">
      <h1 className="glow-text studio-title text-shimmer">Studio Energiya</h1>
      <p className="main-desc text-shimmer">{siteDataRaw.description}</p>
      <div className="map-wrapper">
        <a href={siteDataRaw.location?.mapLink || "#"} target="_blank" rel="noreferrer" className="map-btn-neon">
          📍 {siteDataRaw.location?.addressText || "Адреса студії"}
        </a>
      </div>
      <div className="trainers-grid">
        {siteDataRaw.trainers.map(t => (
          <Link to={`/trainer/${t.id}`} key={t.id} className="trainer-card">
            <img src={getImgSrc(t.photo)} className="photo-thumb color-glow-pulse" alt={t.name} />
            <h3 className="trainer-name-shimmer">{t.name}</h3>
            <p className="role-text text-shimmer">{t.role}</p>
          </Link>
        ))}
      </div>
      <h2 className="section-title text-shimmer">🏆 Наші Досягнення</h2>
      <div className="assets-grid">
        {siteDataRaw.achievements?.map((img, i) => (
          <img key={i} src={getImgSrc(getValue(img, 'cup_item'))} className="asset-thumb" onClick={() => setModal({list: siteDataRaw.achievements, index: i})} alt="cup" />
        ))}
      </div>
      <h2 className="section-title text-shimmer">📸 Фото Студії</h2>
      <div className="assets-grid">
        {siteDataRaw.gallery?.map((img, i) => (
          <img key={i} src={getImgSrc(getValue(img, 'gallery_item'))} className="asset-thumb" onClick={() => setModal({list: siteDataRaw.gallery, index: i})} alt="gallery" />
        ))}
      </div>
      <footer className="footer text-shimmer">© 2026 Studio Energiya</footer>
      <Lightbox images={modal.list} index={modal.index} onClose={() => setModal({list:[], index:null})} setIndex={(idx) => setModal(prev => ({...prev, index: idx}))} />
    </div>
  );
};

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <div className="bg-photo" style={{ backgroundImage: "url(/images/background.jpg)" }}></div>
      <div className="bg-overlay"></div>
      <div className="energy-orb orb-1"></div>
      <div className="energy-orb orb-2"></div>
      <div className="energy-orb orb-3"></div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trainer/:id" element={<TrainerPage />} />
        <Route path="/trainer/:trainerId/lesson/:lessonTitle" element={<LessonPage />} />
      </Routes>
    </Router>
  );
}