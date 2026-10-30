import React, { useState } from 'react';
import { Globe, Smartphone, LayoutDashboard } from 'lucide-react';
import { globalPetNannyStore, PetNannyStore } from './core/store';
import { CustomerWebsite } from './components/CustomerWebsite';
import { OwnerDashboard } from './components/OwnerDashboard';
import { MobileAppExperience } from './components/MobileAppExperience';
import './styles/design-system.css';

interface AppProps {
  store?: PetNannyStore;
}

export const App: React.FC<AppProps> = ({ store = globalPetNannyStore }) => {
  const [mode, setMode] = useState<'website' | 'mobile' | 'dashboard'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'dashboard';
    }
    return 'website';
  });

  return (
    <div>
      {/* Unified Platform Bar to switch between Customer Website, Mobile App, and Owner Dashboard */}
      <div className="pn-mode-bar">
        <div className="pn-mode-bar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <strong style={{ fontSize: '0.86rem', color: '#ffffff' }}>
              Pet Nanny Bicol v2.0 (Minimalist Edition)
            </strong>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Daet &amp; Naga City • Website + Mobile App + Owner Dashboard
            </span>
          </div>

          <div className="pn-mode-pills" role="navigation" aria-label="Platform View Switcher">
            <button
              type="button"
              className={`pn-mode-pill ${mode === 'website' ? 'active' : ''}`}
              onClick={() => setMode('website')}
            >
              <Globe size={15} aria-hidden="true" />
              Customer Website
            </button>
            <button
              type="button"
              className={`pn-mode-pill ${mode === 'mobile' ? 'active' : ''}`}
              onClick={() => setMode('mobile')}
            >
              <Smartphone size={15} aria-hidden="true" />
              Mobile App (Android / iOS)
            </button>
            <button
              type="button"
              className={`pn-mode-pill ${mode === 'dashboard' ? 'active' : ''}`}
              onClick={() => setMode('dashboard')}
            >
              <LayoutDashboard size={15} aria-hidden="true" />
              Owner Dashboard
            </button>
          </div>
        </div>
      </div>

      {mode === 'website' && (
        <CustomerWebsite store={store} onNavigateMode={setMode} />
      )}
      {mode === 'mobile' && <MobileAppExperience store={store} />}
      {mode === 'dashboard' && (
        <OwnerDashboard store={store} onNavigateMode={setMode} />
      )}
    </div>
  );
};

export default App;

