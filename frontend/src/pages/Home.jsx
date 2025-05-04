import React, { useEffect, useState } from "react";
import Formulario from "../components/Formulario";
import Resultado from "../components/Resultado";
import Historico from "../components/Historico";
import { Link } from "react-router-dom";
import logo from "../assets/icons/logo.png";

const avatar = "https://i.pravatar.cc/150?img=32";

const Home = () => {
  const [categoria, setCategoria] = useState("");
  const [outraCategoria, setOutraCategoria] = useState("");
  const [material, setMaterial] = useState("");
  const [tom, setTom] = useState("");
  const [beneficios, setBeneficios] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const [historico, setHistorico] = useState([]);
  const [gerando, setGerando] = useState(false);

  // Carrega histórico ao iniciar
  useEffect(() => {
    fetch("http://localhost:8000/titles") // Defina a URL diretamente aqui
      .then((res) => res.json())
      .then((data) => setHistorico(data))
      .catch((err) => console.error("Erro ao carregar histórico:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGerando(true);
    const dados = {
      categoria: categoria === "Outros" ? outraCategoria : categoria,
      beneficios,
      material,
    };
    try {
      const resposta = await fetch("http://localhost:8000/gerar", { // Defina a URL diretamente aqui
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

  const salvar = async () => {
    if (!itemSelecionado) return;
    try {
      const saved = await fetch("http://localhost:8000/titles", { // Defina a URL diretamente aqui
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: itemSelecionado.titulo,
          descricao: itemSelecionado.descricao,
        }),
      });
      const savedData = await saved.json();
      setHistorico((prev) => [savedData, ...prev]);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

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

  const deletar = async (id) => {
    try {
      await fetch(`http://localhost:8000/titles/${id}`, { // Defina a URL diretamente aqui
        method: "DELETE",
      });
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
        <Formulario
          categoria={categoria}
          setCategoria={setCategoria}
          outraCategoria={outraCategoria}
          setOutraCategoria={setOutraCategoria}
          material={material}
          setMaterial={setMaterial}
          tom={tom}
          setTom={setTom}
          beneficios={beneficios}
          setBeneficios={setBeneficios}
          gerando={gerando}
          handleSubmit={handleSubmit}
        />
        <Resultado
          itemSelecionado={itemSelecionado}
          salvar={salvar}
          exportar={exportar}
        />
        <Historico
          historico={historico}
          setItemSelecionado={setItemSelecionado}
          deletar={deletar}
        />
      </div>

      {/* Logo fixa no rodapé */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <img src={logo} alt="Logo" className="w-48 h-48 object-contain" />
      </div>
    </div>
  );
};

export default Home;
