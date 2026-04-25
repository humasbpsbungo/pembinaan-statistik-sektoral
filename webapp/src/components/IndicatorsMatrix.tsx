import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createPortal } from 'react-dom';

const PdfViewer = lazy(() => import('./PdfViewer'));

export default function IndicatorsMatrix({ domains }: { domains: any[] }) {
  const [selectedIndicator, setSelectedIndicator] = useState<any | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and allow Escape to close when panel is open
  useEffect(() => {
    if (selectedIndicator) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedIndicator(null);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedIndicator]);

  return (
    <div className="indicators-matrix-wrapper">
      <div className="matrix-scroll-container">
        <div className="epss-matrix">
          {domains.map((domain) => (
            <div key={domain.id} className="matrix-row">
              {/* DOMAIN BLOCK */}
              <div className="domain-card-wrap">
                <div className="domain-card">
                  <div className="dc-icon">{domain.icon}</div>
                  <h3 className="dc-title">{domain.nama}</h3>
                  <div className="dc-percent">Bobot: {domain.bobotDomain}%</div>
                </div>
              </div>

              {/* ASPEKS BLOCK */}
              <div className="aspeks-container">
                {domain.aspeks.map((aspek: any, aIdx: number) => (
                  <div key={aIdx} className="aspek-col">
                    {/* ASPEK HEADER */}
                    <div className="aspek-card">
                      <div className="ac-title">{aspek.nama}</div>
                    </div>
                    
                    {/* INDICATORS ROW (Underneath Aspek) */}
                    <div className="indikators-row">
                      {aspek.indikators.map((ind: any) => (
                        <div 
                          key={ind.kode} 
                          className="indikator-card"
                          onClick={() => { 
                            setSelectedIndicator({ ...ind, domainPdfFile: domain.pdfFile });
                            setShowPdf(false);
                          }}
                          title="Klik untuk melihat detail"
                        >
                          <div className="ic-head">
                            <span className="ic-code">{ind.kode}</span>
                            <span className="ic-percent">{ind.bobotRelatif}%</span>
                          </div>
                          <div className="ic-title">{ind.nama}</div>
                          {ind.isGeneral && (
                            <div className="ic-star" title="Indikator Umum">★</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {mounted && createPortal(
        <div 
          className={`modal-backdrop ${selectedIndicator ? 'active' : ''}`}
          onClick={() => setSelectedIndicator(null)}
        >
          <div 
            className="modal-panel"
            onClick={(e) => e.stopPropagation()} // Prevent bubbling to backdrop
          >
            {selectedIndicator && (
              <div className="modal-scroll-area">
                <button className="modal-close" onClick={() => setSelectedIndicator(null)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                
                <div className="modal-header inline-header">
                  <span className="modal-code">{selectedIndicator.kode}</span>
                  <h2>{selectedIndicator.nama}</h2>
                  <span className="badge-meta">Bobot Relatif: {selectedIndicator.bobotRelatif}%</span>
                  {selectedIndicator.isGeneral && <span className="badge-meta general-badge">Indikator Umum</span>}
                  
                  {/* Removed header button */}
                </div>

                <div className="modal-body">
                  <div className="modal-section">
                    <h3>Deskripsi</h3>
                    <p>
                      {selectedIndicator.deskripsi}
                      {selectedIndicator.domainPdfFile && (
                        <button 
                          className="btn btn-sm btn-primary" 
                          onClick={() => setShowPdf(!showPdf)}
                          style={{ marginLeft: '8px', padding: '2px 8px', fontSize: '0.85rem', verticalAlign: 'middle' }}
                          title="Lihat Referensi PDF"
                        >
                          {showPdf ? 'Hide Detail' : 'Detail'}
                        </button>
                      )}
                    </p>
                    
                    {showPdf && selectedIndicator.domainPdfFile && (
                      <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Loading PDF Viewer...</div>}>
                        <PdfViewer 
                          fileUrl={`/pdfs/${selectedIndicator.domainPdfFile}`}
                          initialPage={selectedIndicator.pdfPage || 1}
                        />
                      </Suspense>
                    )}
                  </div>

                  <div className="modal-section">
                    <h3>Tingkat Kematangan (Level 1-5)</h3>
                    <div className="table-wrapper levels-table-wrapper">
                      <table className="levels-table">
                        <thead>
                          <tr>
                            <th style={{ width: '20%' }}>Level</th>
                            <th style={{ width: '40%' }}>Kriteria</th>
                            <th style={{ width: '40%' }}>Bukti Dukung</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedIndicator.levels.map((lvl: any) => (
                            <tr key={lvl.level} className="level-row" style={{ '--row-color': lvl.warna } as any}>
                              <td className="level-cell">
                                <div className="level-badge-wrap">
                                  <span className="level-badge" style={{ backgroundColor: lvl.warna }}>Level {lvl.level}</span>
                                </div>
                                <strong className="level-name" style={{ color: lvl.warna }}>{lvl.nama}</strong>
                              </td>
                              <td className="kriteria-cell">
                                <p>{lvl.kriteria}</p>
                              </td>
                              <td className="bukti-cell">
                                <ul>
                                  {lvl.buktiDukung.map((b: string, i: number) => <li key={i}>{b}</li>)}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}



      <style>{`
        /* MATRIX LAYOUT */
        .indicators-matrix-wrapper {
          position: relative;
          width: 100%;
        }
        
        .matrix-scroll-container {
          width: 100%;
          overflow-x: auto;
          padding-bottom: 24px;
        }

        /* Scrollbar */
        .matrix-scroll-container::-webkit-scrollbar { height: 10px; }
        .matrix-scroll-container::-webkit-scrollbar-track { background: var(--bg-dark); border-radius: 8px; }
        .matrix-scroll-container::-webkit-scrollbar-thumb { background: #89c546; border-radius: 8px; }

        .epss-matrix {
          min-width: 1200px; /* Forces horizontal scrolling instead of crushing */
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .matrix-row {
          display: flex;
          gap: 8px;
          min-height: 140px;
        }

        /* DOMAIN (Left Column) */
        .domain-card-wrap {
          flex: 0 0 180px; /* Fixed width */
          display: flex;
          flex-direction: column;
        }
        .domain-card {
          background: var(--gradient-primary);
          color: var(--text-primary);
          padding: 20px;
          border-radius: 6px;
          height: 100%; /* Stretch to fill flex row */
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          border: 1px solid var(--border-color);
        }
        .dc-icon {
          font-size: 2rem;
          margin-bottom: 8px;
          opacity: 0.9;
        }
        .dc-title {
          font-size: 1.1rem;
          font-family: var(--font-heading);
          font-weight: 700;
          margin-bottom: auto; /* pushes percent to bottom */
          line-height: 1.3;
        }
        .dc-percent {
          font-size: 0.85rem;
          font-family: var(--font-mono);
          opacity: 0.8;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        /* ASPEKS CONTAINER */
        .aspeks-container {
          flex: 1;
          display: flex;
          gap: 8px;
        }
        .aspek-col {
          flex: 1; 
          display: flex;
          flex-direction: column;
          gap: 6px; /* gap between Aspek and its Indicators */
        }

        /* ASPEK CARD */
        .aspek-card {
          background-color: var(--bg-elevated);
          color: var(--text-primary);
          padding: 12px 16px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-bottom: 3px solid var(--primary-light);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          height: 80px; /* Fixed height for uniformity */
        }
        .ac-title {
          font-weight: 700;
          font-size: 0.95rem;
          line-height: 1.2;
        }

        /* INDICATORS ROW */
        .indikators-row {
          display: flex;
          gap: 6px;
          flex: 1; /* Stretch vertically */
        }

        /* INDICATOR CARD (Clickable) */
        .indikator-card {
          position: relative;
          flex: 1;
          background-color: var(--bg-card);
          color: var(--text-primary);
          padding: 12px;
          padding-bottom: 24px; /* Ensure space for the star at the bottom */
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          border-bottom: 2px solid var(--border-color);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .indikator-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
          background-color: var(--bg-card-hover);
          border-color: var(--accent);
          border-bottom-color: var(--accent);
        }
        .indikator-card:active {
          transform: translateY(0);
        }
        .ic-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .ic-code {
          background-color: var(--accent-soft);
          color: var(--accent);
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-weight: 700;
        }
        .ic-percent {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .ic-title {
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.4;
          opacity: 0.9;
        }
        .ic-star {
          position: absolute;
          bottom: 6px;
          right: 8px;
          color: #c85a40; /* Brownish-red star */
          font-size: 1.1rem;
          line-height: 1;
          user-select: none;
        }

        /* --- MODAL COMPONENT --- */
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;  /* Center vertically */
          justify-content: center; /* Center horizontally */
          padding: 20px;
        }
        .modal-backdrop.active {
          opacity: 1;
          pointer-events: auto;
        }

        .modal-panel {
          background-color: var(--bg-body);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 1200px;
          border-radius: 12px;
          box-shadow: 0 15px 50px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          overflow: hidden; /* Clips inner scrolling to preserve border-radius */
          /* Animation */
          transform: translateY(20px) scale(0.97);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          /* Max height constraint to enable internal scrolling */
          max-height: 85vh; 
        }
        .modal-backdrop.active .modal-panel {
          transform: translateY(0) scale(1);
        }

        .modal-scroll-area {
          padding: 40px;
          overflow-y: auto;
          flex: 1; /* Ensure child stays within max-height of parent */
          -webkit-overflow-scrolling: touch;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 24px; right: 24px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: var(--text-secondary);
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-close:hover {
          background: rgba(255,255,255,0.1);
          color: var(--text-primary);
        }

        .modal-header.inline-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .modal-header.inline-header h2 {
          font-size: 1.4rem;
          margin: 0;
          line-height: 1.3;
        }

        .modal-code {
          display: inline-block;
          background: var(--accent);
          color: var(--bg-dark);
          padding: 4px 12px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .badge-meta {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .general-badge {
          color: var(--accent);
          border-color: var(--accent);
        }

        .modal-section {
          margin-bottom: 32px;
        }
        .modal-section h3 {
          font-size: 1.1rem;
          color: var(--accent);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .modal-section p {
          color: var(--text-primary);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .levels-table-wrapper {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          background: var(--bg-card);
        }
        .levels-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .levels-table th {
          background: var(--bg-card-hover);
          color: var(--text-secondary);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border-color);
          text-align: left;
        }
        .levels-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: top;
          transition: background 0.2s ease;
        }
        .level-row:last-child td {
          border-bottom: none;
        }
        .level-row:hover td {
          background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, transparent 100%);
        }
        .level-cell {
          border-left: 4px solid var(--row-color);
        }
        .level-badge-wrap {
          margin-bottom: 8px;
        }
        .level-badge {
          color: #fff; padding: 4px 10px; border-radius: 4px;
          font-weight: 700; font-size: 0.85rem;
          display: inline-block;
        }
        .level-name {
          font-size: 0.95rem;
          display: block;
          line-height: 1.3;
        }
        .kriteria-cell p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .bukti-cell ul {
          margin: 0;
          padding-left: 20px;
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .bukti-cell li { margin-bottom: 6px; }
        .bukti-cell li:last-child { margin-bottom: 0; }
      `}</style>
    </div>
  );
}
