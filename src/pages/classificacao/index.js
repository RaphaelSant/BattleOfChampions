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

            <div className="container mt-4">
                <h2 className="mb-4 text-center">Classificação</h2>

                {error && <p className="text-danger text-center">{error}</p>}

                <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3">
                        <thead className="thead-dark">
                            <tr>
                                <th className="text-center align-middle">Posição</th>
                                <th className="text-center align-middle">Nome</th>
                                <th className="text-center align-middle">Vitórias</th>
                                <th className="text-center align-middle">Empates</th>
                                <th className="text-center align-middle">Derrotas</th>
                                <th className="text-center align-middle">Gols a Favor</th>
                                <th className="text-center align-middle">Gols Contra</th>
                                <th className="text-center align-middle">Saldo de Gols</th>
                                <th className="text-center align-middle">Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center">Não há jogadores para exibir.</td>
                                </tr>
                            ) : (
                                players.map((player, index) => (
                                    <tr key={player.id}>
                                        <td className="text-center align-middle">{index + 1}</td> {/* Posição na tabela */}
                                        <td className="text-center align-middle">{player.name}</td>
                                        <td className="text-center align-middle">{player.wins}</td>
                                        <td className="text-center align-middle">{player.draws}</td>
                                        <td className="text-center align-middle">{player.losses}</td>
                                        <td className="text-center align-middle">{player.goalsFor}</td>
                                        <td className="text-center align-middle">{player.goalsAgainst}</td>
                                        <td className="text-center align-middle">{player.goalDifference}</td>
                                        <td className="text-center align-middle">{player.points}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
};

export default Classificacao;
