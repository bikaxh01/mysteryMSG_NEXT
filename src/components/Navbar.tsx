"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import ModeToggle from "./DarkMode";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  console.log(user);

  return (
    <nav>
      <div className="p-4 md:p-6 border-b-2  shadow-md">
        <div className="container mx-auto flex  justify-between flex-col md:flex-row gap-12 items-center">
          <a href="#" className="text-xl font-bold mb-4 md:mb-0">
            Mistry Message
          </a>
          <span className="mr-4">Welcome, {user?.username}</span>
          <div className=" space-x-6">
            {" "}
            {user ? (
              <>
                <ModeToggle />

                <Button
                  onClick={() => signOut()}
                  className="w-full md:w-auto bg-slate-100 text-black"
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <ModeToggle />
                <Link href="/sign-in">
                  <Button
                    className="w-full md:w-auto bg-slate-100 text-black"
                    variant={"outline"}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}{" "}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
