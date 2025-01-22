// Rotas.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../../pages/login";
import Home from "../../pages/home";
import CadastroJogadores from "../../pages/cadastroJogadores";
import SorteioConfrontos from "../../pages/sorteioConfrontos";
import InserirResultados from "../../pages/inserirResultados";
import HistoricoPartidas from "../../pages/historicoPartida";
import Classificacao from "../../pages/classificacao";
import PrivateRoute from "./privateRoute"; // Importe o componente PrivateRoute

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Página pública - Login */}
                <Route path="/" element={<Login />} />

                {/* Rotas privadas */}
                <Route path="/Home" element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                } />
                <Route path="/CadastroJogadores" element={
                    <PrivateRoute>
                        <CadastroJogadores />
                    </PrivateRoute>
                } />
                <Route path="/SorteioConfrontos" element={
                    <PrivateRoute>
                        <SorteioConfrontos />
                    </PrivateRoute>
                } />
                <Route path="/InserirResultados" element={
                    <PrivateRoute>
                        <InserirResultados />
                    </PrivateRoute>
                } />
                <Route path="/HistoricoPartidas" element={
                    <PrivateRoute>
                        <HistoricoPartidas />
                    </PrivateRoute>
                } />
                <Route path="/Classificacao" element={
                    <PrivateRoute>
                        <Classificacao />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
