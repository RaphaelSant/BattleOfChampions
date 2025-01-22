import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Logo from "../../components/assets/logo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Redirecionar para o próximo componente
                alert('Login com sucesso')
                window.location.href = "/CadastroJogadores";
            })
            .catch((error) => alert(error.message));
    };

    /*
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Redirecionar para o próximo componente
                alert('Login com sucesso')
            })
            .catch((error) => alert(error.message));
    }; */

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
                {
                <button
                    onClick={handleLogin}
                    className="btn btn-primary w-100 mb-3"
                >
                    Login
                </button>

                /* 
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="btn btn-link w-100"
                >
                    {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </button>
                */}
            </div>
        </div>


    );
};

export default Login;