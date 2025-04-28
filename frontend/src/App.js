import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./App.css";

import saveIcon from "./assets/icons/save-icon.png";
import exportIcon from "./assets/icons/export-icon.png";
import logo from "./assets/icons/logo.png";

const avatar = "https://i.pravatar.cc/150?img=32";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isAuthenticated) {
    return (
      <LoginPage
        setIsAuthenticated={setIsAuthenticated}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<ComingSoon />} />
        <Route path="/historico" element={<ComingSoon />} />
        <Route path="/configuracoes" element={<ComingSoon />} />
      </Routes>
    </Router>
  );
}

function LoginPage({
  setIsAuthenticated,
  username,
  setUsername,
  password,
  setPassword,
}) {
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
function MainPage() {
  const [categoria, setCategoria] = useState("");
  const [material, setMaterial] = useState("");
  const [tom, setTom] = useState("");
  const [beneficios, setBeneficios] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [gerando, setGerando] = useState(false);

  const categorias = ["Camisa", "Calçado", "Bolsa", "Acessório"];
  const tons = ["Informal", "Profissional", "Divertido", "Elegante"];

  // Carregar histórico do sessionStorage
  useEffect(() => {
    const savedHistorico =
      JSON.parse(sessionStorage.getItem("historico")) || [];
    setHistorico(savedHistorico); // Atualiza o estado com os dados carregados
  }, []);

  // Salvar histórico no sessionStorage quando for atualizado
  useEffect(() => {
    if (historico.length > 0) {
      sessionStorage.setItem("historico", JSON.stringify(historico)); // Atualiza o sessionStorage
    }
  }, [historico]); // Roda sempre que o histórico for alterado

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGerando(true);

    const dados = { categoria, beneficios, material };

    try {
      const resposta = await fetch("http://localhost:8000/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const json = await resposta.json();
      const texto = json.resultado;

      const match = texto.match(
        /t[ií]tulo[:\-\s]*([^\n]*)[\n\r]+descri[cç][aã]o[:\-\s]*([\s\S]*)/i
      );
      if (match) {
        const novoItem = {
          titulo: match[1].trim(),
          descricao: match[2].trim(),
        };
        setItemSelecionado(novoItem);
      } else {
        const novoItem = { titulo: "Gerado com IA", descricao: texto };
        setItemSelecionado(novoItem);
      }
    } catch (error) {
      const novoItem = { titulo: "Erro", descricao: "Erro ao gerar conteúdo." };
      setItemSelecionado(novoItem);
    }

    setGerando(false);
  };

  const salvar = () => {
    if (!itemSelecionado) return;
    const historicoAtualizado = [itemSelecionado, ...historico];
    setHistorico(historicoAtualizado);
  };

  const exportar = () => {
    if (!itemSelecionado) return;
    const blob = new Blob(
      [
        `Título: ${itemSelecionado.titulo}\n\nDescrição: ${itemSelecionado.descricao}`,
      ],
      {
        type: "text/plain;charset=utf-8",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${itemSelecionado.titulo.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gerador de Títulos e Descrições
        </h1>
        <div className="flex items-center gap-10 text-sm text-gray-600">
          <div className="hidden md:flex gap-6">
            <Link to="/dashboard" className="hover:text-blue-600 text-lg">
              Dashboard
            </Link>
            <Link to="/historico" className="hover:text-blue-600 text-lg">
              Histórico
            </Link>
            <Link to="/configuracoes" className="hover:text-blue-600 text-lg">
              Configurações
            </Link>
          </div>
          <img
            src={avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-400"
          />
        </div>
      </header>

      <hr className="mb-6" />

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Gerador de Títulos e Descrições com IA
        </h2>
        <p className="text-base text-gray-600">
          Crie títulos e descrições de produtos atraentes sem esforço com IA.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Formulário */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-medium text-gray-700">
              Categoria
            </label>
            <select
              className="w-full px-3 py-1.5 rounded border text-sm"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione a categoria</option>
              {categorias.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <label className="block text-xs font-medium text-gray-700">
              Material
            </label>
            <input
              className="w-full px-3 py-1.5 rounded border text-sm"
              placeholder="Material (opcional)"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />

            <label className="block text-xs font-medium text-gray-700">
              Tom
            </label>
            <select
              className="w-full px-3 py-1.5 rounded border text-sm"
              value={tom}
              onChange={(e) => setTom(e.target.value)}
            >
              <option value="">Selecione o tom</option>
              {tons.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label className="block text-xs font-medium text-gray-700">
              Benefícios
            </label>
            <textarea
              className="w-full px-3 py-1.5 rounded border text-sm"
              placeholder="Benefícios"
              value={beneficios}
              onChange={(e) => setBeneficios(e.target.value)}
              rows={2}
            ></textarea>

            <button
              type="submit"
              disabled={gerando}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {gerando ? "Gerando..." : "Gerar com IA"}
            </button>
          </form>
        </div>

        {/* Resultado */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          {itemSelecionado ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {itemSelecionado.titulo}
              </h2>
              <p className="text-gray-600 mb-6">{itemSelecionado.descricao}</p>
              <div className="flex gap-4">
                <button
                  onClick={salvar}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 hover:scale-105 transition"
                >
                  <img src={saveIcon} alt="Salvar" className="w-5 h-5" />
                  <span>Salvar</span>
                </button>
                <button
                  onClick={exportar}
                  className="flex items-center gap-2 px-5 py-2 border border-gray-300 bg-white text-gray-700 rounded-full hover:bg-gray-100 hover:scale-105 transition"
                >
                  <img src={exportIcon} alt="Exportar" className="w-5 h-5" />
                  <span>Exportar</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400">
              Gere um conteúdo ou selecione um histórico
            </p>
          )}
        </div>

        {/* Histórico */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md max-h-[400px] overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2">Histórico</h3>
          <ul className="space-y-2">
            {historico.map((item, idx) => (
              <motion.li
                key={idx}
                whileHover={{ scale: 1.01 }}
                className="cursor-pointer px-3 py-2 rounded-lg border hover:bg-gray-50"
                onClick={() => setItemSelecionado(item)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium truncate text-sm">
                      {item.titulo}
                    </p>
                    <p className="text-xs text-gray-500">Gerado por IA</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Logo no final da página */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <img src={logo} alt="Logo" className="w-48 h-48 object-contain" />
      </div>
    </div>
  );
}

<div className="min-h-screen flex flex-col justify-center items-center">
  <div className="flex justify-center items-center h-48 mb-8">
    <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
  </div>

  <h2 className="text-xl font-bold text-gray-900 mb-2">
    Gerador de Títulos e Descrições com IA
  </h2>
  <p className="text-base text-gray-600">
    Crie títulos e descrições de produtos atraentes sem esforço com IA.
  </p>
</div>;

function ComingSoon() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🚧 EM BREVE 🚧</h1>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
}

export default App;
