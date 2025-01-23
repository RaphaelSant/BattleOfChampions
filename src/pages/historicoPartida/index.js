import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar";
import Loading from "../../components/assets/loading.gif";

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

    // Função para calcular e atualizar o resultado dos jogadores
    const updatePlayerStats = async (player1Id, player2Id, player1Goals, player2Goals) => {
        const playersRef = collection(db, "players");

        const player1Ref = doc(playersRef, player1Id);
        await updateDoc(player1Ref, {
            goalsFor: player1Goals,
            goalsAgainst: player2Goals,
            goalDifference: player1Goals - player2Goals,
            wins: player1Goals > player2Goals ? 1 : 0,
            losses: player1Goals < player2Goals ? 1 : 0,
            draws: player1Goals === player2Goals ? 1 : 0,
            points: player1Goals > player2Goals ? 3 : player1Goals < player2Goals ? 0 : 1,
        });

        const player2Ref = doc(playersRef, player2Id);
        await updateDoc(player2Ref, {
            goalsFor: player2Goals,
            goalsAgainst: player1Goals,
            goalDifference: player2Goals - player1Goals,
            wins: player2Goals > player1Goals ? 1 : 0,
            losses: player2Goals < player1Goals ? 1 : 0,
            draws: player2Goals === player1Goals ? 1 : 0,
            points: player2Goals > player1Goals ? 3 : player2Goals < player1Goals ? 0 : 1,
        });
    };

    const handleEditMatch = (match) => {
        setEditMatch(match); // Definir a partida a ser editada
    };

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

            const { id, player1, player2, idPlayer1, idPlayer2 } = editMatch;

            try {
                // Atualizar a partida no Firebase
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

                // Atualizar as estatísticas dos jogadores
                await updatePlayerStats(idPlayer1, idPlayer2, editMatch.player1Goals, editMatch.player2Goals);

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

            <div className="container mt-4 text-center">
                <h2 className="mb-4">Histórico de Partidas</h2>

                {/* Spinner enquanto carrega */}
                {loading ? (
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Carregando...</span>
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
                                                            <td>{match.player1}</td>
                                                            <td>{match.player2}</td>
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
                                                    {groupedMatches["Turno 2"].map((match) => (
                                                        <tr key={match.id} className="align-middle">
                                                            <td>{match.round + 1}</td>
                                                            <td>{match.player1}</td>
                                                            <td>{match.player2}</td>
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
        </>
    );
};

export default HistoricoPartidas;
