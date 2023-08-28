import { useState } from "react";
import { useSocket } from "../context/socketContext";
import { FaPaperPlane } from "react-icons/fa";

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

  return (
    <div>
      <div className="header">
        <h1>&lt;SHUT APP /&gt;</h1>
      </div>
      <div className="appContainer">
        <div className="navBar">
          <h2>ROOMS</h2>

          <div className="createRoomContainer">
            <input
              placeholder="Create room"
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
              +
            </button>
          </div>

          <div className="roomList">
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
        </div>

        <div className="chatContainer">
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
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
