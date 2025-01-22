import React, { useEffect, useState } from "react";
import { auth, db, signOut, doc, getDoc, collection, deleteDoc, getDocs } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import Swal from "sweetalert2"; // Importando o SweetAlert

const Navbar = () => {
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar se o usuário está autenticado e pegar o nome do usuário da coleção "usuarios"
        const user = auth.currentUser;
        if (user) {
            const getUserData = async () => {
                const userDoc = doc(db, "usuarios", user.uid);
                const userSnap = await getDoc(userDoc);
                if (userSnap.exists()) {
                    setUserName(userSnap.data().nome); // Supondo que o nome esteja na coleção de usuários
                    setUserEmail(user.email); // Pegando o email do usuário
                }
            };
            getUserData();
        }
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate("/"); // Redireciona para a página de login
            })
            .catch((error) => {
                console.error("Erro ao sair: ", error);
            });
    };

    const handlePasswordChange = () => {
        // Aqui você pode implementar a lógica para alterar a senha, talvez com o método `sendPasswordResetEmail` do Firebase
        if (userEmail) {
            auth.sendPasswordResetEmail(userEmail)
                .then(() => {
                    alert("Email para redefinir senha enviado.");
                })
                .catch((error) => {
                    console.error("Erro ao enviar email de redefinição: ", error);
                });
        }
    };

    const handleResetSystem = async () => {
        // Mostra o SweetAlert para confirmar a ação
        const result = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa ação apagará todos os dados das partidas e jogadores! Não será possível reverter.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, resetar!",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                // Deleta todos os documentos da coleção "matches"
                const matchesSnapshot = await getDocs(collection(db, "matches"));
                matchesSnapshot.forEach(async (docSnap) => {
                    await deleteDoc(doc(db, "matches", docSnap.id));
                });

                // Deleta todos os documentos da coleção "players"
                const playersSnapshot = await getDocs(collection(db, "players"));
                playersSnapshot.forEach(async (docSnap) => {
                    await deleteDoc(doc(db, "players", docSnap.id));
                });

                // Sucesso ao resetar o sistema
                await Swal.fire({
                    title: "Sistema Resetado!",
                    text: "Todos os dados foram apagados com sucesso.",
                    icon: "success",
                });
            } catch (error) {
                console.error("Erro ao resetar o sistema: ", error);
                await Swal.fire({
                    title: "Erro!",
                    text: "Houve um erro ao tentar resetar o sistema. Tente novamente.",
                    icon: "error",
                });
            }
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                {/* Link com a logo e o nome */}
                <Link className="navbar-brand" to="/Home">
                    <img src={Logo} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    Battle of Champions
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/CadastroJogadores">
                                Cadastro de Jogadores
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/SorteioConfrontos">
                                Sorteio de Confrontos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/InserirResultados">
                                Inserir Resultados
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/HistoricoPartidas">
                                Histórico de Partidas
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Classificacao">
                                Classificação
                            </Link>
                        </li>

                        {/* Dropdown Sistema */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdownSistema"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Sistema
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownSistema">
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleResetSystem}
                                    >
                                        Resetar Sistema
                                    </button>
                                </li>
                            </ul>
                        </li>

                        {/* Dropdown Usuários */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Usuários
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <button className="dropdown-item" onClick={handlePasswordChange}>
                                        Alterar Senha
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        Sair
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
