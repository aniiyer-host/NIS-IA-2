import styles from './RiskPanel.module.css';
import { getRiskColor } from '../utils/analyzer';

const LEVEL_LABELS = {
  low:      { label: 'LOW',      color: '#00e676', bg: '#00e67614', icon: '🟢' },
  medium:   { label: 'MEDIUM',   color: '#ffaa00', bg: '#ffaa0014', icon: '🟡' },
  high:     { label: 'HIGH',     color: '#ff4444', bg: '#ff444414', icon: '🔴' },
  critical: { label: 'CRITICAL', color: '#ff2d55', bg: '#ff2d5514', icon: '🚨' },
};

export default function RiskPanel({ score, riskLevel, portDetails, outdatedServices }) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const config  = LEVEL_LABELS[riskLevel] ?? LEVEL_LABELS.low;
  const percent = normalizedScore;

  const breakdown = [
    { label: 'Telnet (port 23)', active: portDetails.some(p => p.port === 23), pts: 50 },
    { label: 'FTP (port 21)',    active: portDetails.some(p => p.port === 21), pts: 40 },
    { label: 'Outdated software detected', active: outdatedServices.length > 0, pts: 30 },
    { label: 'Extra open ports',
      active: portDetails.length > 2,
      pts: portDetails.filter(p => ![21,23,3389,22,80,443].includes(p.port)).length * 10 },
    { label: 'RDP (port 3389)', active: portDetails.some(p => p.port === 3389), pts: 20 },
  ].filter(r => r.active);

  return (
    <div className={`card ${styles.card}`} style={{ '--level-color': config.color, '--level-bg': config.bg }}>
      <div className="section-header">
        <div className="section-icon">🎯</div>
        <h2>Risk Analysis</h2>
      </div>

      <div className={styles.scoreRow}>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 80 80" className={styles.ring}>
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface-2)" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke={config.color} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(percent / 100) * 213.6} 213.6`}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${config.color}88)` }}
            />
          </svg>
          <div className={styles.scoreInner}>
            <span className={styles.scoreNum}>{normalizedScore}</span>
            <span className={styles.scorePts}>pts</span>
          </div>
        </div>

        <div className={styles.scoreInfo}>
          <div
            className={styles.levelBadge}
            style={{ color: config.color, background: config.bg, border: `1px solid ${config.color}44` }}
          >
            {config.icon} {config.label} RISK
          </div>
          <p className={styles.scoreDesc}>
            {riskLevel === 'low'      && 'No critical vulnerabilities detected. Maintain good hygiene.'}
            {riskLevel === 'medium'   && 'Some risky services detected. Review and remediate promptly.'}
            {riskLevel === 'high'     && 'Multiple serious vulnerabilities. Immediate action required.'}
            {riskLevel === 'critical' && 'Critical exposure level! This host is severely compromised.'}
          </p>

          <div className={styles.bar}>
            <div
              className={styles.barFill}
              style={{
                width: `${percent}%`,
                background: `linear-gradient(90deg, ${config.color}88, ${config.color})`,
                boxShadow: `0 0 12px ${config.color}66`,
              }}
            />
          </div>
          <span className={styles.barLabel}>{percent}/100 risk score</span>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className={styles.breakdown}>
          <p className={styles.breakdownTitle}>Score Breakdown</p>
          {breakdown.map((item, i) => (
            <div key={i} className={styles.breakdownRow}>
              <span className={styles.breakdownDot} style={{ background: config.color }} />
              <span className={styles.breakdownLabel}>{item.label}</span>
              <span className={styles.breakdownPts} style={{ color: config.color }}>+{item.pts}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
