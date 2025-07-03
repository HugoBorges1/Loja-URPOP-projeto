import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Importa o BrowserRouter para habilitar o roteamento baseado em URL no navegador.
import { BrowserRouter } from "react-router-dom";

// Cria a raiz da aplicação no elemento com o id 'root' no HTML.
createRoot(document.getElementById("root")).render(
	// StrictMode é uma ferramenta para destacar problemas potenciais na aplicação. Ele não renderiza nenhuma UI visível.
	<StrictMode>
		{/* O BrowserRouter envolve o componente principal para fornecer o contexto de roteamento. */}
		<BrowserRouter>
			{/* O componente App é o ponto de entrada principal da sua interface de usuário. */}
			<App />
		</BrowserRouter>
	</StrictMode>
);
