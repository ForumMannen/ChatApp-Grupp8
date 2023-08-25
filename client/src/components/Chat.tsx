import { useState } from "react";
import { useSocket } from "../context/socketContext";
// import { io } from "socket.io-client";

function Chat() {
  const {
    createNewRoom,
    updatedRoomList,
    handleClickRoom,
    sendMessage,
    messageList,
    message,
    setMessage,
    userThatIsTyping,
    isTyping,
  } = useSocket();
  const [newRoomName, setNewRoomName] = useState(""); // Här sparas värdet från inputfältet

  // const [message, setMessage] = useState("");

  //   const handleInputChange = () => {

  //   }

  // useEffect(() => {

  // },[message])

  return (
    // Gör dynamiskt, lista.
    <div>
      <div className="navBar">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button
          onClick={() => {
            createNewRoom(newRoomName);
            setNewRoomName("");
          }}
        >
          Gå med
        </button>
        <h2>Rooms</h2>
        {/* {updatedRoomList.map((room, index) => (
        <li key={index}>{room} </li>
      ))} */}

        <ul>
          {Object.keys(updatedRoomList).map((key: string) => {
            const usersInRoom = updatedRoomList[key];
            return (
              <li key={key} onClick={() => handleClickRoom(key)}>
                {key}{" "}
                {usersInRoom.map((user: string) => (
                  <p key={user}>{user}</p>
                ))}
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
        {userThatIsTyping && isTyping ? (
          <div>
            <p>{userThatIsTyping} is typing</p>
          </div>
        ) : null}
      </div>

      <div className="messageInput">
        <input
          value={message}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => {
            sendMessage(message);
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
