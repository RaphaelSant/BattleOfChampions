import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <div className="border-top mt-5 bg-light">
                <footer className="py-3 mt-4">
                    <ul className="nav justify-content-center align-items-center flex-column flex-lg-row border-bottom pb-3 mb-3">
                        <li className="nav-item">
                            <Link className="nav-link px-2 text-body-secondary" to="/CadastroJogadores">
                                Cadastro de Jogadores
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-2 text-body-secondary" to="/SorteioConfrontos">
                                Sorteio de Confrontos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-2 text-body-secondary" to="/InserirResultados">
                                Inserir Resultados
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-2 text-body-secondary" to="/HistoricoPartidas">
                                Histórico de Partidas
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-2 text-body-secondary" to="/Classificacao">
                                Classificação
                            </Link>
                        </li>
                    </ul>
                    <p className="text-center text-body-secondary">© 2025 Santiago, Inc</p>
                </footer>
            </div>
        </>
    );
};

export default Footer;
