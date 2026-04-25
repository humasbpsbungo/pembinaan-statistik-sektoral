import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { domains, getAllIndicators, calculateIPS } from '../data/indicators';
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
const LEVEL_NAMES = ['Rintisan', 'Terkelola', 'Terdefinisi', 'Terpadu', 'Optimum'];
const PREDIKAT_COLORS: Record<string, string> = {
  'Kurang': '#F85149',
  'Cukup': '#F0883E',
  'Baik': '#E3B341',
  'Sangat Baik': '#58A6FF',
  'Memuaskan': '#3FB950',
};

interface BuktiData {
  id?: string;
  kode_indikator: string;
  level_target: number;
  deskripsi_bukti: string;
  link_drive: string;
  status: 'belum' | 'sedang_disiapkan' | 'sudah';
}

export default function BuktiDukungDashboard() {
  const allIndicators = useMemo(() => getAllIndicators(), []);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ nama_instansi: string; email: string } | null>(null);
  const [data, setData] = useState<Record<string, BuktiData>>({});
  const dataRef = useRef(data);
  const saveTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const lastEditTime = useRef<Record<string, number>>({});
  
  const [loading, setLoading] = useState(true);
  const [savingMsg, setSavingMsg] = useState<string | null>(null);
  const [showRekapModal, setShowRekapModal] = useState(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('bukti_dukung_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bukti_dukung', filter: `user_id=eq.${userId}` },
        (payload) => {
          const newRow = payload.new as any;
          if (!newRow || !newRow.kode_indikator) return;
          
          const kode = newRow.kode_indikator;
          const lastEdit = lastEditTime.current[kode] || 0;
          
          // Ignore realtime updates if we edited this locally within the last 3 seconds
          if (Date.now() - lastEdit > 3000) {
            setData(prev => ({
              ...prev,
              [kode]: {
                ...prev[kode],
                id: newRow.id,
                level_target: newRow.level_target || 1,
                status: newRow.status || 'belum',
                deskripsi_bukti: newRow.deskripsi_bukti || '',
                link_drive: newRow.link_drive || ''
              }
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function init() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setUserId(user.id);

    const { data: prof } = await supabase
      .from('profiles')
      .select('nama_instansi')
      .eq('id', user.id)
      .single();

    setProfile({
      nama_instansi: prof?.nama_instansi || user.email || '',
      email: user.email || ''
    });

    const { data: existingBukti } = await supabase
      .from('bukti_dukung')
      .select('*')
      .eq('user_id', user.id);

    const initData: Record<string, BuktiData> = {};
    // Initialize defaults
    allIndicators.forEach(ind => {
      initData[ind.kode] = {
        kode_indikator: ind.kode,
        level_target: 1,
        deskripsi_bukti: '',
        link_drive: '',
        status: 'belum'
      };
    });

    // Merge fetched
    existingBukti?.forEach(b => {
      initData[b.kode_indikator] = {
        id: b.id,
        kode_indikator: b.kode_indikator,
        level_target: b.level_target || 1,
        deskripsi_bukti: b.deskripsi_bukti || '',
        link_drive: b.link_drive || '',
        status: b.status || 'belum'
      };
    });

    setData(initData);
    setLoading(false);
  }

  const scores = useMemo(() => {
    const sc: Record<string, number> = {};
    Object.values(data).forEach(d => {
      sc[d.kode_indikator] = d.level_target;
    });
    return sc;
  }, [data]);

  const ipsResult = useMemo(() => calculateIPS(scores), [scores]);
  
  const progressStats = useMemo(() => {
    const stats: Record<number, { total: number, ready: number }> = {};
    domains.forEach(d => stats[d.id] = { total: 0, ready: 0 });
    
    let totalReady = 0;
    
    allIndicators.forEach(ind => {
      const isReady = data[ind.kode]?.status === 'sudah';
      stats[ind.domainId].total += 1;
      if (isReady) {
        stats[ind.domainId].ready += 1;
        totalReady += 1;
      }
    });

    return {
      overall: Math.round((totalReady / allIndicators.length) * 100),
      totalReady,
      domainStats: stats
    };
  }, [data, allIndicators]);

  const handleChange = (kode: string, field: keyof BuktiData, value: any) => {
    lastEditTime.current[kode] = Date.now();
    setData(prev => ({
      ...prev,
      [kode]: {
        ...prev[kode],
        [field]: value
      }
    }));

    if (saveTimeouts.current[kode]) {
      clearTimeout(saveTimeouts.current[kode]);
    }

    saveTimeouts.current[kode] = setTimeout(() => {
      saveIndicator(kode);
    }, 1000);
  };

  const saveIndicator = async (kode: string) => {
    if (!userId) return;
    
    const row = dataRef.current[kode];
    
    setSavingMsg(`Menyimpan ${kode}...`);

    try {
      if (row.id) {
        const { error } = await supabase.from('bukti_dukung').update({
          level_target: row.level_target,
          status: row.status,
          deskripsi_bukti: row.deskripsi_bukti,
          link_drive: row.link_drive,
          updated_at: new Date().toISOString()
        }).eq('id', row.id);
        
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase.from('bukti_dukung').insert({
          user_id: userId,
          kode_indikator: kode,
          level_target: row.level_target,
          status: row.status,
          deskripsi_bukti: row.deskripsi_bukti,
          link_drive: row.link_drive
        }).select().single();
        
        if (error) throw error;
        
        if (inserted) {
          setData(prev => ({
            ...prev,
            [kode]: {
              ...prev[kode],
              id: inserted.id
            }
          }));
        }
      }
      
      setSavingMsg(`✓ ${kode} Tersimpan`);
    } catch (err: any) {
      console.error("Save error:", err);
      setSavingMsg(`❌ Gagal menyimpan ${kode}: ${err.message || 'Unknown error'}`);
    }
    
    setTimeout(() => setSavingMsg(null), 3000);
  };

  const predikatColor = PREDIKAT_COLORS[ipsResult.predikat] || '#8B949E';

  // Modal: close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowRekapModal(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showRekapModal ? 'hidden' : 'unset';
  }, [showRekapModal]);

  // Radar chart data (same as SimulasiPanel)
  const radarData = useMemo(() => ({
    labels: domains.map(d => d.namaShort),
    datasets: [{
      label: 'Skor Domain',
      data: domains.map(d => ipsResult.domainScores[d.id] || 1),
      backgroundColor: 'rgba(212, 168, 67, 0.15)',
      borderColor: '#D4A843',
      borderWidth: 2,
      pointBackgroundColor: '#D4A843',
      pointBorderColor: '#F0C95E',
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  }), [ipsResult]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0, max: 5,
        ticks: { stepSize: 1, color: '#5A6575', backdropColor: 'transparent', font: { size: 11 } },
        grid: { color: 'rgba(139, 148, 158, 0.1)' },
        angleLines: { color: 'rgba(139, 148, 158, 0.1)' },
        pointLabels: { color: '#8B949E', font: { size: 12, family: 'Plus Jakarta Sans' } },
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
        callbacks: { label: (ctx: any) => `Skor: ${ctx.raw.toFixed(2)}` },
      },
    },
  };

  if (loading) {
    return <div className="loading-text">Memuat Dashboard Persiapan...</div>;
  }

  return (
    <>
    <div className="bd-dashboard animate-fadeInUp">
      {/* Main List */}
      <div className="bd-main-content">
        {domains.map(d => {
          const domInds = allIndicators.filter(i => i.domainId === d.id);
          const domStats = progressStats.domainStats[d.id];
          const domPct = domStats.total > 0 ? Math.round((domStats.ready / domStats.total) * 100) : 0;
          const domScore = ipsResult.domainScores[d.id] || 1;
          const domColor = LEVEL_COLORS[Math.min(Math.round(domScore) - 1, 4)];

          return (
            <div key={d.id} className="bd-domain-section">
              <div className="bd-domain-header">
                <div className="bd-dh-left">
                  <h2 className="bd-dh-title">{d.icon} Domain {d.id}: {d.namaShort}</h2>
                  <div className="bd-dh-progress">
                    <span className="badge" style={{ background: `${domColor}20`, color: domColor }}>Skor: {domScore.toFixed(2)}</span>
                    <span className="badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>Kesiapan: {domPct}%</span>
                  </div>
                </div>
              </div>

              <div className="bd-indicator-list">
                <div className="bd-list-header">
                  <div>Kode</div>
                  <div>Nama Indikator</div>
                  <div>Target Level</div>
                  <div>Status Draft</div>
                  <div>Deskripsi Internal</div>
                  <div>Link Folder / Dokumen</div>
                </div>
                {domInds.map(ind => {
                  const row = data[ind.kode];
                  const isDone = row.status === 'sudah';
                  
                  return (
                    <div key={ind.kode} className={`bd-compact-row ${isDone ? 'done' : ''}`}>
                      <div className="row-col">
                        <span className="ind-kode">{ind.kode}</span>
                      </div>
                      <div className="row-col">
                        <span className="ind-name" title={ind.nama}>{ind.nama}</span>
                      </div>
                      <div className="row-col">
                        <div className="level-selector-compact">
                          {[1,2,3,4,5].map(l => (
                            <button key={l}
                              className={`level-btn-compact ${row.level_target === l ? 'active' : ''}`}
                              onClick={() => handleChange(ind.kode, 'level_target', l)}
                              title={LEVEL_NAMES[l-1]}
                              style={row.level_target === l ? { background: LEVEL_COLORS[l-1], borderColor: LEVEL_COLORS[l-1], color: '#fff' } : {}}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="row-col">
                        <select 
                          className={`form-select status-select ${row.status}`}
                          value={row.status}
                          onChange={(e) => handleChange(ind.kode, 'status', e.target.value)}
                        >
                          <option value="belum">🔴 Belum Ada</option>
                          <option value="sedang_disiapkan">🟡 Sedang Reviu</option>
                          <option value="sudah">🟢 Sudah Final</option>
                        </select>
                      </div>
                      <div className="row-col">
                        <input 
                          type="text"
                          className="row-input" 
                          placeholder="Catatan..."
                          value={row.deskripsi_bukti}
                          onChange={(e) => handleChange(ind.kode, 'deskripsi_bukti', e.target.value)}
                        />
                      </div>
                      <div className="row-col">
                        <input 
                          type="url" 
                          className="row-input" 
                          placeholder="https://drive.google.com/..."
                          value={row.link_drive}
                          onChange={(e) => handleChange(ind.kode, 'link_drive', e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      </div>

      {/* Floating Target IPS Widget — compact horizontal layout */}
      <div className="bd-floating-widget">
        <div className="bd-fw-row">
          <div className="ips-card-mini">
            <span className="ips-label-mini">Target IPS</span>
            <span className="ips-value-mini" style={{ color: predikatColor }}>{ipsResult.ips.toFixed(2)}</span>
            <span className="ips-predikat-mini" style={{ background: `${predikatColor}20`, color: predikatColor, border: `1px solid ${predikatColor}40` }}>
              {ipsResult.predikat}
            </span>
          </div>
          
          <div className="bd-fw-right">
            <div className="progress-card-mini">
              <div className="progress-info-mini">
                <span className="progress-percent-mini">{progressStats.overall}%</span>
                <span className="progress-text-mini">{progressStats.totalReady}/38</span>
              </div>
              <div className="progress-bar-bg-mini">
                <div className="progress-bar-fill-mini" style={{ width: `${progressStats.overall}%` }}></div>
              </div>
            </div>
            <button className="btn btn-primary btn-sm rekap-btn-bd" onClick={() => setShowRekapModal(true)}>
              📊 Rekap
            </button>
          </div>
        </div>

        {savingMsg && <div className="saving-toast">{savingMsg}</div>}
      </div>

      {/* Rekapitulasi Modal — same as SimulasiPanel */}
      {showRekapModal && (
        <div className="sim-modal-overlay" onClick={() => setShowRekapModal(false)}>
          <div className="sim-modal-content animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="sim-modal-header">
              <h3>📊 Rekapitulasi Hasil Simulasi</h3>
              <button className="modal-close" onClick={() => setShowRekapModal(false)}>&times;</button>
            </div>
            
            <div className="sim-modal-body">
              <div className="sim-modal-grid">
                {/* Left: Score Overview */}
                <div className="modal-ips-summary">
                  <div className="ips-card larger">
                    <span className="ips-label">Indeks Pembangunan Statistik</span>
                    <span className="ips-value" style={{ color: predikatColor }}>{ipsResult.ips.toFixed(2)}</span>
                    <span className="ips-predikat" style={{ background: `${predikatColor}20`, color: predikatColor, border: `1px solid ${predikatColor}40` }}>
                      {ipsResult.predikat}
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
                      const domScore = ipsResult.domainScores[d.id] || 1;
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
                            <span className="gap-level" style={{ color: LEVEL_COLORS[(data[ind.kode]?.level_target || 1) - 1] }}>
                              L{data[ind.kode]?.level_target || 1}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sim-modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowRekapModal(false)}>Tutup</button>
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>📥 Cetak Rekap</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
