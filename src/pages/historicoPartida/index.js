import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

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

    return (
        <div>
            <h2>Histórico de Partidas</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Rodada</th>
                        <th>Jogador 1</th>
                        <th>Jogador 2</th>
                        <th>Gols Jogador 1</th>
                        <th>Gols Jogador 2</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {historico.length === 0 ? (
                        <tr>
                            <td colSpan="6">Não há partidas finalizadas para exibir.</td>
                        </tr>
                    ) : (
                        historico.map((match) => (
                            <tr key={match.id}>
                                <td>{match.round}</td>
                                <td>{match.player1}</td>
                                <td>{match.player2}</td>
                                <td>{match.player1Goals}</td>
                                <td>{match.player2Goals}</td>
                                <td>{match.player1Goals > match.player2Goals ? match.player1 : match.player1Goals < match.player2Goals ? match.player2 : "EMPATE"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HistoricoPartidas;
