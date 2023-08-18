import { useSocket } from "../context/socketContext";

function Login() {
  const { login, username, setUsername } = useSocket();
  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={login}>Börja Chatta</button>
    </div>
  );
}

export default Login;
