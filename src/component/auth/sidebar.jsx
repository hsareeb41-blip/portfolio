"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.push("/admin/login");
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Add Profile",
      path: "/admin/add",
      icon: UserPlus,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all
                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3 p-3 rounded-lg 
            w-full text-gray-300
            hover:bg-red-600 hover:text-white
            transition-all
          "
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
