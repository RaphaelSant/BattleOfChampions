import React, { useEffect, useState } from "react";
import { auth, db, signOut, doc, getDoc, collection, deleteDoc, getDocs } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import Swal from "sweetalert2"; // Importando o SweetAlert
import Loading from "../assets/loading.gif";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"; // Importando updatePassword
import { BsPersonFillAdd } from "react-icons/bs";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiSearchCircle } from "react-icons/hi";
import { TbViewfinder } from "react-icons/tb";
import { GiPodiumWinner } from "react-icons/gi";

const Navbar = () => {
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const getUserData = async () => {
                const userDoc = doc(db, "usuarios", user.uid);
                const userSnap = await getDoc(userDoc);
                if (userSnap.exists()) {
                    setUserName(userSnap.data().nome);
                }
            };
            getUserData();
            // console.log(userName);
        }
    }, [userName]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Se você sair, precisará fazer login novamente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: "btn btn-lg btn-success mb-4 w-100",
                cancelButton: "btn btn-lg btn-dark w-100"
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                signOut(auth)
                    .then(() => {
                        navigate("/"); // Redireciona para a página de login
                    })
                    .catch((error) => {
                        console.error("Erro ao sair: ", error);
                    });
            } else {
                console.log("Logout cancelado");
            }
        });
    };

    const handlePasswordChange = () => {
        // Exibe o modal para alteração de senha
        Swal.fire({
            title: "Alterar Senha",
            html: `
                <input type="password" id="currentPassword" class="form-control mb-3" placeholder="Senha Atual" required>
                <input type="password" id="newPassword" class="form-control mb-3" placeholder="Nova Senha" required>
                <input type="password" id="confirmPassword" class="form-control" placeholder="Confirmar Nova Senha" required>
            `,
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Alterar",
            customClass: {
                confirmButton: "btn btn-lg btn-success w-100",
                cancelButton: "btn btn-lg btn-dark w-100",
            },
            width: '90%', // Ajusta a largura para telas menores
            padding: '1.5em',
            background: '#fff',
            preConfirm: () => {
                const currentPassword = document.getElementById("currentPassword").value;
                const newPassword = document.getElementById("newPassword").value;
                const confirmPassword = document.getElementById("confirmPassword").value;

                // Verifica se os campos estão preenchidos
                if (!currentPassword || !newPassword || !confirmPassword) {
                    Swal.showValidationMessage("Por favor, preencha todos os campos.");
                    return false;
                }

                // Verifica se a nova senha e a confirmação são iguais
                if (newPassword !== confirmPassword) {
                    Swal.showValidationMessage("As senhas não coincidem.");
                    return false;
                }

                const user = auth.currentUser;
                if (user && currentPassword) {
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);

                    return reauthenticateWithCredential(user, credential).then(() => {
                        // Atualiza a senha do usuário
                        return updatePassword(user, newPassword); // Aqui usamos a função updatePassword corretamente
                    }).catch((error) => {
                        Swal.showValidationMessage("Senha atual incorreta.");
                        throw error;
                    });
                }
                return false;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Senha Alterada!",
                    text: "Sua senha foi alterada com sucesso.",
                    icon: "success",
                    confirmButtonText: "Ok",
                    customClass: {
                        confirmButton: "btn btn-lg btn-success w-100",
                    },
                    buttonsStyling: false
                });
            }
        }).catch((error) => {
            console.error("Erro ao alterar a senha:", error);
            Swal.fire({
                title: "Erro!",
                text: "Houve um erro ao tentar alterar a senha. Tente novamente.",
                icon: "error",
                confirmButtonText: "Ok"
            });
        });
    };

    const handleResetSystem = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Tem certeza?",
            text: "Essa ação apagará todos os dados das partidas e jogadores! Não será possível reverter.",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sim, resetar!",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                swalWithBootstrapButtons.fire({
                    title: 'Aguarde',
                    text: 'Resetando o sistema...',
                    imageUrl: Loading,
                    imageWidth: 150,
                    imageHeight: 150,
                    showConfirmButton: false,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });

                const matchesSnapshot = await getDocs(collection(db, "matches"));
                const deleteMatchesPromises = matchesSnapshot.docs.map(async (docSnap) => {
                    await deleteDoc(doc(db, "matches", docSnap.id));
                });

                const playersSnapshot = await getDocs(collection(db, "players"));
                const deletePlayersPromises = playersSnapshot.docs.map(async (docSnap) => {
                    await deleteDoc(doc(db, "players", docSnap.id));
                });

                await Promise.all(deleteMatchesPromises);
                await Promise.all(deletePlayersPromises);

                await swalWithBootstrapButtons.fire({
                    title: "Sistema Resetado!",
                    text: "Todos os dados foram apagados com sucesso.",
                    icon: "success"
                });

                window.location.href = "/Home";
            } catch (error) {
                console.error("Erro ao resetar o sistema: ", error);
                await swalWithBootstrapButtons.fire({
                    title: "Erro!",
                    text: "Houve um erro ao tentar resetar o sistema. Tente novamente.",
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "Ação de reset foi cancelada.",
                icon: "error"
            });
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-gradient shadow">
            <div className="container">
                <Link className="navbar-brand" to="/Home">
                    <img src={Logo} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    BoC
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
                <div className="collapse navbar-collapse text-center" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {/* Links para Desktop */}
                        <li className="nav-item d-none d-lg-block">
                            <Link className="nav-link" to="/CadastroJogadores">
                                <BsPersonFillAdd /> Cadastro de Jogadores
                            </Link>
                        </li>
                        <li className="nav-item d-none d-lg-block">
                            <Link className="nav-link" to="/SorteioConfrontos">
                                <FaWandMagicSparkles /> Sorteio de Confrontos
                            </Link>
                        </li>
                        <li className="nav-item d-none d-lg-block">
                            <Link className="nav-link" to="/InserirResultados">
                                <TbViewfinder /> Inserir Resultados
                            </Link>
                        </li>
                        <li className="nav-item d-none d-lg-block">
                            <Link className="nav-link" to="/HistoricoPartidas">
                                <HiSearchCircle /> Histórico de Partidas
                            </Link>
                        </li>
                        <li className="nav-item d-none d-lg-block border-end">
                            <Link className="nav-link" to="/Classificacao">
                                <GiPodiumWinner /> Classificação
                            </Link>
                        </li>

                        {/* Dropdown Sistema (somente para desktop) */}
                        <li className="nav-item dropdown d-none d-lg-block">
                            <button
                                className="nav-link dropdown-toggle"
                                id="navbarDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Sistema
                            </button>
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

                        {/* Dropdown Usuários (somente para desktop) */}
                        <li className="nav-item dropdown d-none d-lg-block">
                            <button
                                className="nav-link dropdown-toggle"
                                id="navbarDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Usuarios
                            </button>
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

                        {/* Botões para Mobile */}
                        <li className="nav-item d-block d-lg-none mb-2">
                            <Link className="btn btn-outline-light w-100" to="/CadastroJogadores">
                                <BsPersonFillAdd /> Cadastro de Jogadores
                            </Link>
                        </li>
                        <li className="nav-item d-block d-lg-none mb-2">
                            <Link className="btn btn-outline-light w-100" to="/SorteioConfrontos">
                                <FaWandMagicSparkles /> Sorteio de Confrontos
                            </Link>
                        </li>
                        <li className="nav-item d-block d-lg-none mb-2">
                            <Link className="btn btn-outline-light w-100" to="/InserirResultados">
                                <TbViewfinder /> Inserir Resultados
                            </Link>
                        </li>
                        <li className="nav-item d-block d-lg-none mb-2">
                            <Link className="btn btn-outline-light w-100" to="/HistoricoPartidas">
                                <HiSearchCircle /> Histórico de Partidas
                            </Link>
                        </li>
                        <li className="nav-item d-block d-lg-none mb-2">
                            <Link className="btn btn-outline-light w-100" to="/Classificacao">
                                <GiPodiumWinner /> Classificação
                            </Link>
                        </li>

                        {/* Dropdown para mobile */}
                        <li className="nav-item dropdown d-block d-lg-none mb-2">
                            <button
                                className="btn btn-outline-light w-100 dropdown-toggle"
                                id="navbarDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Sistema
                            </button>
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

                        <li className="nav-item dropdown d-block d-lg-none mb-2">
                            <button
                                className="btn btn-outline-light w-100 dropdown-toggle"
                                id="navbarDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Usuários
                            </button>
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
