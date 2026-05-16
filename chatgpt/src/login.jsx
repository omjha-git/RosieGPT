import "./login.css";
import { useState, useContext } from "react";
import { MyContext } from "./MyContext.jsx";

function Login() {
  const { setUser } = useContext(MyContext);

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (isSignup && !name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    const url = isSignup
      ? "http://localhost:8080/api/auth/signup"
      : "http://localhost:8080/api/auth/login";

    const body = isSignup
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.user) {
        localStorage.setItem("rosieUser", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      alert("Backend not connected");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  };

  return (
    <div className="loginPage">
      <div className="loginBox">
        <h1>RosieGPT 🌹</h1>

        <h2>{isSignup ? "Create Account" : "Login"}</h2>

        {isSignup && (
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleEnter}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEnter}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleEnter}
        />

        <button onClick={handleAuth}>
          {isSignup ? "Signup" : "Login"}
        </button>

        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "New user? Create account"}
        </p>
      </div>
    </div>
  );
}

export default Login;