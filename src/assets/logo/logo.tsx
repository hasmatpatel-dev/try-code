import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import LogoSvg from '@/assets/trycode.svg';
import Image from 'next/image';

const Logo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      <div className="mdn flex items-center justify-center gap-3">
        <Image src={LogoSvg} alt="TryCode" height={40} width={40} />
        <span className="text-lg font-bold text-white">TRY CODE</span>
      </div>
    </div>
  );
};

export default Logo;
