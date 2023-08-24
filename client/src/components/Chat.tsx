import { useState } from "react";
import { useSocket } from "../context/socketContext";

function Chat() {
  const {
    createNewRoom,
    updatedRoomList,
    handleClickRoom,
    sendMessage,
    messageList,
  } = useSocket();
  const [newRoomName, setNewRoomName] = useState(""); // Här sparas värdet från inputfältet
  const [message, setMessage] = useState("");

  return (
    // Gör dynamiskt, lista.
    <div>
      <div className="navBar">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={() => createNewRoom(newRoomName)}>Gå med</button>
        <h2>Rooms</h2>
        {/* {updatedRoomList.map((room, index) => (
        <li key={index}>{room} </li>
      ))} */}

        <ul>
          {Object.keys(updatedRoomList).map((key: string) => {
            const room = updatedRoomList[key];
            return (
              <li key={key} onClick={() => handleClickRoom(key)}>
                {key} {room.id}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="messageList">
        {messageList.map((messageContent, index) => {
          return (
            <div key={index}>
              <h1>{messageContent.message}</h1>
              <p>{messageContent.author}</p>
            </div>
          );
        })}
      </div>

      <div className="messageInput">
        <input type="text" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => sendMessage(message)}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
