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
import deleteIcon from "./assets/icons/delete-icon.png"; // ícone de exclusão
import logo from "./assets/icons/logo.png";

const avatar = "https://i.pravatar.cc/150?img=32";

function App() {
  // Controle de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Se não estiver autenticado, exibe login
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

  // Rotas após login
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
    // Credenciais fixas para demonstração
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
        {/* Logo no formulário de login */}
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 w-48 h-48 object-contain"
        />
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {/* Mensagem de erro de login */}
        {loginError && (
          <p className="text-red-500 text-sm text-center">{loginError}</p>
        )}

        {/* Campo de usuário */}
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

        {/* Campo de senha */}
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
  // Estados do formulário e resultado
  const [categoria, setCategoria] = useState("");
  const [outraCategoria, setOutraCategoria] = useState("");
  const [material, setMaterial] = useState("");
  const [tom, setTom] = useState("");
  const [beneficios, setBeneficios] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState(null);

  // Histórico e estado de geração
  const [historico, setHistorico] = useState([]);
  const [gerando, setGerando] = useState(false);

  const categorias = ["Camisa", "Calçado", "Bolsa", "Acessório", "Outros"];
  const tons = ["Informal", "Profissional", "Divertido", "Elegante"];

  // Carrega histórico do banco ao iniciar
  useEffect(() => {
    fetch("http://localhost:8000/titles")
      .then((res) => res.json())
      .then((data) => setHistorico(data))
      .catch((err) => console.error("Erro ao carregar histórico:", err));
  }, []);

  // Gera título/descrição via IA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGerando(true);
    const dados = {
      categoria: categoria === "Outros" ? outraCategoria : categoria,
      beneficios,
      material,
    };
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
        setItemSelecionado({
          titulo: match[1].trim(),
          descricao: match[2].trim(),
        });
      } else {
        setItemSelecionado({ titulo: "Gerado com IA", descricao: texto });
      }
    } catch {
      setItemSelecionado({
        titulo: "Erro",
        descricao: "Erro ao gerar conteúdo.",
      });
    } finally {
      setGerando(false);
    }
  };

  // Salva no banco e atualiza histórico
  const salvar = async () => {
    if (!itemSelecionado) return;
    try {
      const response = await fetch("http://localhost:8000/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: itemSelecionado.titulo,
          descricao: itemSelecionado.descricao,
        }),
      });
      const saved = await response.json();
      setHistorico((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // Exporta como TXT
  const exportar = () => {
    if (!itemSelecionado) return;
    const blob = new Blob(
      [
        `Título: ${itemSelecionado.titulo}\n\nDescrição: ${itemSelecionado.descricao}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${itemSelecionado.titulo.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Deleta item do histórico
  const deletar = async (id) => {
    try {
      await fetch(`http://localhost:8000/titles/${id}`, { method: "DELETE" });
      setHistorico((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Cabeçalho */}
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

      {/* Introdução */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Gerador de Títulos e Descrições com IA
        </h2>
        <p className="text-base text-gray-600">
          Crie títulos e descrições de produtos atraentes sem esforço com IA.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-stretch gap-6">
        {/* Formulário */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md flex flex-col h-96">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full justify-between"
          >
            {/* Categoria */}
            <div>
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
              {categoria === "Outros" && (
                <input
                  type="text"
                  className="mt-2 w-full px-3 py-1.5 rounded border text-sm"
                  placeholder="Digite a nova categoria"
                  value={outraCategoria}
                  onChange={(e) => setOutraCategoria(e.target.value)}
                />
              )}{" "}
            </div>
            {/* Material */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Material
              </label>
              <input
                className="w-full px-3 py-1.5 rounded border text-sm"
                placeholder="Material (opcional)"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>
            {/* Tom */}
            <div>
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
            </div>
            {/* Benefícios */}
            <div>
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
            </div>
            {/* Botão Gerar */}
            <button
              type="submit"
              disabled={gerando}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              {gerando ? "Gerando..." : "Gerar com IA"}
            </button>
          </form>
        </div>

        {/* Resultado */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-96">
          {itemSelecionado ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {itemSelecionado.titulo}
              </h2>
              <p className="text-gray-600 mb-6">{itemSelecionado.descricao}</p>
              <div className="flex gap-4">
                <button
                  onClick={salvar}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                >
                  <img src={saveIcon} alt="Salvar" className="w-5 h-5" />{" "}
                  <span>Salvar</span>
                </button>
                <button
                  onClick={exportar}
                  className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                >
                  <img src={exportIcon} alt="Exportar" className="w-5 h-5" />{" "}
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
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md flex flex-col h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2">Histórico</h3>
          <ul className="space-y-2">
            {historico.map((item) => (
              <motion.li
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className="group cursor-pointer px-3 py-2 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                onClick={() =>
                  setItemSelecionado({
                    titulo: item.titulo,
                    descricao: item.descricao,
                  })
                }
              >
                <div className="flex flex-col">
                  <p className="font-medium truncate text-sm">{item.titulo}</p>
                  <p className="text-xs text-gray-500">Gerado por IA</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletar(item.id);
                    }}
                  >
                    <img src={deleteIcon} alt="Deletar" className="w-4 h-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Logo fixa no rodapé */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <img src={logo} alt="Logo" className="w-48 h-48 object-contain" />
      </div>
    </div>
  );
}

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
