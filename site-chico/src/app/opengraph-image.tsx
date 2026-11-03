import { ImageResponse } from 'next/og';

export const alt = "Franci's Creative Kitchen — pimentas artesanais e molhos";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: 96,
            height: 8,
            marginBottom: 36,
            backgroundColor: '#ff9900',
          }}
        />
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          Franci&apos;s
        </div>
        <div style={{ fontSize: 42, fontWeight: 600, color: '#ff9900' }}>
          Creative Kitchen
        </div>
        <div style={{ marginTop: 32, fontSize: 26, color: '#f2f2f2' }}>
          Pimentas artesanais e molhos autorais
        </div>
      </div>
    ),
    size,
  );
}
