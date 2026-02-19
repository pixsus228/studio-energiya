import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import './App.css';
import siteData from './data.json';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// --- LIGHTBOX: ПЕРЕГЛЯД НА ВЕСЬ ЕКРАН ---
const Lightbox = ({ images, index, onClose, onNext, onPrev }) => {
  if (index === null) return null;
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button className="nav-btn left" onClick={onPrev}>‹</button>
        <img src={images[index]} alt="View" className="lightbox-img" />
        <button className="nav-btn right" onClick={onNext}>›</button>
      </div>
      <div className="lightbox-counter">{index + 1} / {images.length}</div>
    </div>
  );
};

const Logo = () => (
  <div className="logo-wrapper">
    <Link to="/"><img src="/logo_new.jpg" alt="Logo" className="logo-oval" /></Link>
  </div>
);

const InstaBtn = ({ url, text }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="insta-btn">
    <span className="insta-icon">📸</span> {text}
  </a>
);

const LessonPage = () => {
  const { trainerId, lessonTitle } = useParams();
  const trainer = siteData.trainers.find(t => t.id === trainerId);
  const lesson = trainer?.schedule.find(s => s.title === decodeURIComponent(lessonTitle));
  if (!lesson) return <div className="container"><h2>Не знайдено</h2><Link to="/" className="back-btn">На головну</Link></div>;

  return (
    <div className="container animate-in">
      <Logo />
      <div className="trainer-brief">
        <img src={trainer.photo} alt={trainer.name} className="photo-large photo-glow-pulse" />
        <p className="trainer-name-label">Викладач: {trainer.name}</p>
        {trainer.instagram && <InstaBtn url={trainer.instagram} text="Instagram" />}
      </div>
      <h2 className="glow-text">{lesson.title}</h2>
      <div className="schedule-box">
        <h3 className="section-title">🗓️ Розклад занять:</h3>
        {lesson.details.map((d, i) => <div key={i} className="schedule-item">{d}</div>)}
      </div>
      {lesson.priceInfo && (
         <div className="price-section">
            <h3 className="section-title">💰 Вартість:</h3>
            {lesson.priceInfo.map((p, idx) => <div key={idx} className="price-row">{p}</div>)}
         </div>
      )}
      <Link to={`/trainer/${trainerId}`} className="back-btn">← Назад</Link>
    </div>
  );
};

const TrainerPage = () => {
  const { id } = useParams();
  const [imgIdx, setImgIdx] = useState(null);
  const trainer = siteData.trainers.find(t => t.id === id);
  if (!trainer) return <div className="container"><h2>Не знайдено</h2></div>;

  const next = () => setImgIdx((imgIdx + 1) % trainer.certs.length);
  const prev = () => setImgIdx((imgIdx - 1 + trainer.certs.length) % trainer.certs.length);

  return (
    <div className="container animate-in">
      <Logo />
      <div className="profile-header">
        <img src={trainer.photo} alt={trainer.name} className="photo-large photo-glow-pulse" />
        <h1 className="glow-text">{trainer.name}</h1>
        <p className="role-text">{trainer.role}</p>
        {trainer.instagram && <InstaBtn url={trainer.instagram} text="Instagram" />}
      </div>
      {trainer.certs?.length > 0 && (
        <div className="cert-section">
          <h3 className="section-title">📜 Сертифікати:</h3>
          <div className="cert-grid">
            {trainer.certs.map((img, i) => <img key={i} src={img} className="cert-thumb" onClick={() => setImgIdx(i)} alt="Cert" />)}
          </div>
        </div>
      )}
      <div className="lesson-list">
        <h3 className="section-title">👉 Оберіть напрямок:</h3>
        {trainer.schedule.map((item, i) => (
          <Link to={`/trainer/${id}/lesson/${encodeURIComponent(item.title)}`} key={i} className="lesson-link-card">
            <span className="link-title">{item.title}</span>
            <span className="arrow-icon">›</span>
          </Link>
        ))}
      </div>
      <Link to="/" className="back-btn">← На головну</Link>
      <Lightbox images={trainer.certs || []} index={imgIdx} onClose={() => setImgIdx(null)} onNext={next} onPrev={prev} />
    </div>
  );
};

const HomePage = () => {
  const [modal, setModal] = useState({ list: [], index: null });
  const [shuffledGallery, setShuffledGallery] = useState([]);

  useEffect(() => {
    const gallery = [...siteData.gallery].sort(() => Math.random() - 0.5);
    setShuffledGallery(gallery);
  }, []);

  const openModal = (list, i) => setModal({ list, index: i });
  const close = () => setModal({ list: [], index: null });
  const next = () => setModal(prev => ({ ...prev, index: (prev.index + 1) % prev.list.length }));
  const prev = () => setModal(prev => ({ ...prev, index: (prev.index - 1 + prev.list.length) % prev.list.length }));

  return (
    <div className="container animate-in">
      <Logo />
      <h1 className="glow-text studio-title">Studio Energiya</h1>
      <div className="home-insta-row">
          <InstaBtn url="https://www.instagram.com/studio_energiya" text="Studio Instagram" />
          <InstaBtn url="https://www.instagram.com/slavkovna.gym" text="Anastasia Instagram" />
      </div>
      <p style={{marginTop: '20px', color: '#eee'}}>{siteData.description}</p>
      <div className="grid">
        {siteData.trainers.map((t) => (
          <Link to={`/trainer/${t.id}`} key={t.id} className="trainer-card">
            <img src={t.photo} alt={t.name} className="photo-thumb photo-glow-static" />
            <h3>{t.name}</h3>
            <p className="trainer-role-small">{t.role}</p>
            <p style={{color: '#e0b0ff', fontWeight: 'bold'}}>Детальніше →</p>
          </Link>
        ))}
      </div>
      <div style={{marginTop: '60px'}}>
        <h2 className="section-title">🏆 Наші досягнення</h2>
        <div className="achievements-container">
          {siteData.achievements.map((img, i) => <img key={i} src={img} className="cup-img" onClick={() => openModal(siteData.achievements, i)} alt="Cup" />)}
        </div>
      </div>
      <div style={{marginTop: '60px'}}>
        <h2 className="section-title">📸 Життя студії</h2>
        <div className="gallery-grid">
          {shuffledGallery.map((img, i) => (
            <img key={i} src={img} className="gallery-thumb" onClick={() => openModal(shuffledGallery, i)} alt="Studio" />
          ))}
        </div>
      </div>
      <footer className="footer">
        <p>📍 м. Ромни, бульвар Шевченка, 6</p>
        <a href="https://www.google.com/maps/search/?api=1&query=50.751071,33.492561" target="_blank" rel="noopener noreferrer" className="map-btn">🗺️ Карта</a>
      </footer>
      <Lightbox images={modal.list} index={modal.index} onClose={close} onNext={next} onPrev={prev} />
    </div>
  );
};

// --- ОСНОВНИЙ КОМПОНЕНТ APP ---
function App() {
  // 1. Блок для адмінки (додано)
  if (window.location.pathname.startsWith('/admin')) {
    return null;
  }

  // 2. Логіка Netlify Identity (додано)
  useEffect(() => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on("init", user => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-photo" style={{ backgroundImage: "url(/background.jpg)" }}></div>
      <div className="energy-orb orb-1"></div>
      <div className="energy-orb orb-2"></div>
      <div className="energy-orb orb-3"></div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trainer/:id" element={<TrainerPage />} />
        <Route path="/trainer/:trainerId/lesson/:lessonTitle" element={<LessonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
