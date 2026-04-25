import { useState, useMemo, useRef, useEffect } from 'react';
import { domains, getAllIndicators, calculateIPS } from '../data/indicators';
import type { FlatIndikator } from '../data/indicators';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LEVEL_COLORS = ['#F85149', '#F0883E', '#E3B341', '#58A6FF', '#3FB950'];
const LEVEL_NAMES = ['Rintisan', 'Terkelola', 'Terdefinisi', 'Terpadu & Terukur', 'Optimum'];
const PREDIKAT_COLORS: Record<string, string> = {
  'Kurang': '#F85149',
  'Cukup': '#F0883E',
  'Baik': '#E3B341',
  'Sangat Baik': '#58A6FF',
  'Memuaskan': '#3FB950',
};

export default function SimulasiPanel() {
  const allIndicators = useMemo(() => getAllIndicators(), []);
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    allIndicators.forEach(ind => { init[ind.kode] = 1; });
    return init;
  });
  const [activeDomain, setActiveDomain] = useState(1);
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [confirmTargetLevel, setConfirmTargetLevel] = useState<number | null>(null);

  const result = useMemo(() => calculateIPS(scores), [scores]);

  const setLevelForDomain = (domainId: number, level: number) => {
    const updated = { ...scores };
    allIndicators.filter(i => i.domainId === domainId).forEach(i => { updated[i.kode] = level; });
    setScores(updated);
  };

  const setAllLevels = (level: number) => {
    const updated: Record<string, number> = {};
    allIndicators.forEach(i => { updated[i.kode] = level; });
    setScores(updated);
    setConfirmTargetLevel(null);
  };

  const radarData = useMemo(() => ({
    labels: domains.map(d => d.namaShort),
    datasets: [{
      label: 'Skor Domain',
      data: domains.map(d => result.domainScores[d.id] || 1),
      backgroundColor: 'rgba(212, 168, 67, 0.15)',
      borderColor: '#D4A843',
      borderWidth: 2,
      pointBackgroundColor: '#D4A843',
      pointBorderColor: '#F0C95E',
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  }), [result]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: '#5A6575',
          backdropColor: 'transparent',
          font: { size: 11 },
        },
        grid: { color: 'rgba(139, 148, 158, 0.1)' },
        angleLines: { color: 'rgba(139, 148, 158, 0.1)' },
        pointLabels: {
          color: '#8B949E',
          font: { size: 12, family: 'Plus Jakarta Sans' },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#151D2E',
        borderColor: 'rgba(212, 168, 67, 0.3)',
        borderWidth: 1,
        titleFont: { family: 'Plus Jakarta Sans' },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (ctx: any) => `Skor: ${ctx.raw.toFixed(2)}`,
        },
      },
    },
  };

  const domainIndicators = allIndicators.filter(i => i.domainId === activeDomain);
  const predikatColor = PREDIKAT_COLORS[result.predikat] || '#8B949E';

  // Modal close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') {
        setShowModal(false);
        setConfirmTargetLevel(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (showModal || confirmTargetLevel !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [showModal, confirmTargetLevel]);

  return (
    <div className="sim-container">
      {/* IPS Result Header */}
      <div className="sim-result-bar">
        <div className="ips-display">
          <span className="ips-label">Estimasi IPS</span>
          <span className="ips-value" style={{ color: predikatColor }}>{result.ips.toFixed(2)}</span>
          <span className="ips-predikat" style={{ background: `${predikatColor}20`, color: predikatColor, border: `1px solid ${predikatColor}40` }}>
            {result.predikat}
          </span>
        </div>
        <div className="quick-actions">
          <div className="set-semua-group">
            <span className="qa-label">Set Semua:</span>
            {[1,2,3,4,5].map(l => (
              <button key={l} className="level-btn-sm" style={{ background: `${LEVEL_COLORS[l-1]}20`, color: LEVEL_COLORS[l-1] }}
                onClick={() => setConfirmTargetLevel(l)}>
                {l}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm rekap-btn" onClick={() => setShowModal(true)}>
            📊 Rekapitulasi
          </button>
        </div>
      </div>

      <div className="sim-body">
        {/* Indicators List (Full width or main area) */}
        <div className="sim-left full-width">
          <div className="domain-tabs">
            {domains.map(d => (
              <button key={d.id}
                className={`domain-tab ${activeDomain === d.id ? 'active' : ''}`}
                onClick={() => setActiveDomain(d.id)}>
                <span className="dt-icon">{d.icon}</span>
                <span className="dt-name">{d.namaShort}</span>
                <span className="dt-score" style={{ color: LEVEL_COLORS[Math.round(result.domainScores[d.id] || 1) - 1] }}>
                  {(result.domainScores[d.id] || 1).toFixed(2)}
                </span>
              </button>
            ))}
          </div>

          <div className="domain-quick-set">
            <span>Set Domain {activeDomain}:</span>
            {[1,2,3,4,5].map(l => (
              <button key={l} className="level-btn-sm"
                style={{ background: `${LEVEL_COLORS[l-1]}20`, color: LEVEL_COLORS[l-1] }}
                onClick={() => setLevelForDomain(activeDomain, l)}>
                L{l}
              </button>
            ))}
          </div>

          <div className="indicators-list">
            {domainIndicators.map(ind => (
              <div key={ind.kode} className="ind-row">
                <div className="ind-row-header" onClick={() => setExpandedIndicator(expandedIndicator === ind.kode ? null : ind.kode)}>
                  <div className="ind-row-left">
                    <span className="ind-kode">{ind.kode}</span>
                    <div className="ind-row-info">
                      <span className="ind-row-name">{ind.nama}</span>
                      <span className="ind-row-weight">Bobot: {ind.bobotRelatif.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="level-selector">
                    {[1,2,3,4,5].map(l => (
                      <button key={l}
                        className={`level-btn ${scores[ind.kode] === l ? 'active' : ''}`}
                        data-level={l}
                        onClick={(e) => { e.stopPropagation(); setScores(prev => ({ ...prev, [ind.kode]: l })); }}
                        title={LEVEL_NAMES[l-1]}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                {expandedIndicator === ind.kode && (
                  <div className="ind-row-detail">
                    <p className="ind-row-desc">{ind.deskripsi}</p>
                    <div className="ind-current-level">
                      <strong style={{ color: LEVEL_COLORS[scores[ind.kode] - 1] }}>
                        Level {scores[ind.kode]} — {LEVEL_NAMES[scores[ind.kode] - 1]}
                      </strong>
                      <p>{ind.levels[scores[ind.kode] - 1]?.kriteria}</p>
                      <ul>
                        {ind.levels[scores[ind.kode] - 1]?.buktiDukung.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Set Semua */}
      {confirmTargetLevel !== null && (
        <div className="sim-modal-overlay small" onClick={() => setConfirmTargetLevel(null)}>
          <div className="sim-modal-content confirm animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon" style={{ color: LEVEL_COLORS[confirmTargetLevel-1] }}>⚠️</div>
            <h3>Konfirmasi Perubahan</h3>
            <p>
              Apakah Anda yakin ingin mengatur <strong>semua 38 indikator</strong> ke 
              <span className="badge" style={{ 
                background: `${LEVEL_COLORS[confirmTargetLevel-1]}20`, 
                color: LEVEL_COLORS[confirmTargetLevel-1],
                marginLeft: '8px'
              }}>
                Level {confirmTargetLevel}
              </span>?
            </p>
            <div className="confirm-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmTargetLevel(null)}>Batal</button>
              <button className="btn btn-primary btn-sm" style={{ background: LEVEL_COLORS[confirmTargetLevel-1], color: 'white' }}
                onClick={() => setAllLevels(confirmTargetLevel)}>
                Ya, Set Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rekapitulasi Modal */}
      {showModal && (
        <div className="sim-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sim-modal-content animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="sim-modal-header">
              <h3>📊 Rekapitulasi Hasil Simulasi</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <div className="sim-modal-body">
              <div className="sim-modal-grid">
                {/* Left: Score Overview */}
                <div className="modal-ips-summary">
                  <div className="ips-card larger">
                    <span className="ips-label">Indeks Pembangunan Statistik</span>
                    <span className="ips-value" style={{ color: predikatColor }}>{result.ips.toFixed(2)}</span>
                    <span className="ips-predikat" style={{ background: `${predikatColor}20`, color: predikatColor, border: `1px solid ${predikatColor}40` }}>
                      {result.predikat}
                    </span>
                  </div>
                  
                  <div className="chart-card modal-section">
                    <h3>Profil Domain</h3>
                    <div className="chart-wrapper">
                      <Radar data={radarData} options={radarOptions} />
                    </div>
                  </div>
                </div>

                {/* Center: Domain Breakdown */}
                <div className="breakdown-card modal-section">
                  <h3>Breakdown per Domain</h3>
                  <div className="modal-scroll-area">
                    {domains.map(d => {
                      const domScore = result.domainScores[d.id] || 1;
                      const pct = ((domScore - 1) / 4) * 100;
                      const color = LEVEL_COLORS[Math.min(Math.round(domScore) - 1, 4)];
                      return (
                        <div key={d.id} className="breakdown-row">
                          <div className="br-header">
                            <span className="br-name">{d.icon} {d.namaShort}</span>
                            <span className="br-score" style={{ color }}>{domScore.toFixed(2)}</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%`, background: color }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: High Weight Indicators */}
                <div className="gap-card modal-section">
                  <h3>🔥 Indikator Berbobot Tinggi</h3>
                  <div className="modal-scroll-area">
                    <div className="gap-list">
                      {allIndicators
                        .sort((a, b) => b.bobotRelatif - a.bobotRelatif)
                        .slice(0, 10)
                        .map(ind => (
                          <div key={ind.kode} className="gap-item">
                            <span className="gap-kode">{ind.kode}</span>
                            <span className="gap-name">{ind.nama}</span>
                            <span className="gap-weight">{ind.bobotRelatif.toFixed(2)}%</span>
                            <span className={`gap-level`} style={{ color: LEVEL_COLORS[scores[ind.kode] - 1] }}>
                              L{scores[ind.kode]}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sim-modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Tutup</button>
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>📥 Cetak Rekap</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
