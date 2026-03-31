// ─── Risk Scoring ────────────────────────────────────────────────────────────

const RISKY_PORTS = {
  21:   { label: 'FTP',    risk: 'high',   score: 40 },
  23:   { label: 'Telnet', risk: 'high',   score: 50 },
  3389: { label: 'RDP',   risk: 'medium', score: 20 },
  445:  { label: 'SMB',   risk: 'high',   score: 35 },
  139:  { label: 'NetBIOS', risk: 'medium', score: 15 },
  22:   { label: 'SSH',   risk: 'low',    score: 5  },
  80:   { label: 'HTTP',  risk: 'low',    score: 5  },
  443:  { label: 'HTTPS', risk: 'low',    score: 0  },
};

const OUTDATED_PATTERNS = [
  /apache\/2\.[0-3]\./i,
  /openssh[_ ]([1-6]\.|7\.[0-5])/i,
  /nginx\/1\.(0|1[0-7])\./i,
  /iis\/[1-8]\./i,
  /php\/[1-6]\./i,
  /vsftpd 2\./i,
  /proftpd 1\.[0-3]\./i,
];

export function analyzeData(json) {
  const ports   = json.ports  ?? [];
  const data    = json.data   ?? [];

  // ── per-port risk info ─────────────────────────────────────────────────────
  const portDetails = ports.map((p) => ({
    port: p,
    ...(RISKY_PORTS[p] ?? { label: 'Unknown', risk: 'none', score: 10 }),
  }));

  // ── outdated service detection ─────────────────────────────────────────────
  const outdatedServices = [];
  data.forEach((entry) => {
    const banner = [entry.product, entry.version, entry.banner, entry.data]
      .filter(Boolean)
      .join(' ');
    const matched = OUTDATED_PATTERNS.some((re) => re.test(banner));
    if (matched) {
      outdatedServices.push({
        port:    entry.port,
        product: entry.product ?? 'Unknown',
        version: entry.version ?? 'Unknown',
        banner,
      });
    }
  });

  // ── score calc ─────────────────────────────────────────────────────────────
  let score = 0;
  let hasTelnet = false, hasFTP = false;

  portDetails.forEach(({ port, score: ps }) => {
    if (port === 23) hasTelnet = true;
    if (port === 21) hasFTP = true;
    score += ps ?? 10;
  });

  if (outdatedServices.length > 0) score += 30;

  // ── clamp score ────────────────────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score));

  // ── risk level ─────────────────────────────────────────────────────────────
  let riskLevel;
  if      (score >= 80) riskLevel = 'critical';
  else if (score >= 50) riskLevel = 'high';
  else if (score >= 25) riskLevel = 'medium';
  else                  riskLevel = 'low';

  // ── vulnerability warnings ─────────────────────────────────────────────────
  const warnings = [];
  if (hasTelnet) warnings.push({ id: 'telnet', icon: '⚠️', severity: 'high',   text: 'Telnet detected – insecure, cleartext protocol. Remote access exposed.' });
  if (hasFTP)    warnings.push({ id: 'ftp',    icon: '⚠️', severity: 'high',   text: 'FTP detected – unencrypted file transfer. Credentials sent in plaintext.' });
  if (ports.includes(3389)) warnings.push({ id: 'rdp', icon: '⚠️', severity: 'medium', text: 'RDP (port 3389) exposed – susceptible to brute-force & BlueKeep-style exploits.' });
  if (ports.includes(445))  warnings.push({ id: 'smb', icon: '⚠️', severity: 'high',   text: 'SMB (port 445) exposed – potential EternalBlue / ransomware vector.' });
  if (outdatedServices.length > 0) {
    warnings.push({ id: 'outdated', icon: '🔴', severity: 'high', text: `Outdated software detected on ${outdatedServices.length} service(s). Unpatched CVEs likely.` });
  }

  // ── recommendations ────────────────────────────────────────────────────────
  const recommendations = [];
  if (hasTelnet)  recommendations.push({ id: 'r1', icon: '🔒', text: 'Disable Telnet immediately. Use SSH (port 22) with key-based authentication.' });
  if (hasFTP)     recommendations.push({ id: 'r2', icon: '🔒', text: 'Replace FTP with SFTP or FTPS. Avoid transmitting credentials over plaintext.' });
  if (ports.includes(3389)) recommendations.push({ id: 'r3', icon: '🛡️', text: 'Restrict RDP access via firewall allowlist. Enable NLA and use a VPN.' });
  if (ports.includes(445))  recommendations.push({ id: 'r4', icon: '🛡️', text: 'Block SMB port 445 from public internet. Apply latest Windows security patches.' });
  if (outdatedServices.length) recommendations.push({ id: 'r5', icon: '🔄', text: 'Update all outdated services to current stable versions to mitigate known CVEs.' });

  const extraPorts = portDetails.filter(({ port }) => !Object.keys(RISKY_PORTS).map(Number).includes(port));
  if (extraPorts.length > 3) recommendations.push({ id: 'r6', icon: '🚪', text: `Close unused ports. ${extraPorts.length} uncommon port(s) detected – reduce attack surface.` });

  recommendations.push({ id: 'r7', icon: '🔍', text: 'Run regular vulnerability scans (e.g., Nessus, OpenVAS) to catch new exposures.' });

  return {
    score,
    riskLevel,
    portDetails,
    outdatedServices,
    warnings,
    recommendations,
    hasTelnet,
    hasFTP,
  };
}

export function getPortRisk(port) {
  return RISKY_PORTS[port] ?? null;
}

export function getRiskColor(risk) {
  switch (risk) {
    case 'critical': return '#ff2d55';
    case 'high':     return '#ff4444';
    case 'medium':   return '#ffaa00';
    case 'low':      return '#00e676';
    default:         return '#64748b';
  }
}

export function getRiskPercent(score) {
  return Math.min(100, score);
}
