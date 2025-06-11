import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-between mb-16 text-white/60 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 text-white/40">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m13 2-2 2.5h3L12 7" />
          </svg>
        </div>
        <span>Unlock more features with the Pro plan.</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span>Active extensions</span>
      </div>
    </div>
  );
};

export default Header;
