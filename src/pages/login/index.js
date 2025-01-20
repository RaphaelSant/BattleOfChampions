import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { redirect } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Redirecionar para o próximo componente
                alert('Login com sucesso')
                window.location.href = "/CadastroJogadores";
            })
            .catch((error) => alert(error.message));
    };

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Redirecionar para o próximo componente
                alert('Login com sucesso')
            })
            .catch((error) => alert(error.message));
    };

    return (
        <div>
            <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={isSignUp ? handleSignUp : handleLogin}>
                {isSignUp ? "Sign Up" : "Login"}
            </button>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
};

export default Login;