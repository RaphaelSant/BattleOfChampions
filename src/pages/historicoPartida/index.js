import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar";
import Loading from "../../components/assets/loading.gif";
import Breadcrumb from "../../components/breadcrumb";
import Footer from "../../components/footer";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { PiEqualsFill } from "react-icons/pi";

const HistoricoPartidas = () => {
    const [historico, setHistorico] = useState([]); // Estado para armazenar as partidas históricas
    const [loading, setLoading] = useState(false); // Para mostrar o spinner durante o carregamento
    const [editMatch, setEditMatch] = useState(null); // Estado para controlar a edição

    // Função para buscar o histórico das partidas
    const fetchHistorico = async () => {
        setLoading(true); // Inicia o spinner
        try {
            const querySnapshot = await getDocs(collection(db, "matches"));
            const partidasList = [];
            querySnapshot.forEach((doc) => {
                partidasList.push({ id: doc.id, ...doc.data() });
            });

            // Filtra apenas as partidas com resultado definido (onde result não é "pending")
            const partidasFinalizadas = partidasList.filter((match) => match.result !== "pending");

            // Ordena as partidas por rodada e turno
            partidasFinalizadas.sort((a, b) => a.round - b.round || a.turno - b.turno);

            setHistorico(partidasFinalizadas); // Atualiza o estado com as partidas finalizadas
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setLoading(false); // Finaliza o spinner
        }
    };

    useEffect(() => {
        fetchHistorico();
    }, []);

    // Função para resetar os resultados de todos os players
    const resetPlayerStats = async () => {
        const playersRef = collection(db, "players");
        const querySnapshot = await getDocs(playersRef);

        // Para cada jogador, zerar as estatísticas
        querySnapshot.forEach(async (playerDoc) => {
            const playerRef = doc(playersRef, playerDoc.id);
            await updateDoc(playerRef, {
                wins: 0,
                losses: 0,
                draws: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
            });
        });
    };

    // Função para recalcular as estatísticas com base nas partidas
    const recalculateStats = async () => {
        const matchesRef = collection(db, "matches");
        const querySnapshot = await getDocs(matchesRef);

        // Para cada partida, atualizar as estatísticas dos jogadores envolvidos
        querySnapshot.forEach(async (matchDoc) => {
            const match = matchDoc.data();
            const { player1Goals, player2Goals, idPlayer1, idPlayer2 } = match;

            // Atualizar as estatísticas de ambos os jogadores com base na partida
            await updatePlayerStats(idPlayer1, idPlayer2, player1Goals, player2Goals);
        });
    };

    // Função para agrupar partidas por turno
    const groupByTurn = (matches) => {
        return matches.reduce((acc, match) => {
            const turno = match.turno === 1 ? "Turno 1" : "Turno 2"; // Ajuste aqui para garantir a chave correta
            if (!acc[turno]) {
                acc[turno] = [];
            }
            acc[turno].push(match);
            return acc;
        }, {});
    };

    // Função para calcular e atualizar as estatísticas dos jogadores
    const updatePlayerStats = async (player1Id, player2Id, player1Goals, player2Goals) => {
        const playersRef = collection(db, "players");

        const player1Ref = doc(playersRef, player1Id);
        await updateDoc(player1Ref, {
            goalsFor: increment(player1Goals),
            goalsAgainst: increment(player2Goals),
            goalDifference: increment(player1Goals - player2Goals),
            wins: increment(player1Goals > player2Goals ? 1 : 0),
            losses: increment(player1Goals < player2Goals ? 1 : 0),
            draws: increment(player1Goals === player2Goals ? 1 : 0),
            points: increment(player1Goals > player2Goals ? 3 : player1Goals < player2Goals ? 0 : 1),
        });

        const player2Ref = doc(playersRef, player2Id);
        await updateDoc(player2Ref, {
            goalsFor: increment(player2Goals),
            goalsAgainst: increment(player1Goals),
            goalDifference: increment(player2Goals - player1Goals),
            wins: increment(player2Goals > player1Goals ? 1 : 0),
            losses: increment(player2Goals < player1Goals ? 1 : 0),
            draws: increment(player2Goals === player1Goals ? 1 : 0),
            points: increment(player2Goals > player1Goals ? 3 : player2Goals < player1Goals ? 0 : 1),
        });
    };

    const handleEditMatch = (match) => {
        setEditMatch(match); // Definir a partida a ser editada
    };

    // Função para salvar as edições de partidas
    const handleSaveEdit = async () => {
        if (editMatch) {
            // Antes de iniciar a atualização, abre o SweetAlert2 com um spinner
            Swal.fire({
                title: 'Aguarde',
                text: 'Salvando a partida...',
                imageUrl: Loading, // Aqui você pode usar um spinner customizado
                imageWidth: 150,
                imageHeight: 150,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            const { id, player1, player2 } = editMatch;

            try {
                // Atualizar a partida no Firebase antes de recalcular as estatísticas
                const matchRef = doc(db, "matches", id);
                await updateDoc(matchRef, {
                    player1Goals: editMatch.player1Goals,
                    player2Goals: editMatch.player2Goals,
                    result: editMatch.player1Goals > editMatch.player2Goals
                        ? player1
                        : editMatch.player1Goals < editMatch.player2Goals
                            ? player2
                            : "EMPATE",
                });

                // Resetar as estatísticas de todos os jogadores
                await resetPlayerStats();

                // Recalcular as estatísticas após zerar
                await recalculateStats();

                // Após salvar, fecha o modal e mostra a confirmação
                Swal.close(); // Fecha o SweetAlert
                setEditMatch(null); // Limpar o estado de edição
                fetchHistorico(); // Recarregar o histórico de partidas
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Partida salva com sucesso!',
                    customClass: {
                        confirmButton: "btn btn-lg btn-success w-100",
                    },
                    buttonsStyling: false
                });
            } catch (error) {
                // Se ocorrer algum erro
                Swal.close(); // Fecha o SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Houve um erro ao salvar a partida. Tente novamente.',
                });
            }
        }
    };

    // Função para aumentar ou diminuir os gols
    const adjustGoals = (type, player) => {
        setEditMatch((prevMatch) => {
            const updatedMatch = { ...prevMatch };
            if (player === "player1") {
                updatedMatch.player1Goals = type === "increment"
                    ? updatedMatch.player1Goals + 1
                    : updatedMatch.player1Goals > 0
                        ? updatedMatch.player1Goals - 1
                        : 0;
            } else {
                updatedMatch.player2Goals = type === "increment"
                    ? updatedMatch.player2Goals + 1
                    : updatedMatch.player2Goals > 0
                        ? updatedMatch.player2Goals - 1
                        : 0;
            }
            return updatedMatch;
        });
    };

    // Função para manipular a mudança de valor nos inputs
    const handleResultChange = (player, value) => {
        setEditMatch((prevMatch) => {
            const updatedMatch = { ...prevMatch };
            if (player === "player1") {
                updatedMatch.player1Goals = parseInt(value) || 0;
            } else {
                updatedMatch.player2Goals = parseInt(value) || 0;
            }
            return updatedMatch;
        });
    };

    // Agrupar as partidas
    const groupedMatches = groupByTurn(historico);

    return (
        <>
            <Navbar />

            <div className="text-center container mt-5 d-flex flex-column" style={{ minHeight: '60vh' }}>

                <Breadcrumb tituloAnterior="Inserir Resultados" linkAnterior="/InserirResultados" tituloProximo="Classificação" linkProximo="/Classificacao" />

                <h2 className="my-4 text-success"><b>Histórico de Partidas</b></h2>

                {/* Spinner enquanto carrega */}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <div className="spinner-border text-dark" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Se não houver partidas no histórico */}
                        {historico.length === 0 ? (
                            <p className="text-center">Não há partidas finalizadas para exibir.</p>
                        ) : (
                            <>
                                {/* Exibe partidas do Turno 1 */}
                                {groupedMatches["Turno 1"] && groupedMatches["Turno 1"].length > 0 && (
                                    <>
                                        <h3 className="mt-4">Turno 1</h3>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered mt-3">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="align-middle">Rodada</th>
                                                        <th className="align-middle">J1</th>
                                                        <th className="align-middle">J2</th>
                                                        <th className="align-middle">GJ1</th>
                                                        <th className="align-middle">GJ2</th>
                                                        <th className="align-middle">Resultado</th>
                                                        <th className="align-middle">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {groupedMatches["Turno 1"].map((match) => (
                                                        <tr key={match.id} className="align-middle">
                                                            <td>{match.round + 1}</td>
                                                            <td>
                                                                {match.player1Goals > match.player2Goals
                                                                    ? <> {match.player1} <FaCheckCircle color="green" /> </>  // Exibe o jogador 1 com o ícone se ele for o vencedor
                                                                    : match.player1Goals === match.player2Goals
                                                                        ? <> {match.player1} <PiEqualsFill color="#ffa200" /> </>  // Exibe "EMPATE" se os gols forem iguais
                                                                        : match.player1Goals < match.player2Goals
                                                                            ? <> {match.player1} <IoMdCloseCircle color="red" /> </>  // Exibe o jogador 1 com o ícone se ele for o perdedor
                                                                            : null  // Caso contrário, não exibe nada
                                                                }
                                                            </td>

                                                            <td>
                                                                {match.player2Goals > match.player1Goals
                                                                    ? <> {match.player2} <FaCheckCircle color="green" /> </>  // Exibe o jogador 1 com o ícone se ele for o vencedor
                                                                    : match.player2Goals === match.player1Goals
                                                                        ? <> {match.player2} <PiEqualsFill color="#ffa200" /> </>  // Exibe "EMPATE" se os gols forem iguais
                                                                        : match.player2Goals < match.player1Goals
                                                                            ? <> {match.player2} <IoMdCloseCircle color="red" /> </>  // Exibe o jogador 1 com o ícone se ele for o perdedor
                                                                            : null  // Caso contrário, não exibe nada
                                                                }
                                                            </td>

                                                            <td>{match.player1Goals}</td>
                                                            <td>{match.player2Goals}</td>
                                                            <td>
                                                                {match.player1Goals > match.player2Goals
                                                                    ? match.player1
                                                                    : match.player1Goals < match.player2Goals
                                                                        ? match.player2
                                                                        : "EMPATE"}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-warning" onClick={() => handleEditMatch(match)}>
                                                                    Editar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {/* Exibe partidas do Turno 2 */}
                                {groupedMatches["Turno 2"] && groupedMatches["Turno 2"].length > 0 && (
                                    <>
                                        <h3 className="mt-4">Turno 2</h3>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered nowrap mt-3">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="align-middle">Rodada</th>
                                                        <th className="align-middle">J1</th>
                                                        <th className="align-middle">J2</th>
                                                        <th className="align-middle">GJ1</th>
                                                        <th className="align-middle">GJ2</th>
                                                        <th className="align-middle">Resultado</th>
                                                        <th className="align-middle">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {groupedMatches["Turno 2"].map((match) => (
                                                        <tr key={match.id} className="align-middle">
                                                            <td>{match.round + 1}</td>

                                                            <td>
                                                                {match.player1Goals > match.player2Goals
                                                                    ? <> {match.player1} <FaCheckCircle color="green" /> </>  // Exibe o jogador 1 com o ícone se ele for o vencedor
                                                                    : match.player1Goals === match.player2Goals
                                                                        ? <> {match.player1} <PiEqualsFill color="#ffa200" /> </>  // Exibe "EMPATE" se os gols forem iguais
                                                                        : match.player1Goals < match.player2Goals
                                                                            ? <> {match.player1} <IoMdCloseCircle color="red" /> </>  // Exibe o jogador 1 com o ícone se ele for o perdedor
                                                                            : null  // Caso contrário, não exibe nada
                                                                }
                                                            </td>

                                                            <td>
                                                                {match.player2Goals > match.player1Goals
                                                                    ? <> {match.player2} <FaCheckCircle color="green" /> </>  // Exibe o jogador 1 com o ícone se ele for o vencedor
                                                                    : match.player2Goals === match.player1Goals
                                                                        ? <> {match.player2} <PiEqualsFill color="#ffa200" /> </>  // Exibe "EMPATE" se os gols forem iguais
                                                                        : match.player2Goals < match.player1Goals
                                                                            ? <> {match.player2} <IoMdCloseCircle color="red" /> </>  // Exibe o jogador 1 com o ícone se ele for o perdedor
                                                                            : null  // Caso contrário, não exibe nada
                                                                }
                                                            </td>

                                                            <td>{match.player1Goals}</td>
                                                            <td>{match.player2Goals}</td>
                                                            <td>
                                                                {match.player1Goals > match.player2Goals
                                                                    ? match.player1
                                                                    : match.player1Goals < match.player2Goals
                                                                        ? match.player2
                                                                        : "EMPATE"}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-warning" onClick={() => handleEditMatch(match)}>
                                                                    Editar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Edição */}
            {editMatch && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Editar Partida</h5>
                                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={() => setEditMatch(null)}>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Input de Gols do Jogador 1 */}
                                <div className="form-group mb-3 text-center">
                                    <label>Gols {editMatch.player1}</label>
                                    <div className="input-group">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => adjustGoals("decrement", "player1")}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="form-control text-center"
                                            value={editMatch.player1Goals}
                                            onChange={(e) => handleResultChange("player1", e.target.value)}
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={() => adjustGoals("increment", "player1")}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {/* Input de Gols do Jogador 2 */}
                                <div className="form-group mb-3 text-center">
                                    <label>Gols {editMatch.player2}</label>
                                    <div className="input-group">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => adjustGoals("decrement", "player2")}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="form-control text-center"
                                            value={editMatch.player2Goals}
                                            onChange={(e) => handleResultChange("player2", e.target.value)}
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={() => adjustGoals("increment", "player2")}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" onClick={() => setEditMatch(null)}>Cancelar</button>
                                <button type="button" className="btn btn-success" onClick={handleSaveEdit}>Salvar alterações</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default HistoricoPartidas;
