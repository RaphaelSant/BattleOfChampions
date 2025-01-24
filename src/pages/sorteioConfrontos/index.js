import React, { useState, useEffect, useCallback } from "react";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb";
import Footer from "../../components/footer";

const SorteioConfrontos = () => {
    const [players, setPlayers] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPlayers = async () => {
        setLoading(true); // Inicia o carregamento
        try {
            const querySnapshot = await getDocs(collection(db, "players"));
            const playersList = [];
            querySnapshot.forEach((doc) => {
                playersList.push({ id: doc.id, ...doc.data() });
            });
            setPlayers(playersList);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Não foi possível carregar os jogadores. Tente novamente.",
            });
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

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

            players.splice(1, 0, players.pop());
        }

        return rounds;
    };

    const generateTurnoReturno = useCallback((players) => {
        const firstTurnRounds = generateRoundRobin(players);

        const secondTurnRounds = firstTurnRounds.map(round =>
            round.map(match => [match[1], match[0]]) // Inverte os confrontos para o segundo turno
        );

        return [...firstTurnRounds, ...secondTurnRounds];
    }, []);

    const saveMatch = async (player1, player2, roundIndex, turno) => {
        try {
            if (player1.name === "Fictício" || player2.name === "Fictício") {
                return;
            }

            await addDoc(collection(db, "matches"), {
                player1: player1.name,
                idPlayer1: player1.id,
                player2: player2.name,
                idPlayer2: player2.id,
                round: roundIndex,
                turno: turno,
                player1Goals: 0,
                player2Goals: 0,
                result: "pending",
            });
        } catch (error) {
            console.error("Erro ao salvar o confronto:", error);
        }
    };

    const checkIfMatchesExist = async () => {
        const querySnapshot = await getDocs(collection(db, "matches"));
        return !querySnapshot.empty;
    };

    const saveAllMatches = async () => {
        const matchesExist = await checkIfMatchesExist();
        if (matchesExist) {
            Swal.fire({
                icon: "warning",
                title: "Sistema já possui confrontos!",
                text: "Para salvar novos sorteios, é necessário resetar o sistema.",
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "btn btn-lg btn-warning w-100",
                },
                buttonsStyling: false,
            });
            return;
        }

        // Exibe o SweetAlert com o spinner de loading
        const loadingAlert = Swal.fire({
            title: "Salvando confrontos...",
            text: "Aguarde enquanto os confrontos estão sendo salvos.",
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        setLoading(true); // Inicia o carregamento

        let matchesSavedCount = 0;
        const totalMatches = rounds.reduce((acc, round) => acc + round.length, 0);

        const firstTurnRounds = rounds.slice(0, rounds.length / 2);
        const secondTurnRounds = rounds.slice(rounds.length / 2);

        // Salvar confrontos do primeiro turno
        for (const [roundIndex, round] of firstTurnRounds.entries()) {
            for (const match of round) {
                if (match[0].name !== "Fictício" && match[1].name !== "Fictício") {
                    await saveMatch(match[0], match[1], roundIndex, 1);
                    matchesSavedCount += 1;
                }
            }
        }

        // Salvar confrontos do segundo turno
        for (const [roundIndex, round] of secondTurnRounds.entries()) {
            for (const match of round) {
                if (match[0].name !== "Fictício" && match[1].name !== "Fictício") {
                    await saveMatch(match[0], match[1], roundIndex + firstTurnRounds.length, 2);
                    matchesSavedCount += 1;
                }
            }
        }

        setLoading(false); // Finaliza o carregamento
        loadingAlert.close(); // Fecha o SweetAlert de carregamento

        if (matchesSavedCount === totalMatches) {
            Swal.fire({
                icon: "success",
                title: "Confrontos Salvos!",
                text: "Todos os confrontos foram salvos com sucesso.",
                confirmButtonText: 'Ok!',
                customClass: {
                    confirmButton: "btn btn-lg btn-success w-100",
                },
                buttonsStyling: false,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Alguns confrontos não foram salvos.",
            });
        }
    };

    const reshuffleMatches = () => {
        const shuffledPlayers = [...players].sort(() => Math.random() - 0.5); // Embaralha os jogadores aleatoriamente
        const newRounds = generateTurnoReturno(shuffledPlayers); // Gera as novas rodadas com os jogadores embaralhados
        setRounds(newRounds); // Atualiza as rodadas
        console.log("Partidas embaralhadas novamente.");
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (players.length > 1) {
            const roundsWithTurnoReturno = generateTurnoReturno(players);
            setRounds(roundsWithTurnoReturno);
        }
    }, [players, generateTurnoReturno]);

    return (
        <>
            <Navbar />
            <div className="container mt-5 d-flex flex-column text-center" style={{ minHeight: '60vh' }}>
                
                <Breadcrumb tituloAnterior="Cad de Jogadores" linkAnterior="/CadastroJogadores" tituloProximo="Inserir Resultados" linkProximo="/InserirResultados" />
                
                <h2 className="my-4 text-success"><b>Sorteio de Confrontos</b></h2>
                
                {loading ? (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                ) : rounds.length === 0 ? (
                    <p>Não há partidas sorteadas.</p>
                ) : (
                    <div className="d-flex flex-wrap justify-content-center gap-1 text-center">
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

                <div className="mt-4 d-flex flex-column gap-3">
                    <button onClick={saveAllMatches} className="btn btn-lg btn-success me-3 w-100">
                        Salvar Todos os Confrontos
                    </button>
                    <button onClick={reshuffleMatches} className="btn btn-lg btn-dark mt-3">
                        Embaralhar Novamente
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SorteioConfrontos;
