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
  rooms: { id: string; name: string }[];
  createNewRoom: (newRoomName: string) => void;
  updatedRoomList: { id: string; name: string }[];
}
0;
const defaultValues = {
  username: "",
  isLoggedIn: false,
  login: () => {},
  setUsername: () => {},
  room: "",
  setRoom: () => {},
  rooms: [],
  createNewRoom: () => {},
  updatedRoomList: [],
};

const SocketContext = createContext<ISocketContext>(defaultValues);
export const useSocket = () => useContext(SocketContext);

const socket = io("http://localhost:3000", { autoConnect: false });

const SocketProvider = ({ children }: PropsWithChildren) => {
  // const roomsList = [{ id: "lobby", name: "lobby"}];
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [updatedRoomList, setUpdatedRoomList] = useState([]);
  //  roomsList.push(room);
  const rooms = [
    { id: "123", name: "Rum 123" },
    { id: "456", name: "Rum 456" },
    { id: "789", name: "Rum 789" },
  ];

  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);
    }
  }, [room]);

  const login = () => {
    socket.connect();
    setIsLoggedIn(true);
    setRoom("lobby");
  };

  const createNewRoom = (newRoomName: string) => {
    const newRoom = { id: socket.id, name: newRoomName };
    setRoom(newRoom); // Byt till det nya rummet
    // rooms.push(newRoom); // Lägg till det nya rummet i listan
    const updatedRooms = [...rooms, newRoom];
    setUpdatedRoomList(updatedRooms);
    console.log("Nytt rum skapat:", newRoom);
    console.log("här är listan på rooms ", updatedRooms);
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
        rooms,
        createNewRoom,
        updatedRoomList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
