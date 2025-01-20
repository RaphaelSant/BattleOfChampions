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
                                src="https://s2-techtudo.glbimg.com/SwjcWjLSStFOy9nEG1YyWzWNQoM=/0x0:620x348/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/S/J/f8ONC4QRWSIUhlO9MlRA/2012-04-24-pes002-.jpg"
                                className="card-img-top"
                                alt="Cadastro de Jogadores"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Cadastro de Jogadores</b></h5>
                                <p className="card-text">
                                    Cadastre os jogadores para iniciar o campeonato.
                                </p>
                                <Link to="/CadastroJogadores" className="btn w-100 btn-primary">
                                    Cadastrar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://www.gamers-shop.dk/images/game_img/screenshots/pes2013/ss_e9023d31296990f1e767924533d6138d9c11c139.1920x1080.jpg"
                                className="card-img-top"
                                alt="Sorteio de Confrontos"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Sorteio de Confrontos</b></h5>
                                <p className="card-text">
                                    Realize o sorteio dos confrontos entre os jogadores.
                                </p>
                                <Link to="/SorteioConfrontos" className="btn w-100 btn-primary">
                                    Sortear
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://i.ytimg.com/vi/sSLn-x508YU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA26adTGCpXod35t2K96Gl2O4Vr5w"
                                className="card-img-top"
                                alt="Inserir Resultados"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Inserir Resultados</b></h5>
                                <p className="card-text">
                                    Insira os resultados das partidas e mantenha a pontuação atualizada.
                                </p>
                                <Link to="/InserirResultados" className="btn w-100 btn-primary">
                                    Inserir resultados
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://www.gamers-shop.dk/images/game_img/screenshots/pes2013/ss_98d225534aacb4f80f845c4e9df6c9dec327f3c7.1920x1080.jpg"
                                className="card-img-top"
                                alt="Histórico de Partidas"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Histórico de Partidas</b></h5>
                                <p className="card-text">
                                    Acesse o histórico de todas as partidas jogadas.
                                </p>
                                <Link to="/HistoricoPartidas" className="btn w-100 btn-primary">
                                    Histórico
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://s2-techtudo.glbimg.com/x6ULX5HlgCeLToQCzOUAH6SsNl8=/0x0:620x353/600x0/smart/filters:gifv():strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/B/M/N9NHJ8R2eUoqoN9BiPkw/2012-08-22-pes20131.jpg"
                                className="card-img-top"
                                alt="Classificação"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Classificação</b></h5>
                                <p className="card-text">
                                    Veja a classificação geral de todos os jogadores.
                                </p>
                                <Link to="/Classificacao" className="btn w-100 btn-primary">
                                    Classificação
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
