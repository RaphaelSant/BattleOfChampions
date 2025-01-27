import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2"; // Importando o SweetAlert2
import Logo from "../../components/assets/logo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Adiciona o estado de loading

    const handleLogin = () => {
        setLoading(true); // Inicia o loading ao clicar no botão
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Exibe o SweetAlert2 de sucesso
                Swal.fire({
                    title: 'Login realizado com sucesso!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = "/Home";
                });
            })
            .catch((error) => {
                // Exibe o SweetAlert2 de erro
                Swal.fire({
                    title: 'Erro ao realizar login',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Tentar novamente'
                });
            })
            .finally(() => {
                setLoading(false); // Finaliza o loading após a requisição
            });
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
            style={{
                backgroundImage: 'url(https://images4.alphacoders.com/269/269998.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div
                className="input-group-lg col-10 col-sm-8 col-md-6 col-lg-4 p-4 border w-100 rounded shadow-lg position-relative"
                style={{
                    zIndex: 1, // Garante que o conteúdo fique acima do efeito glass
                    maxWidth: '450px', // Limita a largura máxima do container
                }}
            >
                {/* Camada de fundo com efeito glass */}
                <div
                    className="position-absolute top-0 bottom-0 start-0 end-0 rounded-3"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.14)', // Fundo leve para o efeito de vidro
                        backdropFilter: 'blur(5px)', // Efeito de desfoque no fundo
                        zIndex: -1, // Coloca o fundo atrás do conteúdo
                    }}
                ></div>

                {/* Logo */}
                <div className="text-center mb-4">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxWidth: '150px' }}
                    />
                </div>

                {/* Título Login */}
                <h2 className="text-center mb-4 text-light">Login</h2>

                {/* Formulário */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="form-control mb-3"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo levemente opaco
                        borderRadius: '8px', // Bordas arredondadas
                    }}
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="form-control mb-3"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo levemente opaco
                        borderRadius: '8px', // Bordas arredondadas
                    }}
                />

                <button
                    onClick={handleLogin}
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading} // Desabilita o botão enquanto está carregando
                    style={{
                        borderRadius: '8px', // Bordas arredondadas para o botão
                    }}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        "Login"
                    )}
                </button>
            </div>
        </div>


    );
};

export default Login;
