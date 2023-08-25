import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";

interface IRoom {
  [key: string]: string[];
}

interface ISocketContext {
  username: string;
  isLoggedIn: boolean;
  login: () => void;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  createNewRoom: (newRoomName: string) => void;
  updatedRoomList: IRoom;
  handleClickRoom: (key: string) => void;
  sendMessage: (message: string) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messageList: MessageData[];
  userThatIsTyping: string;
  isTyping: boolean;
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
  updatedRoomList: {},
  handleClickRoom: () => {},
  sendMessage: () => {},
  message: "",
  setMessage: () => {},
  messageList: [],
  userThatIsTyping: "",
  isTyping: false,
};

const SocketContext = createContext<ISocketContext>(defaultValues);
export const useSocket = () => useContext(SocketContext);

const socket = io("http://localhost:3000", { autoConnect: false });

const SocketProvider = ({ children }: PropsWithChildren) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [updatedRoomList, setUpdatedRoomList] = useState<IRoom>({ "": [] });
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userThatIsTyping, setUserThatIsTyping] = useState("");

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
    socket.on("typing_status", (userId, isTyping) => {
      console.log("user:", userId);
      setUserThatIsTyping(userId);
      setIsTyping(isTyping);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("user_typing", { isTyping: !!message });
  }, [message]);

  useEffect(() => {
    console.log(updatedRoomList);
  }, [updatedRoomList]);

  // useEffect(() => {
  //   if (message.length > 0 && !isTyping) {
  //     //socket.emit("user_typing", true);
  //     setIsTyping(true);
  //   } else if (message.length === 0 && isTyping) {
  //     // socket.emit("user_typing", false);
  //     setIsTyping(false);
  //   }
  //   // setIsTyping(true);
  //   // if (message) {
  //   //   socket.emit("user_typing", isTyping);
  //   // }
  // }, [message, isTyping]);

  // useEffect(() => {
  //   if (isTyping) {
  //     socket.emit("user_typing", true);
  //   } else {
  //     socket.emit("user_typing", false);
  //   }
  // }, [isTyping]);

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
        message,
        setMessage,
        messageList,
        userThatIsTyping,
        isTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
