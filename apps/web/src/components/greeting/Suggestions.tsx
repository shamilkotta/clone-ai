import React, { use } from "react";

import { useChatContext } from "@/context/Chat";
import { useIsMobile } from "@/hooks/use-mobile";

type QuerySuggestions = Record<string, string[]>;
type Props = {
  suggestions?: QuerySuggestions;
  currentSelected: string;
};

const Suggestions = (props: Props) => {
  let suggestions: QuerySuggestions = {};
  if (props.suggestions) {
    suggestions = props.suggestions;
  }
  const { setInput } = useChatContext();
  const isMobile = useIsMobile();

  return (
    <>
      {suggestions?.[props.currentSelected]
        ?.slice(0, isMobile ? 2 : 4)
        .map((suggestion) => (
          <button
            onClick={() => setInput?.(suggestion)}
            key={suggestion}
            className={`w-full text-left cursor-pointer py-2 border-b border-neutral-900/[0.05] dark:border-white/[0.05] hover:border-neutral-900/[0.3] hover:dark:border-white/[0.3] transition-all duration-300 group`}
          >
            <span className="text-lg dark:text-white/90 text-neutral-900 text-new group-hover:text-neutral-900/50 dark:group-hover:text-white/50 transition-colors duration-300">
              {suggestion}
            </span>
          </button>
        ))}
    </>
  );
};

export default Suggestions;
