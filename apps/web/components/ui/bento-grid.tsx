"use client";

import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { ReactNode, ComponentPropsWithoutRef } from "react";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  icon: string;
  description: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[24rem] grid-cols-3 gap-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  icon,
  description,
  ...props
}: BentoCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-sm border bg-white shadow-sm cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 size-full">{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 mt-auto">
        <div className="flex items-center gap-3">
          <Image
            src={icon}
            alt={name}
            width={40}
            height={40}
            className="size-10 origin-left transform-gpu transition-transform duration-300 group-hover:scale-110"
          />
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        </div>
        <p className="max-w-lg text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export { BentoCard, BentoGrid };
