import React from 'react';

export function Logo({ className = '', height = 44, light = false }: { className?: string; height?: number; light?: boolean }) {
  const textColor = light ? '#ffffff' : '#0a4386';
  const subColor = light ? '#d9f26a' : '#0058b8';
  const badgeStroke = light ? '#d9f26a' : '#0a4386';
  const badgeFill = light ? '#ffffff10' : '#ffffff';

  return (
    <div className={`secti-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
      {/* Texto institucional */}
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15 }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: subColor, letterSpacing: '-0.01em', fontFamily: "'DM Sans', sans-serif" }}>
          Secretaria de
        </span>
        <span style={{ fontSize: '16px', fontWeight: 800, color: textColor, letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
          Transformação Digital,
        </span>
        <span style={{ fontSize: '16px', fontWeight: 800, color: textColor, letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
          Ciência e Tecnologia
        </span>
      </div>

      {/* Brasão Oficial Recife Prefeitura */}
      <svg
        height={height}
        viewBox="0 0 160 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Moldura externa arredondada */}
        <rect
          x="4"
          y="4"
          width="152"
          height="162"
          rx="28"
          stroke={badgeStroke}
          strokeWidth="8"
          fill={badgeFill}
        />

        {/* Leão Esquerdo */}
        <path
          d="M 45 42 C 40 38 35 44 33 50 C 30 58 32 65 37 72 C 34 76 30 84 34 92 C 37 98 42 100 48 97 C 46 92 48 86 52 82 C 48 78 46 72 49 67 C 51 63 53 62 52 56 C 51 50 49 46 45 42 Z"
          fill="none"
          stroke={textColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Leão Direito */}
        <path
          d="M 115 42 C 120 38 125 44 127 50 C 130 58 128 65 123 72 C 126 76 130 84 126 92 C 123 98 118 100 112 97 C 114 92 112 86 108 82 C 112 78 114 72 111 67 C 109 63 107 62 108 56 C 109 50 111 46 115 42 Z"
          fill="none"
          stroke={textColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Coroas dos Leões */}
        <path d="M 41 36 L 44 41 L 47 36 L 50 41 L 53 36 L 52 42 L 42 42 Z" fill={textColor} />
        <path d="M 107 36 L 110 41 L 113 36 L 116 41 L 119 36 L 118 42 L 108 42 Z" fill={textColor} />

        {/* Coroa Mural Central (Castelo) */}
        <path
          d="M 66 22 L 70 28 L 74 22 L 80 22 L 80 34 L 100 34 L 100 22 L 106 22 L 110 28 L 114 22 L 114 36 L 66 36 Z"
          fill="none"
          stroke={textColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <line x1="68" y1="31" x2="112" y2="31" stroke={textColor} strokeWidth="2" />
        <line x1="80" y1="36" x2="80" y2="44" stroke={textColor} strokeWidth="2.5" />
        <line x1="100" y1="36" x2="100" y2="44" stroke={textColor} strokeWidth="2.5" />

        {/* Escudo Central */}
        <path
          d="M 60 44 L 120 44 L 120 78 C 120 96 90 106 90 106 C 90 106 60 96 60 78 Z"
          fill="none"
          stroke={textColor}
          strokeWidth="3.8"
          strokeLinejoin="round"
        />

        {/* Detalhes internos do Escudo */}
        {/* Sol / Cruz / Farol estilizado */}
        <path d="M 70 65 C 70 54 110 54 110 65" fill="none" stroke={textColor} strokeWidth="2.5" />
        <path d="M 90 56 L 90 68 M 84 62 L 96 62" stroke={textColor} strokeWidth="2.5" strokeLinecap="round" />
        {/* Farol e ondas */}
        <path d="M 87 72 L 93 72 L 94 88 L 86 88 Z" fill={textColor} />
        <path d="M 72 88 Q 80 84 90 88 Q 100 92 108 88" fill="none" stroke={textColor} strokeWidth="2.5" />

        {/* Tipografia RECIFE */}
        <text
          x="80"
          y="134"
          textAnchor="middle"
          fill={textColor}
          fontSize="23"
          fontWeight="900"
          fontFamily="'Manrope', sans-serif"
          letterSpacing="0.06em"
        >
          RECIFE
        </text>

        {/* Tipografia PREFEITURA */}
        <text
          x="80"
          y="149"
          textAnchor="middle"
          fill={textColor}
          fontSize="9.5"
          fontWeight="800"
          fontFamily="'DM Sans', sans-serif"
          letterSpacing="0.32em"
        >
          PREFEITURA
        </text>
      </svg>
    </div>
  );
}
