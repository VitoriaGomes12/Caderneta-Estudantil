import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);
let contador = 0;

export function ToastProvider({ children }) {
  const [mensagens, setMensagens] = useState([]);

  const remover = useCallback((id) => {
    setMensagens((atual) => atual.filter((m) => m.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo, texto) => {
      const id = ++contador;
      setMensagens((atual) => [...atual, { id, tipo, texto }]);
      setTimeout(() => remover(id), 4000);
    },
    [remover]
  );

  const valor = useMemo(
    () => ({
      sucesso: (texto) => mostrar('sucesso', texto),
      erro: (texto) => mostrar('erro', texto),
    }),
    [mostrar]
  );

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {mensagens.map((m) => (
          <div key={m.id} className={`toast-item ${m.tipo}`}>
            <span>{m.texto}</span>
            <button aria-label="Fechar" onClick={() => remover(m.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}