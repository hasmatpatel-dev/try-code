import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      <div className="mdn" aria-hidden="true" />
      <span className="font-bold text-xl text-foreground tracking-tight select-none">
        TryCode
      </span>
    </div>
  );
};

export default Logo;

