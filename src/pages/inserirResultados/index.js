import React, { useState, useEffect } from "react";
import { doc, getDocs, updateDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";

const InserirResultados = () => {
    const [matches, setMatches] = useState([]);
    const [matchResults, setMatchResults] = useState({ player1Goals: 0, player2Goals: 0 });
    const [currentMatch, setCurrentMatch] = useState(null);
    const [error, setError] = useState("");

    const fetchMatches = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "matches"));
            const matchesList = [];
            querySnapshot.forEach((doc) => {
                matchesList.push({ id: doc.id, ...doc.data() });
            });

            const pendingMatches = matchesList.filter((match) => match.result === "pending");
            const groupedMatches = groupMatchesByTurnAndRound(pendingMatches);

            setMatches(groupedMatches);
        } catch (error) {
            console.error("Erro ao buscar confrontos:", error);
            setError("Erro ao carregar os confrontos. Tente novamente.");
        }
    };

    const groupMatchesByTurnAndRound = (matches) => {
        const grouped = { turno1: [], turno2: [] };

        matches.forEach((match) => {
            if (match.turno === 1) {
                grouped.turno1.push(match);
            } else if (match.turno === 2) {
                grouped.turno2.push(match);
            }
        });

        grouped.turno1 = groupByRound(grouped.turno1);
        grouped.turno2 = groupByRound(grouped.turno2);

        return grouped;
    };

    const groupByRound = (matches) => {
        return matches.reduce((acc, match) => {
            if (!acc[match.round]) acc[match.round] = [];
            acc[match.round].push(match);
            return acc;
        }, {});
    };

    const loadMatch = (index, turno, round) => {
        if (turno === 1) {
            const turno1Rounds = Object.keys(matches.turno1);
            if (turno1Rounds.length > 0) {
                const match = matches.turno1[round][index];
                setCurrentMatch(match);
                setMatchResults({
                    player1Goals: match.player1Goals || 0,
                    player2Goals: match.player2Goals || 0,
                });
            }
        } else if (turno === 2) {
            const turno2Rounds = Object.keys(matches.turno2);
            if (turno2Rounds.length > 0) {
                const match = matches.turno2[round][index];
                setCurrentMatch(match);
                setMatchResults({
                    player1Goals: match.player1Goals || 0,
                    player2Goals: match.player2Goals || 0,
                });
            }
        }
    };

    const handleResultChange = (player1Goals, player2Goals) => {
        setMatchResults({
            player1Goals: player1Goals || 0,
            player2Goals: player2Goals || 0,
        });
    };

    const incrementGoal = (player) => {
        setMatchResults((prev) => ({
            ...prev,
            [`${player}Goals`]: prev[`${player}Goals`] + 1,
        }));
    };

    const decrementGoal = (player) => {
        setMatchResults((prev) => ({
            ...prev,
            [`${player}Goals`]: Math.max(prev[`${player}Goals`] - 1, 0),
        }));
    };

    const saveMatchResult = async () => {
        if (currentMatch) {
            try {
                const matchRef = doc(db, "matches", currentMatch.id);
                const result = matchResults.player1Goals === matchResults.player2Goals
                    ? "draw"
                    : matchResults.player1Goals > matchResults.player2Goals
                        ? "win"
                        : "loss";

                await updateDoc(matchRef, {
                    player1Goals: matchResults.player1Goals,
                    player2Goals: matchResults.player2Goals,
                    result: result,
                });

                await updatePlayerStats(currentMatch.idPlayer1, currentMatch.idPlayer2, matchResults.player1Goals, matchResults.player2Goals);

                alert("Resultado da partida salvo com sucesso!");
                setCurrentMatch(null);
                fetchMatches();
            } catch (error) {
                console.error("Erro ao salvar resultado:", error);
                setError("Erro ao salvar o resultado da partida. Tente novamente.");
            }
        }
    };

    const updatePlayerStats = async (player1, player2, player1Goals, player2Goals) => {
        try {
            const player1Ref = doc(db, "players", player1);
            const player1Doc = await getDoc(player1Ref);
            const player1Data = player1Doc.data();
            const updatedPlayer1 = {
                ...player1Data,
                goalsFor: player1Data.goalsFor += Number(player1Goals),
                goalsAgainst: player1Data.goalsAgainst += Number(player2Goals),
                goalDifference: player1Data.goalDifference += (Number(player1Goals) - Number(player2Goals)),
            };

            if (player1Goals > player2Goals) {
                updatedPlayer1.wins = player1Data.wins + 1;
                updatedPlayer1.points = player1Data.points + 3;
            } else if (player1Goals < player2Goals) {
                updatedPlayer1.losses = player1Data.losses + 1;
            } else {
                updatedPlayer1.draws = player1Data.draws + 1;
                updatedPlayer1.points = player1Data.points + 1;
            }

            await updateDoc(player1Ref, updatedPlayer1);

            const player2Ref = doc(db, "players", player2);
            const player2Doc = await getDoc(player2Ref);
            const player2Data = player2Doc.data();
            const updatedPlayer2 = {
                ...player2Data,
                goalsFor: player2Data.goalsFor += Number(player2Goals),
                goalsAgainst: player2Data.goalsAgainst += Number(player1Goals),
                goalDifference: player2Data.goalDifference += (Number(player2Goals) - Number(player1Goals)),
            };

            if (player2Goals > player1Goals) {
                updatedPlayer2.wins = player2Data.wins + 1;
                updatedPlayer2.points = player2Data.points + 3;
            } else if (player2Goals < player1Goals) {
                updatedPlayer2.losses = player2Data.losses + 1;
            } else {
                updatedPlayer2.draws = player2Data.draws + 1;
                updatedPlayer2.points = player2Data.points + 1;
            }

            await updateDoc(player2Ref, updatedPlayer2);
        } catch (error) {
            console.error("Erro ao atualizar estatísticas dos jogadores:", error);
            setError("Erro ao atualizar as estatísticas dos jogadores.");
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <>
            <Navbar />

            <div className="container mt-5 text-center">
                <h2 className="mb-4">Inserir Resultados das Partidas</h2>

                {error && <p className="text-danger">{error}</p>}

                {currentMatch ? (
                    <div className="mb-4">
                        <h3>Rodada {currentMatch.round + 1} </h3>
                        <h3>{currentMatch.player1} vs {currentMatch.player2}</h3>
                        <div className="mb-3 mt-3">
                            <label htmlFor="player1Goals" className="form-label">Gols {currentMatch.player1}: </label>
                            <div className="input-group">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => decrementGoal("player1")}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    id="player1Goals"
                                    className="form-control text-center"
                                    value={matchResults.player1Goals}
                                    onChange={(e) => handleResultChange(e.target.value, matchResults.player2Goals)}
                                />
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => incrementGoal("player1")}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="player2Goals" className="form-label">Gols {currentMatch.player2}: </label>
                            <div className="input-group">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => decrementGoal("player2")}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    id="player2Goals"
                                    className="form-control text-center"
                                    value={matchResults.player2Goals}
                                    onChange={(e) => handleResultChange(matchResults.player1Goals, e.target.value)}
                                />
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => incrementGoal("player2")}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button onClick={saveMatchResult} className="btn btn-lg btn-primary w-100 mt-2">
                            Salvar Resultado
                        </button>
                    </div>
                ) : (
                    <p>Selecione uma partida para editar.</p>
                )}

                <div className="mt-5">
                    <h3 className="mb-4">Lista de Confrontos Pendentes</h3>
                    {matches.length === 0 || (!matches.turno1 || Object.keys(matches.turno1).length === 0) && (!matches.turno2 || Object.keys(matches.turno2).length === 0) ? (
                        <p>Não há confrontos pendentes para exibir.</p>
                    ) : (
                        <>
                            {Object.keys(matches.turno1).length > 0 && (
                                <div className="mb-4">
                                    <h4 className="mb-3"><b>Turno 1</b></h4>
                                    {Object.keys(matches.turno1).map((round, index) => (
                                        <div key={index} className="mt-4">
                                            <h5>Rodada {parseInt(round) + 1}</h5>
                                            <ul className="list-group">
                                                {matches.turno1[round].map((match, i) => (
                                                    <li key={match.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {match.player1} vs {match.player2}
                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => loadMatch(i, match.turno, match.round)}
                                                        >
                                                            Editar
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {Object.keys(matches.turno2).length > 0 && (
                                <div className="mb-4">
                                    <h4 className="mb-3"><b>Turno 2</b></h4>
                                    {Object.keys(matches.turno2).map((round, index) => (
                                        <div key={index} className="mt-4">
                                            <h5>Rodada {parseInt(round) + 1}</h5>
                                            <ul className="list-group">
                                                {matches.turno2[round].map((match, i) => (
                                                    <li key={match.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {match.player1} vs {match.player2}
                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => loadMatch(i, match.turno, match.round)}
                                                        >
                                                            Editar
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default InserirResultados;
