import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../../pages/login";
import Home from "../../pages/home";
import CadastroJogadores from "../../pages/cadastroJogadores";
import SorteioConfrontos from "../../pages/sorteioConfrontos";
import InserirResultados from "../../pages/inserirResultados";
import HistoricoPartidas from "../../pages/historicoPartida";
import Classificacao from "../../pages/classificacao";

export default function Rotas() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/CadastroJogadores" element={<CadastroJogadores />} />
                <Route path="/SorteioConfrontos" element={<SorteioConfrontos />} />
                <Route path="/InserirResultados" element={<InserirResultados />} />
                <Route path="/HistoricoPartidas" element={<HistoricoPartidas />} />
                <Route path="/Classificacao" element={<Classificacao />} />
            </Routes>
        </BrowserRouter>
    );
}