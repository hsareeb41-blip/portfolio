"use client";

export default function Auth() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-10">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-5">Admin Panel</h1>

        <p className="text-lg text-gray-200">
          Manage your application easily with a powerful dashboard.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
}
