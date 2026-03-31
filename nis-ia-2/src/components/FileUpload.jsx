import { useState, useCallback } from 'react';
import styles from './FileUpload.module.css';

export default function FileUpload({ onData, onError }) {
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [fileName, setFileName] = useState(null);

  const parseFile = useCallback((file) => {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      onError('Invalid file type. Please upload a .json file.');
      return;
    }
    setLoading(true);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        setTimeout(() => {          // simulate processing delay for UX
          setLoading(false);
          onData(parsed);
        }, 600);
      } catch {
        setLoading(false);
        onError('Failed to parse JSON. Make sure it\'s a valid Shodan export.');
      }
    };
    reader.readAsText(file);
  }, [onData, onError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    parseFile(file);
  }, [parseFile]);

  const handleChange = (e) => parseFile(e.target.files[0]);

  return (
    <div
      className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${loading ? styles.loading : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !loading && document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Analyzing <span className="mono">{fileName}</span>…</p>
        </div>
      ) : (
        <div className={styles.idle}>
          <div className={styles.iconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className={styles.headline}>
            {fileName ? `Re-upload: ${fileName}` : 'Drop your Shodan JSON export here'}
          </p>
          <p className={styles.sub}>or <span className={styles.link}>click to browse</span> · only <code>.json</code> files</p>
          <div className={styles.tip}>
            <span>💡</span>
            <span>Export from Shodan CLI: <code>shodan host &lt;IP&gt; --format=json &gt; scan.json</code></span>
          </div>
        </div>
      )}
    </div>
  );
}
