import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";
import Swal from "sweetalert2";

const HistoricoPartidas = () => {
    const [historico, setHistorico] = useState([]); // Estado para armazenar as partidas históricas
    const [loading, setLoading] = useState(false); // Para mostrar o spinner durante o carregamento
    const [error, setError] = useState(""); // Para mostrar possíveis erros

    // Função para buscar o histórico das partidas
    const fetchHistorico = async () => {
        setLoading(true); // Inicia o spinner
        try {
            const querySnapshot = await getDocs(collection(db, "matches"));
            const partidasList = [];
            querySnapshot.forEach((doc) => {
                partidasList.push({ id: doc.id, ...doc.data() });
            });

            // Filtra e mostra apenas as partidas já finalizadas
            const partidasFinalizadas = partidasList.filter(
                (match) => match.result !== "pending"
            );

            // Ordena as partidas por rodada
            partidasFinalizadas.sort((a, b) => a.round - b.round);

            setHistorico(partidasFinalizadas); // Atualiza o estado com o histórico
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
            setError("Erro ao carregar o histórico de partidas. Tente novamente.");
        } finally {
            setLoading(false); // Finaliza o spinner
        }
    };

    // Carregar o histórico quando o componente for montado
    useEffect(() => {
        fetchHistorico();
    }, []);

    // Função para agrupar partidas por turno
    const groupByTurn = (matches) => {
        return matches.reduce((acc, match) => {
            const turno = match.turno === 1 ? "Turno 1" : "Turno 2";
            if (!acc[turno]) {
                acc[turno] = [];
            }
            acc[turno].push(match);
            return acc;
        }, {});
    };

    // Agrupa as partidas por turno
    const groupedMatches = groupByTurn(historico);

    // Função para editar o resultado de uma partida
    const editMatch = (match) => {
        // Exibe o modal SweetAlert2 para editar os gols dos jogadores
        Swal.fire({
            title: `Editar Resultado: ${match.player1} vs ${match.player2}`,
            html: ` 
                <div class="form-group">
                    <label for="player1Goals">Gols ${match.player1}:</label>
                    <input type="number" id="player1Goals" class="swal2-input" value="${match.player1Goals}" />
                </div>
                <div class="form-group">
                    <label for="player2Goals">Gols ${match.player2}:</label>
                    <input type="number" id="player2Goals" class="swal2-input" value="${match.player2Goals}" />
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const player1Goals = document.getElementById("player1Goals").value;
                const player2Goals = document.getElementById("player2Goals").value;

                // Atualizar no Firebase
                return updateMatchResult(match.id, player1Goals, player2Goals);
            }
        });
    };

    // Função para atualizar os resultados no Firebase
    const updateMatchResult = async (matchId, player1Goals, player2Goals) => {
        try {
            const matchRef = doc(db, "matches", matchId);

            // Determinar o resultado
            const result = player1Goals === player2Goals
                ? "draw"
                : player1Goals > player2Goals
                    ? "win"
                    : "loss";

            // Atualizar a partida no Firebase
            await updateDoc(matchRef, {
                player1Goals: Number(player1Goals),
                player2Goals: Number(player2Goals),
                result: result,
            });

            Swal.fire({
                icon: "success",
                title: "Resultado Atualizado!",
                text: "Os gols foram atualizados com sucesso.",
            });

            fetchHistorico(); // Recarregar o histórico para refletir as mudanças
        } catch (error) {
            console.error("Erro ao atualizar resultado:", error);
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Não foi possível atualizar os resultados. Tente novamente.",
            });
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4 text-center">
                <h2 className="mb-4">Histórico de Partidas</h2>

                {error && <p className="text-danger">{error}</p>}

                {/* Spinner enquanto carrega */}
                {loading ? (
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                ) : (
                    <>
                        {/* Se não houver partidas no histórico */}
                        {historico.length === 0 ? (
                            <p className="text-center">Não há partidas para exibir.</p>
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
                                                        <th className="align-middle">Jogador 1</th>
                                                        <th className="align-middle">Jogador 2</th>
                                                        <th className="align-middle">Gols Jogador 1</th>
                                                        <th className="align-middle">Gols Jogador 2</th>
                                                        <th className="align-middle">Resultado</th>
                                                        <th className="align-middle">Ações</th> {/* Nova coluna para o botão de editar */}
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
                                                                <button
                                                                    className="btn btn-warning"
                                                                    onClick={() => editMatch(match)}
                                                                >
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
                                                        <th className="align-middle">Jogador 1</th>
                                                        <th className="align-middle">Jogador 2</th>
                                                        <th className="align-middle">Gols Jogador 1</th>
                                                        <th className="align-middle">Gols Jogador 2</th>
                                                        <th className="align-middle">Resultado</th>
                                                        <th className="align-middle">Ações</th> {/* Nova coluna para o botão de editar */}
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
                                                                <button
                                                                    className="btn btn-warning"
                                                                    onClick={() => editMatch(match)}
                                                                >
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
        </>
    );
};

export default HistoricoPartidas;
