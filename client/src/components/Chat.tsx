import { useState } from "react";
import { useSocket } from "../context/socketContext";
// import RoomsList from "./RoomsList";

function Chat() {
  const { setRoom, rooms, createNewRoom, updatedRoomList } = useSocket();
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

      {updatedRoomList.map((room) => (
        <li key={room.id}>{room.name} </li>
      ))}
      {/* {updatedRoomList.map((room) => (
        <button key={room.id} onClick={() => setRoom(room.id)}>
          Gå med i {room.name}
        </button>
      ))} */}

      {rooms.map((room) => (
        <button key={room.id} onClick={() => setRoom(room.id)}>
          Gå med i {room.name}
        </button>
      ))}
      {/* <RoomsList />
      <button onClick={() => setRoom("123")}>gå med i rum 123</button>
      <button onClick={() => setRoom("456")}>Gå med i rum 456</button> */}
    </div>
  );
}

export default Chat;
