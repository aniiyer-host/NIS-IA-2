import styles from './OpenPorts.module.css';

const PORT_SERVICES = {
  21:   { name: 'FTP',    icon: '📂' },
  22:   { name: 'SSH',    icon: '🔐' },
  23:   { name: 'Telnet', icon: '📡' },
  25:   { name: 'SMTP',   icon: '📧' },
  53:   { name: 'DNS',    icon: '🌐' },
  80:   { name: 'HTTP',   icon: '🌍' },
  110:  { name: 'POP3',   icon: '📬' },
  143:  { name: 'IMAP',   icon: '📩' },
  443:  { name: 'HTTPS',  icon: '🔒' },
  445:  { name: 'SMB',    icon: '🗂️' },
  3306: { name: 'MySQL',  icon: '🗄️' },
  3389: { name: 'RDP',    icon: '🖥️' },
  5432: { name: 'PgSQL',  icon: '🐘' },
  6379: { name: 'Redis',  icon: '♦️' },
  8080: { name: 'HTTP-Alt', icon: '🌐' },
  8443: { name: 'HTTPS-Alt', icon: '🔒' },
  27017:{ name: 'MongoDB', icon: '🍃' },
};

const RISK_MAP = {
  21:   'high',
  23:   'high',
  445:  'high',
  3389: 'medium',
  139:  'medium',
  3306: 'medium',
  27017:'medium',
  6379: 'medium',
};

function getRisk(port) {
  return RISK_MAP[port] ?? 'low';
}

export default function OpenPorts({ ports }) {
  const sorted = [...ports].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[getRisk(a)] - order[getRisk(b)] || a - b;
  });

  return (
    <div className={`card ${styles.card}`}>
      <div className="section-header">
        <div className="section-icon">🚪</div>
        <h2>Open Ports <span className={styles.count}>{ports.length}</span></h2>
      </div>

      <div className={styles.portGrid}>
        {sorted.map((port) => {
          const risk  = getRisk(port);
          const svc   = PORT_SERVICES[port] ?? { name: 'Unknown', icon: '❓' };
          return (
            <div key={port} className={`${styles.portChip} ${styles[`risk_${risk}`]}`}>
              <span className={styles.portIcon}>{svc.icon}</span>
              <div className={styles.portInfo}>
                <span className={styles.portNum}>{port}</span>
                <span className={styles.portSvc}>{svc.name}</span>
              </div>
              <span className={`badge badge-${risk}`}>{risk}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
