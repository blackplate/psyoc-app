'use client';

export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 512 512"
      fill="none"
      className="mt-[8px] min-w-[60px] min-h-[60px]"
    >
      <rect width="512" height="512" rx="112" fill="#7c3aed" />
      <rect x="152" y="128" width="60" height="256" rx="30" fill="#ffffff" />
      <path
        fill="#ffffff"
        fillRule="evenodd"
        d="M280 128a80 80 0 1 1 0 160 80 80 0 1 1 0-160zm0 50a30 30 0 1 0 0 60 30 30 0 1 0 0-60z"
      />
    </svg>
  );
};
