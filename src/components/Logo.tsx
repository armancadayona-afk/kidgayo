import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, light = false }) => {
  const [imgError, setImgError] = useState(false);

  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {!imgError ? (
        <img
          src="/313ccad4-b8e8-457b-a51c-47ecdf9d70fb.png"
          alt="ApartmentListing Logo"
          className={`${heights[size]} w-auto object-contain transition-all ${light ? 'brightness-125' : ''}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex items-center gap-2.5">
          {/* Vector representation matching the uploaded image */}
          <div className="relative flex-shrink-0">
            <svg
              className={`${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}`}
              viewBox="0 0 100 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Pin Teardrop Shape */}
              <path
                d="M50 102C50 102 14 66 14 42C14 22.1178 30.1178 6 50 6C69.8822 6 86 22.1178 86 42C86 66 50 102 50 102Z"
                stroke={light ? "#60A5FA" : "#0A2240"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#FFFFFF"
              />
              {/* City Skyline / Buildings in Royal Blue */}
              {/* Center Tower */}
              <path
                d="M40 32L50 24L60 32V68H40V32Z"
                fill="#0066FF"
              />
              {/* Windows in Center Tower */}
              <rect x="44" y="34" width="4" height="4" fill="white" />
              <rect x="52" y="34" width="4" height="4" fill="white" />
              <rect x="44" y="42" width="4" height="4" fill="white" />
              <rect x="52" y="42" width="4" height="4" fill="white" />
              <rect x="44" y="50" width="4" height="4" fill="white" />
              <rect x="52" y="50" width="4" height="4" fill="white" />

              {/* Left Tower */}
              <rect x="25" y="42" width="13" height="26" fill={light ? "#38BDF8" : "#0A2240"} />
              <rect x="28" y="46" width="3" height="3" fill="white" />
              <rect x="33" y="46" width="3" height="3" fill="white" />
              <rect x="28" y="53" width="3" height="3" fill="white" />
              <rect x="33" y="53" width="3" height="3" fill="white" />

              {/* Right Tower */}
              <rect x="62" y="38" width="13" height="30" fill={light ? "#38BDF8" : "#0A2240"} />
              <rect x="65" y="43" width="3" height="3" fill="white" />
              <rect x="70" y="43" width="3" height="3" fill="white" />
              <rect x="65" y="50" width="3" height="3" fill="white" />
              <rect x="70" y="50" width="3" height="3" fill="white" />

              {/* Golden Ochre House Roof */}
              <path
                d="M20 74L50 56L80 74"
                stroke="#D99B26"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Small House Windows under roof */}
              <rect x="46" y="66" width="3" height="3" fill="#D99B26" />
              <rect x="51" y="66" width="3" height="3" fill="#D99B26" />
              <rect x="46" y="71" width="3" height="3" fill="#D99B26" />
              <rect x="51" y="71" width="3" height="3" fill="#D99B26" />
            </svg>
          </div>

          {showText && (
            <div className="flex items-baseline tracking-tight font-sans">
              <span className={`font-extrabold text-2xl tracking-tight ${light ? 'text-white' : 'text-[#0A2240]'}`}>Apartment</span>
              <span className="text-[#0066FF] font-black text-2xl tracking-tight">Listing</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
