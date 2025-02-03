import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";
import Breadcrumb from "../../components/breadcrumb";
import Footer from "../../components/footer";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Classificacao = () => {
    const [players, setPlayers] = useState([]); // Estado para armazenar os jogadores
    const [error, setError] = useState(""); // Para mostrar possíveis erros
    const [isLoading, setIsLoading] = useState(true); // Estado para controle de carregamento

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
        } finally {
            setIsLoading(false); // Finaliza o carregamento
        }
    };

    // Carregar os jogadores quando o componente for montado
    useEffect(() => {
        fetchPlayers();
    }, []);

    // Função para gerar uma cor aleatória em formato rgba
    const gerarCorAleatoria = () => {
        const r = Math.floor(Math.random() * 256); // Valor aleatório para o componente vermelho (0-255)
        const g = Math.floor(Math.random() * 256); // Valor aleatório para o componente verde (0-255)
        const b = Math.floor(Math.random() * 256); // Valor aleatório para o componente azul (0-255)
        return `rgba(${r}, ${g}, ${b}, 1)`; // Retorna a cor no formato rgba
    };

    const grafico = {
        labels: ['VITÓRIAS', 'EMPATES', 'DERROTAS', 'GOLS MARCADOS', 'GOLS CONTRA'], // Categorias (VIT, EMP, DER, GM, GC)
        datasets: players.map((player) => ({
            label: player.name, // Nome do jogador
            data: [
                player.wins,          // VIT (Vitórias)
                player.draws,         // EMP (Empates)
                player.losses,        // DER (Derrotas)
                player.goalsFor,      // GM (Gols Marcados)
                player.goalsAgainst,  // GC (Gols Contra)
            ],
            backgroundColor: `rgba(100, 100, 100, 0)`, // Cor de fundo aleatória
            borderColor: gerarCorAleatoria(),     // Cor da borda aleatória
            borderWidth: 1,
        })),
    };

    return (
        <>
            <Navbar />

            <div className="container mt-5 d-flex flex-column" style={{ minHeight: '60vh' }}>

                <Breadcrumb tituloAnterior="Histórico de Partidas" linkAnterior="/HistoricoPartidas" />

                <h2 className="my-4 text-success text-center"><b>Classificação</b></h2>

                {error && <p className="text-danger text-center">{error}</p>}

                {/* Spinner exibido enquanto os dados estão sendo carregados */}
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <div className="spinner-border text-dark" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-center align-middle">Posição</th>
                                    <th className="text-center align-middle">Nome</th>
                                    <th className="text-center align-middle">VIT</th>
                                    <th className="text-center align-middle">E</th>
                                    <th className="text-center align-middle">DER</th>
                                    <th className="text-center align-middle">GM</th>
                                    <th className="text-center align-middle">GC</th>
                                    <th className="text-center align-middle">SG</th>
                                    <th className="text-center align-middle">Pts</th>
                                </tr>
                            </thead>
                            <tbody className="thead-dark">
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
                )}

                <div className="d-flex flex-column justify-content-center align-items-center" Style="height: 500px">

                    <Radar data={grafico} />

                </div>

            </div>

            <Footer />
        </>
    );
};

export default Classificacao;
