import Navbar from "@/components/Navbar";

import { Separator } from "@/components/ui/separator"




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <Separator/>
    {children}
  </div>
  );
}
