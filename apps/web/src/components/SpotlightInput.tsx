import React, { useState } from "react";
import { Plus } from "lucide-react";

const SpotlightInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="relative group">
      {/* Spotlight effect background */}
      <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>

      {/* Glass container */}
      <div
        className={`
        relative backdrop-blur-md  border 
        rounded-2xl p-4 transition-all duration-300 ease-out
        ${isFocused ? "border-white/20 bg-white/[0.05] shadow-2xl shadow-white/5" : ""}
        border-white/15 bg-white/[0.03]
      `}
      >
        <div className="flex items-center gap-4">
          {/* Plus icon */}
          <div
            className={`
            flex items-center justify-center w-8 h-8 rounded-lg
            transition-all duration-200
            ${isFocused ? "text-green-400" : "text-white/60"}
          `}
          >
            <Plus
              size={20}
              className="transition-transform duration-200 group-hover:scale-110"
            />
          </div>

          {/* Input field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything ..."
            className="flex-1 bg-transparent text-white/90 placeholder-white/40 text-lg outline-none font-light"
          />

          {/* Voice/Audio icon */}
          <div className="flex items-center justify-center w-8 h-8 text-white/40 hover:text-white/60 transition-colors duration-200 cursor-pointer">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-current rounded-full animate-pulse"></div>
              <div
                className="w-1 h-3 bg-current rounded-full animate-pulse"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1 h-5 bg-current rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1 h-2 bg-current rounded-full animate-pulse"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotlightInput;
