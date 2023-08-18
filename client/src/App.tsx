import Chat from "./components/Chat";
import Login from "./components/Login";
import { useSocket } from "./context/socketContext";

function App() {
  const { isLoggedIn } = useSocket();

  return <div>{isLoggedIn ? <Chat /> : <Login />}</div>;
}

export default App;
