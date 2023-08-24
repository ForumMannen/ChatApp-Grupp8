import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";

interface ISocketContext {
  username: string;
  isLoggedIn: boolean;
  login: () => void;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  createNewRoom: (newRoomName: string) => void;
  updatedRoomList: string[];
  handleClickRoom: (key: string) => void;
  sendMessage: (message: string) => void;
  messageList: MessageData[];
}

interface MessageData {
  room: string;
  author: string;
  message: string;
}

const defaultValues = {
  username: "",
  isLoggedIn: false,
  login: () => {},
  setUsername: () => {},
  room: "",
  setRoom: () => {},
  createNewRoom: () => {},
  updatedRoomList: [],
  handleClickRoom: () => {},
  sendMessage: () => {},
  messageList: [],
};

const SocketContext = createContext<ISocketContext>(defaultValues);
export const useSocket = () => useContext(SocketContext);

const socket = io("http://localhost:3000", { autoConnect: false });

const SocketProvider = ({ children }: PropsWithChildren) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [updatedRoomList, setUpdatedRoomList] = useState<string[]>([]);
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);
    }
  }, [room]);

  useEffect(() => {
    socket.on("Updated_rooms", (updatedRooms) => {
      setUpdatedRoomList(updatedRooms);
    });
    socket.on("incoming_message", (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const login = () => {
    socket.connect();
    setIsLoggedIn(true);
    setRoom("Lobby");
  };

  const createNewRoom = (newRoomName: string) => {
    setRoom(newRoomName);
  };

  const handleClickRoom = (key: string) => {
    console.log("jag har klickat:", key);
    setRoom(key);
  };

  const sendMessage = async (message: string) => {
    if (message !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        username,
        isLoggedIn,
        login,
        setUsername,
        room,
        setRoom,
        createNewRoom,
        updatedRoomList,
        handleClickRoom,
        sendMessage,
        messageList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
