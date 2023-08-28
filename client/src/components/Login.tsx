import { useSocket } from "../context/socketContext";

function Login() {
  const { login, username, setUsername } = useSocket();
  return (
    <div className="loginContainer">
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={login}>GET STARTED</button>
      </div>
    </div>
  );
}

export default Login;
