import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                {/* Logo ou título da aplicação */}
                <Link className="navbar-brand" to="/Home">
                    Battle of Champions
                </Link>
                {/* Toggler para mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* Links de navegação */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/CadastroJogadores">
                                Cadastro de Jogadores
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/SorteioConfrontos">
                                Sorteio de Confrontos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/InserirResultados">
                                Inserir Resultados
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/HistoricoPartidas">
                                Histórico de Partidas
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Classificacao">
                                Classificação
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
