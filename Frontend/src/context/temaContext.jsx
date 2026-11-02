import { createContext, useContext, useEffect, useState } from "react";

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    return localStorage.getItem("tema") === "oscuro";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", temaOscuro);
    localStorage.setItem("tema", temaOscuro ? "oscuro" : "claro");
  }, [temaOscuro]);

  return (
    <TemaContext.Provider value={{ temaOscuro, setTemaOscuro }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}
