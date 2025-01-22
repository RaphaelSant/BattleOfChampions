import React, { useState, useEffect } from "react";
import { getDocs, deleteDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";
import Swal from "sweetalert2";

const SorteioConfrontos = () => {
    const [error, setError] = useState("");
    const [players, setPlayers] = useState([]); // Estado para armazenar os jogadores cadastrados
    const [rounds, setRounds] = useState([]); // Estado para armazenar as rodadas com partidas
    const [matchResults, setMatchResults] = useState({}); // Estado para armazenar os placares dos jogos
    const [allMatchesSaved, setAllMatchesSaved] = useState(false); // Estado para controlar se todos os confrontos foram salvos
    const [loading, setLoading] = useState(false); // Controle de carregamento

    // Função para buscar jogadores do Firestore
    const fetchPlayers = async () => {
        setLoading(true); // Inicia o spinner enquanto busca os jogadores
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
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Não foi possível carregar os jogadores. Tente novamente.",
            });
        } finally {
            setLoading(false); // Finaliza o spinner
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
            round.map(match => [match[1], match[0]]) // Inverte os confrontos para o segundo turno
        );

        return [...firstTurnRounds, ...secondTurnRounds];
    };

    // Função para embaralhar as rodadas
    const reshuffleMatches = () => {
        // Embaralha a ordem dos jogadores e gera novas rodadas
        const shuffledPlayers = [...players].sort(() => Math.random() - 0.5); // Embaralha os jogadores aleatoriamente
        const newRounds = generateTurnoReturno(shuffledPlayers); // Gera as novas rodadas com os jogadores embaralhados
        setRounds(newRounds); // Atualiza as rodadas
        console.log("Partidas embaralhadas novamente.");
    };

    // Função para salvar os confrontos no Firebase
    const saveMatch = async (player1, player2, roundIndex, turno) => {
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
                turno: turno, // Armazena o turno (1 ou 2)
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
        setLoading(true); // Inicia o spinner enquanto os confrontos são salvos
        let matchesSavedCount = 0;
        const totalMatches = rounds.reduce((acc, round) => acc + round.length, 0); // Total de confrontos a serem salvos
        let validMatchesCount = 0; // Contador para confrontos válidos

        console.log(`Total de confrontos a serem salvos: ${totalMatches}`);

        // Divida as rodadas em dois turnos
        const firstTurnRounds = rounds.slice(0, rounds.length / 2);
        const secondTurnRounds = rounds.slice(rounds.length / 2);

        // Salvar confrontos do primeiro turno
        for (const [roundIndex, round] of firstTurnRounds.entries()) {
            for (const match of round) {
                if (match[0].name !== "Fictício" && match[1].name !== "Fictício") {
                    console.log(`Salvando confronto: ${match[0].name} vs ${match[1].name} (Rodada ${roundIndex + 1})`);
                    await saveMatch(match[0], match[1], roundIndex, 1); // Passa 1 para indicar que é do primeiro turno
                    matchesSavedCount += 1;
                    validMatchesCount += 1; // Incrementa o contador de confrontos válidos
                } else {
                    console.log(`Ignorando confronto com jogador fictício: ${match[0].name} vs ${match[1].name}`);
                }
            }
        }

        // Salvar confrontos do segundo turno
        for (const [roundIndex, round] of secondTurnRounds.entries()) {
            for (const match of round) {
                if (match[0].name !== "Fictício" && match[1].name !== "Fictício") {
                    console.log(`Salvando confronto: ${match[0].name} vs ${match[1].name} (Rodada ${roundIndex + 1})`);
                    await saveMatch(match[0], match[1], roundIndex + firstTurnRounds.length, 2); // Passa 2 para indicar que é do segundo turno
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
        setLoading(false); // Finaliza o spinner

        if (matchesSavedCount === validMatchesCount) {
            setAllMatchesSaved(true);
            console.log("Todos os confrontos válidos foram salvos.");
            Swal.fire({
                icon: "success",
                title: "Confrontos Salvos!",
                text: "Todos os confrontos foram salvos com sucesso.",
            });
        } else {
            console.log("Alguns confrontos não foram salvos.");
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Alguns confrontos não foram salvos.",
            });
        }
    };

    /*
    // Função para apagar todos os confrontos da coleção com confirmação
    const deleteAllMatches = async () => {
        // Exibe o SweetAlert de confirmação
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você deseja apagar todos os confrontos?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, apagar!',
            cancelButtonText: 'Não, cancelar',
            reverseButtons: true, // Faz com que o botão "Cancelar" fique à esquerda
        });

        if (result.isConfirmed) {
            // Se o usuário confirmar a exclusão
            setLoading(true); // Inicia o spinner enquanto os confrontos são apagados
            try {
                const querySnapshot = await getDocs(collection(db, "matches"));
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref); // Apaga os confrontos
                });
                setLoading(false); // Finaliza o spinner
                Swal.fire({
                    icon: "success",
                    title: "Confrontos Apagados!",
                    text: "Todos os confrontos foram apagados com sucesso.",
                });
            } catch (error) {
                console.error("Erro ao apagar todos os confrontos:", error);
                setLoading(false); // Finaliza o spinner
                Swal.fire({
                    icon: "error",
                    title: "Erro!",
                    text: "Erro ao apagar os confrontos. Tente novamente.",
                });
            }
        } else {
            // Se o usuário cancelar a ação
            console.log("Ação de apagar confrontos foi cancelada.");
        }
    };
    */

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
        <>
            <Navbar />

            <div className="container mt-5 text-center">
                <h2 className="mb-4">Partidas Sorteadas</h2>

                {loading ? (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                ) : rounds.length === 0 ? (
                    <p>Não há partidas sorteadas.</p>
                ) : (
                    <div className="d-flex flex-wrap justify-content-center gap-1 text-center">
                        {/* Exibindo Turno 1 e Turno 2 lado a lado */}
                        <div className="w-48">
                            <h3 className="mb-4"><b>Turno 1</b></h3>
                            {rounds.slice(0, rounds.length / 2).map((round, index) => (
                                <div key={index} className="mb-4">
                                    <h4>Rodada {index + 1}</h4>
                                    <ul className="list-group">
                                        {round.map((match, i) => (
                                            <li key={i} className="list-group-item">
                                                {match[0].name} vs {match[1].name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="w-48">
                            <h3 className="mb-4"><b>Turno 2</b></h3>
                            {rounds.slice(rounds.length / 2).map((round, index) => (
                                <div key={index} className="mb-4">
                                    <h4>Rodada {index + 1}</h4>
                                    <ul className="list-group">
                                        {round.map((match, i) => (
                                            <li key={i} className="list-group-item">
                                                {match[0].name} vs {match[1].name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botões para salvar e apagar confrontos */}
                <div className="mt-4 d-flex flex-column gap-3">
                    <button onClick={saveAllMatches} className="btn btn-lg btn-primary me-3 w-100">
                        Salvar Todos os Confrontos
                    </button>
                    {/* Novo botão para embaralhar as partidas */}
                    <button onClick={reshuffleMatches} className="btn btn-lg btn-secondary mt-3">
                        Embaralhar Novamente
                    </button>
                </div>
            </div>
        </>
    );
};

export default SorteioConfrontos;
