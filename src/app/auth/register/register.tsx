"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      router.push("/admin/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded-lg"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          value={form.password}
          onChange={handleChange}
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}
