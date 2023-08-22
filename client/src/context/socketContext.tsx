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
  roomList: { id: string; name: string }[];
  createNewRoom: (newRoomName: string) => void;
  updatedRoomList: { id: string; name: string }[];
}

const defaultValues = {
  username: "",
  isLoggedIn: false,
  login: () => {},
  setUsername: () => {},
  room: "",
  setRoom: () => {},
  roomList: [],
  createNewRoom: () => {},
  updatedRoomList: [],
};

const SocketContext = createContext<ISocketContext>(defaultValues);
export const useSocket = () => useContext(SocketContext);

const socket = io("http://localhost:3000", { autoConnect: false });

const SocketProvider = ({ children }: PropsWithChildren) => {
  const roomList = [{ id: "lobby", name: "Lobby" }];
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [updatedRoomList, setUpdatedRoomList] = useState(roomList);

  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);
    }
  }, [room]);

  // useEffect(() => {
  //   socket.on("New_room_is_added_to_list", (updatedRooms) => {
  //     setUpdatedRoomList(updatedRooms);
  //   });
  // }, [updatedRoomList]);

  const login = () => {
    socket.connect();
    setIsLoggedIn(true);
    setRoom(roomList[0].id);
  };

  const createNewRoom = (newRoomName: string) => {
    const newRoom = { id: newRoomName, name: newRoomName };
    setRoom(newRoom);
    const updatedRooms = [...updatedRoomList, newRoom];
    setUpdatedRoomList(updatedRooms);
    // socket.emit("create_new_room", newRoom);

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
        roomList,
        createNewRoom,
        updatedRoomList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
