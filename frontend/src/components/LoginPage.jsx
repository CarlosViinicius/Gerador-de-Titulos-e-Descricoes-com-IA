import React, { useState } from "react";
import logo from "../assets/icons/logo.png";

const LoginPage = ({
  setIsAuthenticated,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Usuário ou senha inválidos!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 w-48 h-48 object-contain"
        />
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {loginError && (
          <p className="text-red-500 text-sm text-center">{loginError}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usuário
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite o usuário"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
