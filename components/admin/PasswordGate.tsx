"use client";

import { useState } from "react";

interface Props {
  onSuccess: (token: string) => void;
}

export default function PasswordGate({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem("admin_token", data.token);
        onSuccess(data.token);
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        className="w-full max-w-sm p-10"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <h1
          className="font-[--font-display] text-3xl font-light text-center mb-3 tracking-wider"
          style={{ color: "var(--fg)" }}
        >
          PARADISE
        </h1>
        <p className="text-xs tracking-widest uppercase text-center mb-8" style={{ color: "var(--fg-muted)" }}>
          Panel de Administración
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="admin-input"
            required
          />
          {error && (
            <p className="text-xs" style={{ color: "#c0392b" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full py-3 disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
