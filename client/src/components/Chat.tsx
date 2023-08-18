import { useSocket } from "../context/socketContext";

function Chat() {
  const { setRoom } = useSocket();
  return (
    // Gör dynamiskt, lista.
    <div>
      <button onClick={() => setRoom("123")}>gå med i rum 123</button>
      <button onClick={() => setRoom("456")}>Gå med i rum 456</button>
    </div>
  );
}

export default Chat;
