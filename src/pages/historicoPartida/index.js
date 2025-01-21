import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";

const HistoricoPartidas = () => {
    const [historico, setHistorico] = useState([]); // Estado para armazenar as partidas históricas
    const [error, setError] = useState(""); // Para mostrar possíveis erros

    // Função para buscar o histórico das partidas
    const fetchHistorico = async () => {
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

    return (
        <>
            <Navbar />

            <div className="container mt-4 text-center">
                <h2 className="mb-4">Histórico de Partidas</h2>

                {error && <p className="text-danger">{error}</p>}

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
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedMatches["Turno 1"].map((match) => (
                                        <tr key={match.id}>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedMatches["Turno 2"].map((match) => (
                                        <tr key={match.id}>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>


        </>
    );
};

export default HistoricoPartidas;
