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
};

const SocketContext = createContext<ISocketContext>(defaultValues);
export const useSocket = () => useContext(SocketContext);

const socket = io("http://localhost:3000", { autoConnect: false });

const SocketProvider = ({ children }: PropsWithChildren) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [updatedRoomList, setUpdatedRoomList] = useState([]);

  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);
    }
  }, [room]);

  useEffect(() => {
    socket.on("Updated_rooms", (updatedRooms) => {
      setUpdatedRoomList(updatedRooms);
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
