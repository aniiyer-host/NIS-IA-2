import styles from './Recommendations.module.css';

export default function Recommendations({ recommendations }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className="section-header">
        <div className="section-icon">💊</div>
        <h2>Recommendations</h2>
      </div>

      <div className={styles.list}>
        {recommendations.map((rec, i) => (
          <div key={rec.id} className={styles.item}>
            <div className={styles.num}>{i + 1}</div>
            <div className={styles.body}>
              <span className={styles.recIcon}>{rec.icon}</span>
              <p>{rec.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
