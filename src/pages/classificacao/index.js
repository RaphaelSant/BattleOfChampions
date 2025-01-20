import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";

const Classificacao = () => {
    const [players, setPlayers] = useState([]); // Estado para armazenar os jogadores
    const [error, setError] = useState(""); // Para mostrar possíveis erros

    // Função para buscar os jogadores da coleção 'players'
    const fetchPlayers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "players"));
            const playersList = [];
            querySnapshot.forEach((doc) => {
                playersList.push({ id: doc.id, ...doc.data() });
            });

            // Ordena os jogadores pelos pontos e saldo de gols (goalDifference)
            playersList.sort((a, b) => {
                if (b.points === a.points) {
                    return b.goalDifference - a.goalDifference; // Se os pontos forem iguais, ordena pelo saldo de gols
                }
                return b.points - a.points; // Ordena pelos pontos
            });

            setPlayers(playersList); // Atualiza o estado com a lista de jogadores ordenada
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
            setError("Erro ao carregar a classificação. Tente novamente.");
        }
    };

    // Carregar os jogadores quando o componente for montado
    useEffect(() => {
        fetchPlayers();
    }, []);

    return (
        <>
            <Navbar />

            <div>
                <h2>Classificação</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <table>
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome</th>
                            <th>Vitórias</th>
                            <th>Empates</th>
                            <th>Derrotas</th>
                            <th>Gols a Favor</th>
                            <th>Gols Contra</th>
                            <th>Saldo de Gols</th>
                            <th>Pontos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.length === 0 ? (
                            <tr>
                                <td colSpan="9">Não há jogadores para exibir.</td>
                            </tr>
                        ) : (
                            players.map((player, index) => (
                                <tr key={player.id}>
                                    <td>{index + 1}</td> {/* Posição na tabela */}
                                    <td>{player.name}</td>
                                    <td>{player.wins}</td>
                                    <td>{player.draws}</td>
                                    <td>{player.losses}</td>
                                    <td>{player.goalsFor}</td>
                                    <td>{player.goalsAgainst}</td>
                                    <td>{player.goalDifference}</td>
                                    <td>{player.points}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Classificacao;
