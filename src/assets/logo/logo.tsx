import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      <div className="mdn">TryCode</div>
    </div>
  );
};

export default Logo;

