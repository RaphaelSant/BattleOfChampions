import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from '../../components/assets/logo.png';
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

const Home = () => {
    const [showModal, setShowModal] = useState(false); // Estado para controlar a visibilidade do modal

    useEffect(() => {
        setShowModal(true); // Exibe o modal assim que a página for carregada
    }, []);

    return (
        <>
            <Navbar />

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', opacity: 1 }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Bem-vindo ao Battle of Champions!</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-center">Estamos felizes em ter você participando do <b>Battle of Champions</b>!</p>
                                <p>Para começar seu torneio, siga os passos abaixo:</p>

                                <ol className="ps-3">
                                    <li><b>Cadastre os jogadores:</b> Insira os nomes dos jogadores para iniciar o campeonato.</li>
                                    <li><b>Realize o sorteio dos confrontos:</b> Após o cadastro, sorteie os confrontos entre os jogadores de forma aleatória.</li>
                                    <li><b>Insira os resultados:</b> A cada rodada, registre os resultados das partidas para manter a classificação atualizada.</li>
                                    <li><b>Finalização e reset:</b> Quando o torneio terminar, na barra de navegação "Sistema", você pode resetar o sistema e iniciar um novo campeonato.</li>
                                </ol>

                                <p>Esses passos irão garantir que seu torneio aconteça de forma organizada e divertida!</p>

                                <p className="text-center">Boa sorte!</p>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary w-100 btn-lg" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-fluid d-flex flex-column min-vh-100">
                {/* Header */}
                <header className="text-center my-5">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="mb-4"
                    />
                    <h1 className="display-4 text-success">Battle of Champions</h1>
                    <p className="lead text-muted">Bem-vindo à melhor competição de futebol!</p>
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
                                <Link to="/CadastroJogadores" className="btn btn-lg w-100 btn-success">
                                    Cadastrar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://s2-techtudo.glbimg.com/x6ULX5HlgCeLToQCzOUAH6SsNl8=/0x0:620x353/600x0/smart/filters:gifv():strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/B/M/N9NHJ8R2eUoqoN9BiPkw/2012-08-22-pes20131.jpg"
                                className="card-img-top"
                                alt="Sorteio de Confrontos"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Sorteio de Confrontos</b></h5>
                                <p className="card-text">
                                    Realize o sorteio dos confrontos entre os jogadores.
                                </p>
                                <Link to="/SorteioConfrontos" className="btn btn-lg w-100 btn-success">
                                    Sortear
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://www.gamers-shop.dk/images/game_img/screenshots/pes2013/ss_98d225534aacb4f80f845c4e9df6c9dec327f3c7.1920x1080.jpg"
                                className="card-img-top"
                                alt="Inserir Resultados"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Inserir Resultados</b></h5>
                                <p className="card-text">
                                    Insira os resultados das partidas e mantenha a pontuação atualizada.
                                </p>
                                <Link to="/InserirResultados" className="btn btn-lg w-100 btn-success">
                                    Inserir resultados
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://steamuserimages-a.akamaihd.net/ugc/820063037364283687/A8FBBE94AAE593E2170D1A03276E50A789275C32/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
                                className="card-img-top"
                                alt="Histórico de Partidas"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Histórico de Partidas</b></h5>
                                <p className="card-text">
                                    Acesse o histórico de todas as partidas jogadas.
                                </p>
                                <Link to="/HistoricoPartidas" className="btn btn-lg w-100 btn-success">
                                    Histórico
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card shadow-sm">
                            <img
                                src="https://www.gamers-shop.dk/images/game_img/screenshots/pes2013/ss_e9023d31296990f1e767924533d6138d9c11c139.1920x1080.jpg"
                                className="card-img-top"
                                alt="Classificação"
                            />
                            <div className="card-body">
                                <h5 className="card-title"><b>Classificação</b></h5>
                                <p className="card-text">
                                    Veja a classificação geral de todos os jogadores.
                                </p>
                                <Link to="/Classificacao" className="btn btn-lg w-100 btn-success">
                                    Classificação
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default Home;
