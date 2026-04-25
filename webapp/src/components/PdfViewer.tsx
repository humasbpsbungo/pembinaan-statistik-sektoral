import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use Vite's native URL resolution to bundle the worker locally instead of relying on CDN
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  fileUrl: string;
  initialPage: number;
}

export default function PdfViewer({ fileUrl, initialPage }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(initialPage || 1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageWidth, setPageWidth] = useState(800);

  useEffect(() => {
    // Reset page when initialPage or file changes
    setPageNumber(initialPage || 1);
    setLoading(true);
    setFetchError('');
    
    // Fetch the PDF manually with cache-busting
    fetch(`${fileUrl}?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === 204) {
          throw new Error("Server returned 204 No Content. Your Service Worker or Browser Cache might be stuck. Try hard refreshing (Ctrl+F5).");
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.blob();
      })
      .then((blob) => {
        if (blob.size === 0) {
           throw new Error("The downloaded PDF is 0 bytes. Please verify the file is not empty or corrupted on disk.");
        }
        const objectUrl = URL.createObjectURL(blob);
        setPdfData(objectUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Manual Fetch Error:", err);
        setFetchError(err.message);
        setLoading(false);
      });

    return () => {
      if (pdfData) URL.revokeObjectURL(pdfData);
    };
  }, [initialPage, fileUrl]);

  useEffect(() => {
    const handleResize = () => {
      const modalWidth = isFullscreen ? window.innerWidth * 0.9 : 800; // Assuming modal inner width around 800px or full screen
      setPageWidth(modalWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const content = (
    <div className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="pdf-header">
        <h3>Referensi Indikator PDF</h3>
        <div className="pdf-controls">
          <button 
            disabled={pageNumber <= 1} 
            onClick={() => changePage(-1)}
            className="btn-ghost"
            style={{ padding: '4px 8px' }}
          >
            &lt; Prev
          </button>
          <span>
            Page {pageNumber} of {numPages || '--'}
          </span>
          <button 
            disabled={pageNumber >= (numPages || 1)} 
            onClick={() => changePage(1)}
            className="btn-ghost"
            style={{ padding: '4px 8px' }}
          >
            Next &gt;
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="btn btn-sm btn-primary"
            style={{ marginLeft: '12px' }}
          >
            {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
        </div>
      </div>
      
      <div className="pdf-content">
        {loading && <div className="pdf-loading">Downloading PDF payload...</div>}
        {fetchError && <div className="pdf-loading" style={{color:'var(--error)'}}>Fetch Error: {fetchError}</div>}
        {pdfData && !loading && (
          <Document 
            file={pdfData} 
            onLoadSuccess={onDocumentLoadSuccess} 
            onLoadError={(err) => console.error("PDF Parsing Error:", err)}
            loading={<div className="pdf-loading">Rendering pages...</div>}
            error={<div className="pdf-loading" style={{color:'var(--error)'}}>Failed to parse PDF document.</div>}
          >
            <Page 
               pageNumber={pageNumber} 
               renderTextLayer={true} 
               renderAnnotationLayer={true}
               width={!isFullscreen ? (pageWidth > 0 ? pageWidth : 800) : undefined}
               height={isFullscreen ? window.innerHeight - 100 : undefined}
            />
          </Document>
        )}
      </div>

      <style>{`
        .pdf-viewer-container {
          background-color: var(--bg-body);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          margin-top: 16px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .pdf-viewer-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          margin: 0;
          border-radius: 0;
          border: none;
        }

        .pdf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: 12px;
        }

        .pdf-header h3 {
          margin: 0;
          font-size: 1.05rem;
          color: var(--accent);
        }

        .pdf-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .pdf-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          padding: 20px;
          background: var(--bg-dark);
          position: relative;
          min-height: 400px;
        }

        .pdf-viewer-container.fullscreen .pdf-content {
          min-height: 100vh;
        }

        .react-pdf__Page {
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          margin-bottom: 20px;
        }

        .pdf-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--text-secondary);
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );

  return isFullscreen ? createPortal(content, document.body) : content;
}
