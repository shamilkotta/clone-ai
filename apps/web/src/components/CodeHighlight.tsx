import { cn } from "@/lib/utils";
import { JSX, ReactNode, useState } from "react";
import ShikiHighlighter from "react-shiki";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "./ui/button";

type CodeHighlightProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

const CodeHighlight = ({
  inline,
  className,
  children,
  ...props
}: CodeHighlightProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false);

  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return !inline ? (
    <ShikiHighlighter
      langStyle={{
        right: "2.5rem",
      }}
      className="my-3"
      copyComponent={
        <div className="absolute right-2 h-full top-[0.3rem] left-auto">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className={cn(
              "sticky top-1 z-10 w-6 h-6 cursor-pointer text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
            )}
          >
            {isCopied ? (
              <CheckIcon size={60} className="w-3 h-3" />
            ) : (
              <CopyIcon size={60} className="w-3 h-3" />
            )}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      }
      language={language}
      theme={"houston"}
      {...props}
    >
      {String(children)}
    </ShikiHighlighter>
  ) : (
    <code
      className={cn(
        className,
        "mx-0.5 overflow-auto rounded-md dark:bg-white/[0.05] bg-neutral-900/[0.05] px-[7px] py-1",
      )}
      {...props}
    >
      {children}
    </code>
  );
};

export default CodeHighlight;
