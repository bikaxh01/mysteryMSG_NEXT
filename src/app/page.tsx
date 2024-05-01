"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


function BackgroundBeamsDemo() {
  return (
    <div className="h-[45rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Send Message Anonymous
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          An app allowing anonymous messaging without revealing your identity.
        </p>
      </div>
      <Link href={'/sign-in'}><Button>Get Started</Button></Link>
      <div>
      
      </div>
    </div>
  );
}

export default BackgroundBeamsDemo;
