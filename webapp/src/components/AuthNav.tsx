import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthNav() {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (!user) {
    return <li><a href="/login" className="btn btn-primary btn-sm">Masuk</a></li>;
  }

  return (
    <li style={{ position: 'relative' }}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '4px 12px', 
          borderRadius: '20px', 
          border: '1px solid var(--border-color)',
          background: 'rgba(255,255,255,0.05)',
          color: 'var(--text-primary)',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>👤</span>
        <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
          {user.email?.split('@')[0]}
        </span>
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '120%',
          right: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '8px',
          minWidth: '200px',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>Akun Saya</div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
          <a href="/bukti-dukung" style={{ display: 'block', padding: '8px', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
            Dashboard LJK
          </a>
          <a href="/settings" style={{ display: 'block', padding: '8px', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
            Pengaturan
          </a>
          <button 
            onClick={handleLogout}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px', color: 'var(--level-1)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)' }}
            onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}
          >
            Keluar
          </button>
        </div>
      )}
    </li>
  );
}
