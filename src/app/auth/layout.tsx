import Auth from "../../component/auth/auth";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block w-1/2">
        <Auth />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
        {children}
      </div>
    </div>
  );
}
