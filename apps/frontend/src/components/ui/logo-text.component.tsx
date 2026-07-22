import React from 'react';

export const LogoTextComponent = () => {
  return (
    <svg
      width="138"
      height="40"
      viewBox="0 0 138 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="scale(0.078125)">
        <rect width="512" height="512" rx="112" fill="#7c3aed" />
        <rect x="152" y="128" width="60" height="256" rx="30" fill="#ffffff" />
        <path
          fill="#ffffff"
          fillRule="evenodd"
          d="M280 128a80 80 0 1 1 0 160 80 80 0 1 1 0-160zm0 50a30 30 0 1 0 0 60 30 30 0 1 0 0-60z"
        />
      </g>
      <text
        x="48"
        y="28"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill="currentColor"
      >
        Psyoc
      </text>
    </svg>
  );
};
