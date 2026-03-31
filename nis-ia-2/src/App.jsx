import { useState, useCallback } from 'react';
import FileUpload            from './components/FileUpload';
import DeviceSummary         from './components/DeviceSummary';
import OpenPorts             from './components/OpenPorts';
import ServicesTable         from './components/ServicesTable';
import RiskPanel             from './components/RiskPanel';
import VulnerabilityWarnings from './components/VulnerabilityWarnings';
import Recommendations       from './components/Recommendations';
import JsonPreview           from './components/JsonPreview';
import { analyzeData }       from './utils/analyzer';
import styles                from './App.module.css';

/* ── Scanline overlay for cyberpunk feel ─────────────────────────────────── */
function Scanlines() {
  return <div className={styles.scanlines} aria-hidden="true" />;
}

/* ── Navbar ──────────────────────────────────────────────────────────────── */
function Navbar({ hasData, onReset }) {
  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navInner}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>Shodan<span className={styles.logoAccent}>Analyzer</span></span>
          <span className="badge badge-info">OFFLINE</span>
        </div>
        {hasData && (
          <button className={styles.resetBtn} onClick={onReset}>
            ↩ New Analysis
          </button>
        )}
      </div>
    </header>
  );
}

/* ── Hero (upload page) ──────────────────────────────────────────────────── */
function Hero({ onData, onError }) {
  return (
    <div className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroBadge}>
          <span className={styles.heroDot} />
          Client-side only · No data leaves your browser
        </div>
        <h1 className={styles.heroTitle}>
          Offline <span className={styles.heroHighlight}>Shodan</span> Analyzer
        </h1>
        <p className={styles.heroSub}>
          Upload a Shodan JSON export to get instant cybersecurity insights —
          open ports, service details, vulnerability warnings, and risk scoring.
        </p>
        <div className={styles.uploadWrap}>
          <FileUpload onData={onData} onError={onError} />
        </div>
      </div>
    </div>
  );
}

/* ── Error Toast ─────────────────────────────────────────────────────────── */
function ErrorBanner({ message, onDismiss }) {
  return (
    <div className={styles.errorBanner}>
      <span>❌ {message}</span>
      <button onClick={onDismiss} className={styles.dismissBtn}>✕</button>
    </div>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────────── */
function Dashboard({ rawData, analysis }) {
  const { score, riskLevel, portDetails, outdatedServices, warnings, recommendations } = analysis;
  const ports = rawData.ports ?? [];
  const data  = rawData.data  ?? [];

  return (
    <div className={`container ${styles.dashboard}`}>

      {/* Top: summary + risk */}
      <div className={styles.topRow}>
        <DeviceSummary data={rawData} />
        <RiskPanel
          score={score}
          riskLevel={riskLevel}
          portDetails={portDetails}
          outdatedServices={outdatedServices}
        />
      </div>

      {/* Open ports */}
      {ports.length > 0 && (
        <div className={styles.section}>
          <OpenPorts ports={ports} />
        </div>
      )}

      {/* Vulnerabilities + Recommendations side by side */}
      <div className={styles.midRow}>
        <VulnerabilityWarnings warnings={warnings} />
        <Recommendations recommendations={recommendations} />
      </div>

      {/* Services table */}
      {data.length > 0 && (
        <div className={styles.section}>
          <ServicesTable data={data} />
        </div>
      )}

      {/* JSON preview */}
      <div className={styles.section}>
        <JsonPreview data={rawData} />
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [rawData,  setRawData]  = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error,    setError]    = useState(null);

  const handleData = useCallback((json) => {
    setError(null);
    const result = analyzeData(json);
    setRawData(json);
    setAnalysis(result);
  }, []);

  const handleError = useCallback((msg) => {
    setError(msg);
    setRawData(null);
    setAnalysis(null);
  }, []);

  const handleReset = () => {
    setRawData(null);
    setAnalysis(null);
    setError(null);
  };

  const hasData = !!(rawData && analysis);

  return (
    <div className={styles.app}>
      <Scanlines />
      <Navbar hasData={hasData} onReset={handleReset} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {!hasData ? (
        <Hero onData={handleData} onError={handleError} />
      ) : (
        <Dashboard rawData={rawData} analysis={analysis} />
      )}

      <footer className={styles.footer}>
        <p>Offline Shodan Analyzer · No data is transmitted · Built with React + Vite</p>
      </footer>
    </div>
  );
}
