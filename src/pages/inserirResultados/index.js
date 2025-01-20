import React, { useState, useEffect } from "react";
import { doc, getDocs, updateDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const InserirResultados = () => {
    const [matches, setMatches] = useState([]);
    const [matchResults, setMatchResults] = useState({ player1Goals: 0, player2Goals: 0 }); // Inicializando com valores
    const [currentMatch, setCurrentMatch] = useState(null);
    const [error, setError] = useState("");

    const fetchMatches = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "matches"));
            const matchesList = [];
            querySnapshot.forEach((doc) => {
                matchesList.push({ id: doc.id, ...doc.data() });
            });
            const pendingMatches = matchesList
                .filter((match) => match.result === "pending")
                .sort((a, b) => a.round - b.round); // Ordena pela menor rodada

            setMatches(pendingMatches);
        } catch (error) {
            console.error("Erro ao buscar confrontos:", error);
            setError("Erro ao carregar os confrontos. Tente novamente.");
        }
    };

    const loadMatch = (index) => {
        const match = matches[index];
        setCurrentMatch(match);
        // Inicializar os resultados de gols para a partida selecionada
        setMatchResults({
            player1Goals: match.player1Goals || 0,
            player2Goals: match.player2Goals || 0,
        });
    };

    const handleResultChange = (player1Goals, player2Goals) => {
        setMatchResults({
            player1Goals: player1Goals || 0, // Garantir que os gols sejam números válidos
            player2Goals: player2Goals || 0,
        });
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

    const saveMatchResult = async () => {
        if (currentMatch) {
            console.log(currentMatch)

            try {
                // Atualizar o confronto no Firestore
                const matchRef = doc(db, "matches", currentMatch.id);
                const result = matchResults.player1Goals === matchResults.player2Goals
                    ? "draw"
                    : matchResults.player1Goals > matchResults.player2Goals
                        ? "win"
                        : "loss";

                await updateDoc(matchRef, {
                    player1Goals: matchResults.player1Goals,
                    player2Goals: matchResults.player2Goals,
                    result: result, // Atualiza o resultado (win, loss, draw)
                });

                // Atualizar as estatísticas dos jogadores
                await updatePlayerStats(currentMatch.idPlayer1, currentMatch.idPlayer2, matchResults.player1Goals, matchResults.player2Goals);

                // Exibir alerta e recarregar partidas pendentes
                alert("Resultado da partida salvo com sucesso!");
                setCurrentMatch(null);  // Limpa a partida selecionada após salvar
                fetchMatches(); // Recarregar os confrontos pendentes

            } catch (error) {
                console.error("Erro ao salvar resultado:", error);
                setError("Erro ao salvar o resultado da partida. Tente novamente.");
            }
        }
    };


    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <div>
            <h2>Inserir Resultados das Partidas</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {currentMatch ? (
                <div>
                    <h3>Rodada {currentMatch.round} - {currentMatch.player1} vs {currentMatch.player2}</h3>
                    <div>
                        <label>Gols {currentMatch.player1}: </label>
                        <input
                            type="number"
                            value={matchResults.player1Goals}
                            onChange={(e) =>
                                handleResultChange(e.target.value, matchResults.player2Goals)
                            }
                        />
                    </div>
                    <div>
                        <label>Gols {currentMatch.player2}: </label>
                        <input
                            type="number"
                            value={matchResults.player2Goals}
                            onChange={(e) =>
                                handleResultChange(matchResults.player1Goals, e.target.value)
                            }
                        />
                    </div>
                    <button onClick={saveMatchResult}>Salvar Resultado</button>
                </div>
            ) : (
                <p>Selecione uma partida para editar.</p>
            )}

            <div>
                <h3>Lista de Confrontos Pendentes</h3>
                {matches.length === 0 ? (
                    <p>Não há confrontos pendentes para exibir.</p>
                ) : (
                    <ul>
                        {matches.map((match, index) => (
                            <li key={match.id}>
                                <p>Rodada {match.round + 1}: {match.player1} vs {match.player2}</p>
                                <button onClick={() => loadMatch(index)}>Editar</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default InserirResultados;
