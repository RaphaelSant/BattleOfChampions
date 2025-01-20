import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, deleteDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";

const CadastroJogadores = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [players, setPlayers] = useState([]); // Estado para armazenar os jogadores cadastrados

    // Função para salvar o jogador no Firestore
    const savePlayer = async (name) => {
        if (!name.trim()) {
            setError("O nome do jogador é obrigatório!");
            return;
        }

        // Gerar um ID único para cada jogador
        const userId = name.toLowerCase().replace(/\s+/g, "_") + "_" + new Date().toISOString();
        const playerData = {
            name: name.toUpperCase(),
            wins: 0,
            losses: 0,
            draws: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
        };

        try {
            const playerRef = doc(db, "players", userId);
            await setDoc(playerRef, playerData);
            alert("Jogador cadastrado com sucesso!");
            setName(""); // Limpar o campo do nome após o cadastro
            setError(""); // Limpar erro
            fetchPlayers(); // Atualizar a lista de jogadores
        } catch (error) {
            console.error("Erro ao cadastrar jogador:", error);
            setError("Erro ao cadastrar o jogador. Tente novamente.");
        }
    };

    // Função para excluir o jogador
    const deletePlayer = async (userId) => {
        try {
            const playerRef = doc(db, "players", userId);
            await deleteDoc(playerRef);
            alert("Jogador excluído com sucesso!");
            fetchPlayers(); // Atualizar a lista de jogadores
        } catch (error) {
            console.error("Erro ao excluir jogador:", error);
            setError("Erro ao excluir o jogador. Tente novamente.");
        }
    };

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

    // Carregar os jogadores quando o componente for montado
    useEffect(() => {
        fetchPlayers();
    }, []);

    return (
        <>
            <Navbar />

            <div className="container mt-5">
                <h1 className="mb-4">Cadastro de Jogadores</h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        savePlayer(name);
                    }}
                    className="mb-4"
                >
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Nome do Jogador:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do jogador"
                            required
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary">Cadastrar Jogador</button>
                </form>

                <h2 className="mb-4">Jogadores Cadastrados</h2>
                {players.length === 0 ? (
                    <p>Nenhum jogador cadastrado.</p>
                ) : (
                    <ul className="list-group">
                        {players.map((player) => (
                            <li key={player.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {player.name}
                                <button
                                    onClick={() => deletePlayer(player.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-3">
                    <Link to="/SorteioConfrontos" className="btn btn-link">Sorteio</Link>
                </div>
            </div>
        </>
    );
};

export default CadastroJogadores;
