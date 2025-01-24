import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, deleteDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";
import Swal from 'sweetalert2';
import Loading from "../../components/assets/loading.gif";  // A imagem do spinner
import Footer from "../../components/footer";
import Breadcrumb from "../../components/breadcrumb";

const CadastroJogadores = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [players, setPlayers] = useState([]); // Estado para armazenar os jogadores cadastrados
    const [loading, setLoading] = useState(false); // Estado para controle de carregamento

    // Função para salvar o jogador no Firestore
    const savePlayer = async (name) => {
        if (!name.trim()) {
            setError("O nome do jogador é obrigatório!");
            return;
        }

        setLoading(true); // Inicia o carregamento (spinner)

        // Exibe o carregamento do SweetAlert2
        Swal.fire({
            title: 'Aguarde',
            text: 'Salvando jogador...',
            imageUrl: Loading, // Seu spinner customizado
            imageWidth: 150,
            imageHeight: 150,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false, // Impede fechar ao clicar fora
            allowEscapeKey: false // Impede fechar ao pressionar ESC
        });

        // Gerar um ID único para cada jogador
        const userId = name.toLowerCase().replace(/\s+/g, "_") + "_" + new Date().toISOString();
        const playerData = {
            name: name.toUpperCase(),
            wins: 0,
            losses: 0,
            draws: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
        };

        try {
            // Cria o jogador no Firestore
            const playerRef = doc(db, "players", userId);
            await setDoc(playerRef, playerData);

            // Exibe a mensagem de sucesso após salvar o jogador
            Swal.fire({
                icon: 'success',
                title: 'Jogador Cadastrado!',
                text: 'O jogador foi cadastrado com sucesso.',
                confirmButtonText: 'Ok!', // Texto do botão
                customClass: {
                    confirmButton: "btn btn-lg btn-success w-100",
                },
                buttonsStyling: false
            });

            setLoading(false); // Finaliza o carregamento (spinner)
            setName(""); // Limpar o campo do nome após o cadastro
            setError(""); // Limpar erro
            fetchPlayers(); // Atualizar a lista de jogadores
        } catch (error) {
            console.error("Erro ao cadastrar jogador:", error);
            setError("Erro ao cadastrar o jogador. Tente novamente.");

            // Exibe a mensagem de erro com SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível cadastrar o jogador. Tente novamente.',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn-success' // Cor do botão de confirmação (verde)
                },
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        } finally {

            //Swal.close(); // Fecha o SweetAlert de carregamento
        }
    };

    // Função para excluir o jogador
    const deletePlayer = async (userId) => {
        // Usando SweetAlert2 para confirmar a exclusão
        const result = await Swal.fire({
            title: 'Você tem certeza?',
            text: 'Esta ação não pode ser desfeita!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: "btn btn-lg btn-success w-100 mb-3",
                cancelButton: "btn btn-lg btn-dark w-100",
            },
            buttonsStyling: false,
        });

        if (result.isConfirmed) {
            try {
                setLoading(true); // Inicia o carregamento (spinner)
                const playerRef = doc(db, "players", userId);
                await deleteDoc(playerRef);

                // Exibe mensagem de sucesso com SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Jogador Excluído!',
                    text: 'O jogador foi excluído com sucesso.',
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Cancelar',
                    customClass: {
                        confirmButton: "btn btn-lg btn-success w-100",
                    },
                    buttonsStyling: false,
                });

                fetchPlayers(); // Atualizar a lista de jogadores
            } catch (error) {
                console.error("Erro ao excluir jogador:", error);
                setError("Erro ao excluir o jogador. Tente novamente.");

                // Exibe mensagem de erro com SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Não foi possível excluir o jogador. Tente novamente.',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: "btn btn-lg btn-success w-100",
                    },
                    buttonsStyling: false,
                });
            } finally {
                setLoading(false); // Finaliza o carregamento (spinner)
            }
        }
    };

    // Função para buscar jogadores do Firestore
    const fetchPlayers = async () => {
        setLoading(true); // Inicia o carregamento (spinner)
        try {
            const querySnapshot = await getDocs(collection(db, "players"));
            const playersList = [];
            querySnapshot.forEach((doc) => {
                playersList.push({ id: doc.id, ...doc.data() });
            });
            setPlayers(playersList); // Atualiza a lista de jogadores
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
            setError("Erro ao carregar os jogadores. Tente novamente.");

            // Exibe mensagem de erro com SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível carregar os jogadores. Tente novamente.',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn-success' // Cor do botão de confirmação (verde)
                },
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        } finally {
            setLoading(false); // Finaliza o carregamento (spinner)
        }
    };

    // Carregar os jogadores quando o componente for montado
    useEffect(() => {
        fetchPlayers();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mt-5 d-flex flex-column text-center" style={{ minHeight: '60vh' }}>
                <Breadcrumb tituloAnterior="Home" linkAnterior="/Home" tituloProximo="Sorteio de Confrontos" linkProximo="/SorteioConfrontos" />
                <h1 className="my-4 text-success"><b>Cadastro de Jogadores</b></h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        savePlayer(name);
                    }}
                    className="mb-4"
                >
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Nome do Jogador:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control text-center"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do jogador"
                            required
                            disabled={loading} // Desabilita o campo de nome enquanto está carregando
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-lg btn-success w-100" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar Jogador'}
                    </button>
                </form>

                <h2 className="mb-4">Jogadores Cadastrados</h2>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                ) : players.length === 0 ? (
                    <p>Nenhum jogador cadastrado.</p>
                ) : (
                    <ul className="list-group">
                        {players.map((player) => (
                            <li key={player.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {player.name}
                                <button
                                    onClick={() => deletePlayer(player.id)}
                                    className="btn btn-danger btn-sm"
                                    disabled={loading}
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CadastroJogadores;
