import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";
import Breadcrumb from "../../components/breadcrumb";
import Footer from "../../components/footer";
import * as echarts from 'echarts';

const Classificacao = () => {
    const [players, setPlayers] = useState([]);
    // const [matches, setMatches] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const chartRef = useRef(null);  // Referência para o elemento do gráfico

    const fetchPlayers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "players"));
            const playersList = [];
            querySnapshot.forEach((doc) => {
                playersList.push({ id: doc.id, ...doc.data() });
            });

            playersList.sort((a, b) => {
                if (b.points === a.points) {
                    return b.goalDifference - a.goalDifference;
                }
                return b.points - a.points;
            });

            setPlayers(playersList);
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
            setError("Erro ao carregar a classificação. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMatches = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "matches"));
            const matchesList = [];
            querySnapshot.forEach((doc) => {
                matchesList.push(doc.data());
            });
            // setMatches(matchesList); // Puxa o todas as partidas
        } catch (error) {
            console.error("Erro ao buscar partidas:", error);
        }
    };

    useEffect(() => {
        fetchPlayers();
        fetchMatches();
    }, []);

    // Gerar o gráfico no ECharts quando os jogadores são carregados
    useEffect(() => {
        if (players.length > 0 && chartRef.current) {
            const myChart = echarts.init(chartRef.current, 'dark');

            // Dados para o gráfico radar
            const indicators = [
                { name: 'VIT', max: Math.max(...players.map(p => p.wins)) },
                { name: 'E', max: Math.max(...players.map(p => p.draws)) },
                { name: 'DER', max: Math.max(...players.map(p => p.losses)) },
                { name: 'GM', max: Math.max(...players.map(p => p.goalsFor)) },
                { name: 'GC', max: Math.max(...players.map(p => p.goalsAgainst)) },
            ];

            const seriesData = players.map(player => ({
                value: [
                    player.wins,
                    player.draws,
                    player.losses,
                    player.goalsFor,
                    player.goalsAgainst
                ],
                name: player.name,
            }));

            const option = {
                title: {
                    text: 'Estatísticas dos Jogadores',
                    left: 'center',
                },
                radar: {
                    indicator: indicators,
                    shape: 'exagonal',
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)',
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)',
                        },
                    },
                    // Remova ou ajuste esta parte para evitar problemas de legibilidade
                    // alignTicks: true, 
                },
                legend: {
                    data: players.map(player => player.name),
                    bottom: 10,
                },
                series: [
                    {
                        type: 'radar',
                        data: seriesData,
                    },
                ],
            };

            myChart.setOption(option);
        }
    }, [players]);

    return (
        <>
            <Navbar />
            <div className="container mt-5 d-flex flex-column" style={{ minHeight: '60vh' }}>
                <Breadcrumb tituloAnterior="Histórico de Partidas" linkAnterior="/HistoricoPartidas" />
                <h2 className="my-4 text-success text-center"><b>Classificação</b></h2>

                {error && <p className="text-danger text-center">{error}</p>}

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
                                            <td className="text-center align-middle">{index + 1}</td>
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

                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "500px" }}>
                    <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Classificacao;
