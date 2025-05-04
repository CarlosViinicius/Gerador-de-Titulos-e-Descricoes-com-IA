import React from "react";
import saveIcon from "../assets/icons/save-icon.png";
import exportIcon from "../assets/icons/export-icon.png";

const Resultado = ({ itemSelecionado, salvar, exportar }) => {
  return (
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
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all"
            >
              <img src={saveIcon} alt="Salvar" className="w-5 h-5" />
              <span>Salvar</span>
            </button>
            <button
              onClick={exportar}
              className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all"
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
  );
};

export default Resultado;
