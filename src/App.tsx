import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { apps } from './data/apps';
import AppCard from './components/AppCard';

function getHashAppId() {
  const hash = window.location.hash.replace('#', '').replace('/', '');
  return hash || '';
}

export default function App() {
  const [activeAppId, setActiveAppId] = useState<string>(getHashAppId());

  useEffect(() => {
    const onHashChange = () => {
      setActiveAppId(getHashAppId());
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activeApp = useMemo(
    () => apps.find((app) => app.id === activeAppId) || null,
    [activeAppId]
  );

  const openApp = (id: string) => {
    window.location.hash = id;
  };

  const closeApp = () => {
    window.location.hash = '';
  };

  return (
    <div className="site-shell">
      <AnimatePresence mode="wait">
        {!activeApp ? (
          <motion.div
            key="home"
            className="home-screen"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -120, opacity: 0.6 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="hero">
              <div className="hero-badge">Interactive Math Tools</div>
              <h1>Thinking Math Apps</h1>
              <p>
                A growing library of interactive explorations for mathematical
                thinking, visual reasoning, and problem solving.
              </p>
            </div>

            <div className="app-grid">
              {apps.map((app) => (
                <AppCard
                  key={app.id}
                  title={app.title}
                  description={app.description}
                  onClick={() => openApp(app.id)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeApp.id}
            className="app-screen"
            initial={{ x: '100%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <header className="app-topbar">
              <button className="back-button" onClick={closeApp}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>

              <div className="app-title-wrap">
                <h2>{activeApp.title}</h2>
                <p>{activeApp.description}</p>
              </div>
            </header>

            <main className="app-content">
              <activeApp.component />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
