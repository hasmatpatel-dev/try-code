"use client";
import { Marquee } from "@/components/shadcn-space/animations/marquee";
import { motion } from "motion/react";
import Image from "next/image";

export interface BrandList {
  image: string;
  name: string;
  lightimg: string;
}

function BrandSlider({ brandList }: { brandList: BrandList[] }) {
  return (
    <div className="py-6 md:py-10 w-full overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
        className="flex flex-col gap-3"
      >
        <div className="flex justify-center text-center py-3 md:py-4 relative">
          <div className="flex items-center justify-center gap-4">
            <div className="hidden md:block h-0.5 w-40 bg-linear-to-l from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
            <p className="text-sm font-normal sm:px-2 px-10 text-muted-foreground text-center">
              Loved by 1000+ big and small brands around the worlds
            </p>
            <div className="hidden md:block h-0.5 w-40 bg-linear-to-r from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
          </div>
        </div>
        {brandList && brandList.length > 0 && (
          <div className="py-4">
            <Marquee pauseOnHover className="[--duration:20s] p-0">
              {brandList.map((brand, index) => (
                <div key={index} className="flex items-center">
                  <div className="relative w-36 h-8 mr-6 lg:mr-20 dark:hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      sizes="144px"
                      className="object-contain"
                    />
                  </div>
                  <div className="relative hidden dark:block w-36 h-8 mr-12 lg:mr-20">
                    <Image
                      src={brand.lightimg}
                      alt={brand.name}
                      fill
                      sizes="144px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default BrandSlider;
