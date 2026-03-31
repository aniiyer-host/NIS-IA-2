import { useState } from 'react';
import styles from './ServicesTable.module.css';

export default function ServicesTable({ data }) {
  const [sortKey, setSortKey] = useState('port');
  const [sortDir, setSortDir] = useState('asc');

  const entries = data.map((entry) => ({
    port:     entry.port     ?? '—',
    product:  entry.product  ?? '—',
    version:  entry.version  ?? '—',
    transport:entry.transport?? 'tcp',
    cpe:      Array.isArray(entry.cpe) ? entry.cpe[0] ?? '—' : '—',
  }));

  const sorted = [...entries].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (sortKey === 'port') { av = Number(av); bv = Number(bv); }
    else { av = String(av).toLowerCase(); bv = String(bv).toLowerCase(); }
    return sortDir === 'asc' ? (av < bv ? -1 : av > bv ? 1 : 0)
                             : (av > bv ? -1 : av < bv ? 1 : 0);
  });

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (col !== sortKey) return <span className={styles.sortIcon}>↕</span>;
    return <span className={styles.sortIcon}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className={`card ${styles.card}`}>
      <div className="section-header">
        <div className="section-icon">📋</div>
        <h2>Services Table <span className={styles.count}>{entries.length} entries</span></h2>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['port','product','version','transport','cpe'].map((col) => (
                <th key={col} onClick={() => toggleSort(col)} className={styles.th}>
                  <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                  <SortIcon col={col} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i} className={styles.tr}>
                <td className={`${styles.td} mono`}>{row.port}</td>
                <td className={styles.td}>{row.product}</td>
                <td className={`${styles.td} mono`}>{row.version}</td>
                <td className={styles.td}>
                  <span className={`badge ${row.transport === 'udp' ? 'badge-medium' : 'badge-info'}`}>
                    {row.transport}
                  </span>
                </td>
                <td className={`${styles.td} ${styles.cpe}`}>{row.cpe}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <p className={styles.empty}>No service data available in this export.</p>
        )}
      </div>
    </div>
  );
}
