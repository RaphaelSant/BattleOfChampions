import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, deleteDoc, collection, updateDoc, addDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const SorteioConfrontos = () => {
    const [error, setError] = useState("");
    const [players, setPlayers] = useState([]); // Estado para armazenar os jogadores cadastrados
    const [rounds, setRounds] = useState([]); // Estado para armazenar as rodadas com partidas
    const [matchResults, setMatchResults] = useState({}); // Estado para armazenar os placares dos jogos
    const [allMatchesSaved, setAllMatchesSaved] = useState(false); // Estado para controlar se todos os confrontos foram salvos

    // Função para buscar jogadores do Firestore
    const fetchPlayers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "players"));
            const playersList = [];
            querySnapshot.forEach((doc) => {
                playersList.push({ id: doc.id, ...doc.data() });
            });
            setPlayers(playersList); // Atualiza a lista de jogadores
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
            setError("Erro ao carregar os jogadores. Tente novamente.");
        }
    };

    // Função para gerar as rodadas (todos contra todos)
    const generateRoundRobin = (players) => {
        const numPlayers = players.length;

        if (numPlayers % 2 === 1) {
            players.push({ id: "fictitious", name: "Fictício" });
        }

        const rounds = [];
        const half = players.length / 2;

        let round = [];
        for (let i = 0; i < players.length - 1; i++) {
            round = [];
            for (let j = 0; j < half; j++) {
                const player1 = players[j];
                const player2 = players[players.length - 1 - j];

                round.push([player1, player2]);
            }
            rounds.push(round);

            players.splice(1, 0, players.pop()); // Rotaciona os jogadores
        }

        return rounds;
    };

    // Função para criar Turno e Returno
    const generateTurnoReturno = (players) => {
        const firstTurnRounds = generateRoundRobin(players);

        const secondTurnRounds = firstTurnRounds.map(round =>
            round.map(match => [match[1], match[0]])
        );

        return [...firstTurnRounds, ...secondTurnRounds];
    };

    // Função para salvar os confrontos no Firebase
    const saveMatch = async (player1, player2, roundIndex) => {
        try {
            // Verificar se algum dos jogadores é fictício e não salvar esse confronto
            if (player1.name === "Fictício" || player2.name === "Fictício") {
                console.log("Ignorando confronto com jogador fictício");
                return; // Não salvar o confronto
            }

            // Cria um documento para o confronto no Firebase
            const matchRef = await addDoc(collection(db, "matches"), {
                player1: player1.name,
                idPlayer1: player1.id,
                player2: player2.name,
                idPlayer2: player2.id,
                round: roundIndex,
                player1Goals: 0,
                player2Goals: 0,
                result: "pending", // Inicialmente o resultado é "pendente"
            });
            console.log("Confronto salvo no Firebase:", matchRef.id);
        } catch (error) {
            console.error("Erro ao salvar o confronto:", error);
        }
    };

    // Função para salvar todos os confrontos gerados
    const saveAllMatches = async () => {
        let matchesSavedCount = 0;
        const totalMatches = rounds.reduce((acc, round) => acc + round.length, 0); // Total de confrontos a serem salvos
        let validMatchesCount = 0; // Contador para confrontos válidos

        console.log(`Total de confrontos a serem salvos: ${totalMatches}`);

        for (const [roundIndex, round] of rounds.entries()) {
            for (const match of round) {
                // Apenas salva os confrontos válidos
                if (match[0].name !== "Fictício" && match[1].name !== "Fictício") {
                    console.log(`Salvando confronto: ${match[0].name} vs ${match[1].name} (Rodada ${roundIndex + 1})`);
                    await saveMatch(match[0], match[1], roundIndex);
                    matchesSavedCount += 1;
                    validMatchesCount += 1; // Incrementa o contador de confrontos válidos
                } else {
                    console.log(`Ignorando confronto com jogador fictício: ${match[0].name} vs ${match[1].name}`);
                }
            }
        }

        // Verificando o contador de confrontos salvos e válidos
        console.log(`Confrontos válidos salvos: ${matchesSavedCount}`);
        console.log(`Confrontos válidos totais: ${validMatchesCount}`);

        // Quando todos os confrontos válidos forem salvos, dispara o alerta
        if (matchesSavedCount === validMatchesCount) {
            setAllMatchesSaved(true);
            console.log("Todos os confrontos válidos foram salvos.");
            alert("Todos os confrontos foram salvos com sucesso!");
        } else {
            console.log("Alguns confrontos não foram salvos.");
        }
    };



    // Função para apagar todos os confrontos da coleção
    const deleteAllMatches = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "matches"));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            alert("Todos os confrontos foram apagados com sucesso!");
        } catch (error) {
            console.error("Erro ao apagar todos os confrontos:", error);
            alert("Erro ao apagar os confrontos. Tente novamente.");
        }
    };

    // Carregar os jogadores e gerar as partidas quando o componente for montado
    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (players.length > 1) {
            const roundsWithTurnoReturno = generateTurnoReturno(players);
            setRounds(roundsWithTurnoReturno); // Atualiza as rodadas com turno e returno
        }
    }, [players]);

    return (
        <div>
            <h2>Partidas Sorteadas</h2>
            {rounds.length === 0 ? (
                <p>Não há partidas sorteadas.</p>
            ) : (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Exibindo Turno 1 e Turno 2 lado a lado */}
                    <div style={{ width: "48%" }}>
                        <h3>Turno 1</h3>
                        {rounds.slice(0, rounds.length / 2).map((round, index) => (
                            <div key={index}>
                                <h4>Rodada {index + 1}</h4>
                                <ul>
                                    {round.map((match, i) => (
                                        <li key={i}>
                                            {match[0].name} vs {match[1].name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div style={{ width: "48%" }}>
                        <h3>Turno 2</h3>
                        {rounds.slice(rounds.length / 2).map((round, index) => (
                            <div key={index}>
                                <h4>Rodada {index + 1}</h4>
                                <ul>
                                    {round.map((match, i) => (
                                        <li key={i}>
                                            {match[0].name} vs {match[1].name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Botão para salvar todos os confrontos de uma vez */}
            <button onClick={saveAllMatches} style={{ marginTop: "20px" }}>
                Salvar Todos os Confrontos
            </button>

            {/* Botão para apagar todos os confrontos */}
            <button onClick={deleteAllMatches} style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}>
                Apagar Todos os Confrontos
            </button>
        </div>
    );
};

export default SorteioConfrontos;
