import styles from './DeviceSummary.module.css';

const InfoRow = ({ label, value, mono }) => (
  <div className={styles.infoRow}>
    <span className={styles.label}>{label}</span>
    <span className={`${styles.value} ${mono ? 'mono' : ''}`}>{value || '—'}</span>
  </div>
);

export default function DeviceSummary({ data }) {
  const ip      = data.ip_str;
  const org     = data.org;
  const city    = data.city;
  const country = data.country_name;
  const asn     = data.asn;
  const os      = data.os;
  const isp     = data.isp;
  const hostnames = Array.isArray(data.hostnames) ? data.hostnames.join(', ') : '—';
  const tags    = Array.isArray(data.tags) ? data.tags : [];

  return (
    <div className={`card ${styles.card}`}>
      <div className="section-header">
        <div className="section-icon">🖥️</div>
        <h2>Device Summary</h2>
      </div>

      <div className={styles.ipBlock}>
        <div className={styles.ipDot} />
        <span className={styles.ip}>{ip}</span>
        {tags.map((t) => (
          <span key={t} className="badge badge-info">{t}</span>
        ))}
      </div>

      <div className={styles.grid}>
        <InfoRow label="Organization" value={org} />
        <InfoRow label="ISP"          value={isp} />
        <InfoRow label="Location"     value={[city, country].filter(Boolean).join(', ') || '—'} />
        <InfoRow label="ASN"          value={asn}  mono />
        <InfoRow label="OS"           value={os} />
        <InfoRow label="Hostnames"    value={hostnames} mono />
      </div>
    </div>
  );
}
