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
            style={{ backgroundImage: 'url(https://images4.alphacoders.com/269/269998.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="col-md-4 col-lg-3 col-sm-6 p-4 border rounded shadow bg-white">
                {/* Logo */}
                <div className="text-center mb-4">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxWidth: '150px' }}
                    />
                </div>

                {/* Formulário */}
                <h2 className="text-center mb-4">Login</h2>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="form-control mb-3"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="form-control mb-3"
                />

                <button
                    onClick={handleLogin}
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading} // Desabilita o botão enquanto está carregando
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
