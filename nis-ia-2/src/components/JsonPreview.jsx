import { useState } from 'react';
import styles from './JsonPreview.module.css';

export default function JsonPreview({ data }) {
  const [open, setOpen] = useState(false);
  const json = JSON.stringify(data, null, 2);

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header} onClick={() => setOpen(o => !o)}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div className="section-icon">📄</div>
          <h2>Raw JSON Preview</h2>
        </div>
        <button className={styles.toggle}>
          {open ? '▲ Collapse' : '▼ Expand'}
        </button>
      </div>

      {open && (
        <div className={styles.body}>
          <pre className={styles.pre}>{json}</pre>
        </div>
      )}
    </div>
  );
}
