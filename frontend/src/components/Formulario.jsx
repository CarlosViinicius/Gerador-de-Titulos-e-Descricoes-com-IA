import React from "react";

const Formulario = ({
  categoria,
  setCategoria,
  outraCategoria,
  setOutraCategoria,
  material,
  setMaterial,
  tom,
  setTom,
  beneficios,
  setBeneficios,
  gerando,
  handleSubmit,
}) => {
  const categorias = ["Camisa", "Calçado", "Bolsa", "Acessório", "Outros"];
  const tons = ["Informal", "Profissional", "Divertido", "Elegante"];

  return (
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
          )}
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
          <label className="block text-xs font-medium text-gray-700">Tom</label>
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

        {/* Botão */}
        <button
          type="submit"
          disabled={gerando}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all"
        >
          {gerando ? "Gerando..." : "Gerar com IA"}
        </button>
      </form>
    </div>
  );
};

export default Formulario;
