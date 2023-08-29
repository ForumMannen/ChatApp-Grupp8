import { useEffect, useRef, useState } from "react";
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
    room,
    username,
  } = useSocket();
  const [newRoomName, setNewRoomName] = useState(""); // Här sparas värdet från inputfältet

  ///gör detta i socketContext!!!!!!!!!!
  const messageListRef = useRef(null);

  useEffect(() => {
    // Scrollar alltid till botten när nytt innehåll läggs till
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messageList]);
  //////////////////
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
                const isRoomActive = room === key;
                return (
                  <li
                    key={key}
                    className={isRoomActive ? "activeRoom" : ""}
                    onClick={() => handleClickRoom(key)}
                  >
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
          <div className="roomname">
            <h2>{room}</h2>
          </div>
          <div className="messageListContainer" ref={messageListRef}>
            <div className="messageList">
              {messageList.map((messageContent, index) => {
                return (
                  <div
                    // id={username === messageContent.author ? "you" : "other"}
                    key={index}
                  >
                    {messageContent.message.includes("giphy.com/media") ? (
                      <div>
                        <img src={messageContent.message} alt="Random gif" />
                      </div>
                    ) : (
                      <h1>{messageContent.message}</h1>
                    )}

                    <p>{messageContent.author}</p>
                  </div>
                );
              })}
              <div className="isTypingContainer">
                {userThatIsTyping && isTyping ? (
                  <div className="isTyping">
                    <p>{userThatIsTyping} is typing...</p>
                  </div>
                ) : null}
              </div>
            </div>
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
