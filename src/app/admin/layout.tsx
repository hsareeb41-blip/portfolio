"use client";

import { useState } from "react";
import Sidebar from "../../component/auth/sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg"
      >
        <Menu size={24} />
      </button>
      <div
        className={`
          fixed md:static top-0 left-0 z-40
          h-screen
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      <main className="flex-1 p-6 md:ml-0">{children}</main>
    </div>
  );
}
