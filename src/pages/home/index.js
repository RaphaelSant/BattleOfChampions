import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../components/assets/logo.png';
import Navbar from "../../components/navbar";

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                {/* Header */}
                <header className="text-center my-5">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="mb-4"
                    />
                    <h1 className="display-4 text-primary">Battle of Champions</h1>
                    <p className="lead text-muted">Welcome to the ultimate football competition!</p>
                </header>

                {/* Cards Section */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://via.placeholder.com/150"
                                className="card-img-top"
                                alt="Cadastro de Jogadores"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Cadastro de Jogadores</h5>
                                <p className="card-text">
                                    Cadastre os jogadores para iniciar o campeonato.
                                </p>
                                <Link to="/CadastroJogadores" className="btn btn-primary">
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://via.placeholder.com/150"
                                className="card-img-top"
                                alt="Sorteio de Confrontos"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Sorteio de Confrontos</h5>
                                <p className="card-text">
                                    Realize o sorteio dos confrontos entre os jogadores.
                                </p>
                                <Link to="/SorteioConfrontos" className="btn btn-primary">
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://via.placeholder.com/150"
                                className="card-img-top"
                                alt="Inserir Resultados"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Inserir Resultados</h5>
                                <p className="card-text">
                                    Insira os resultados das partidas e mantenha a pontuação atualizada.
                                </p>
                                <Link to="/InserirResultados" className="btn btn-primary">
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://via.placeholder.com/150"
                                className="card-img-top"
                                alt="Histórico de Partidas"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Histórico de Partidas</h5>
                                <p className="card-text">
                                    Acesse o histórico de todas as partidas jogadas.
                                </p>
                                <Link to="/HistoricoPartidas" className="btn btn-primary">
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://via.placeholder.com/150"
                                className="card-img-top"
                                alt="Classificação"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Classificação</h5>
                                <p className="card-text">
                                    Veja a classificação geral de todos os jogadores.
                                </p>
                                <Link to="/Classificacao" className="btn btn-primary">
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
