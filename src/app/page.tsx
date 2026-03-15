import ParticleLogo from "@/components/home/ParticleLogo";

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ParticleLogo />
      
      {/* Hint Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: 0.6,
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <p style={{
          fontFamily: 'var(--font-josefin-sans)',
          fontSize: '0.9rem',
          color: 'var(--color-text)',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Press <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>CMD + K</span> to initialize system
        </p>
      </div>
    </div>
  );
}
