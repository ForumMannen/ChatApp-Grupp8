import { useState } from "react";
import { useSocket } from "../context/socketContext";
// import RoomsList from "./RoomsList";

function Chat() {
  const { createNewRoom, updatedRoomList } = useSocket();
  const [newRoomName, setNewRoomName] = useState(""); // Här sparas värdet från inputfältet

  return (
    // Gör dynamiskt, lista.
    <div>
      <input
        type="text"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
      />
      <button onClick={() => createNewRoom(newRoomName)}>Gå med</button>
      <h2>Rooms</h2>
      {updatedRoomList.map((room) => (
        <li key={room.id}>{room.name} </li>
      ))}
    </div>
  );
}

export default Chat;
