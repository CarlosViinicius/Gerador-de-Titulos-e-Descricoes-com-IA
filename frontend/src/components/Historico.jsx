import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import deleteIcon from "../assets/icons/delete-icon.png";

const Historico = ({ historico, setItemSelecionado, deletar }) => {
  return (
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
  );
};

export default Historico;
