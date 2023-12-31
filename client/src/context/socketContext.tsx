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
  time: string;
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
      setMessageList([]);
      socket.emit("join_room", room, username);
    }
  }, [room]);

  useEffect(() => {
    socket.on("Updated_rooms", (updatedRooms) => {
      setUpdatedRoomList(updatedRooms);
      setUserThatIsTyping("");
      setIsTyping(false);
    });
    socket.on("incoming_message", (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    });
    socket.on("typing_status", (isTyping, username) => {
      setUserThatIsTyping(username);
      setIsTyping(isTyping);
    });

    socket.on("user_disconnected", () => {
      setUserThatIsTyping("");
      setIsTyping(false);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("user_typing", { isTyping: !!message, username: username });
    if (message === "/gif") {
      gifFunction();
      socket.emit("user_typing", { isTyping: !!message, username: username });
    }
  }, [message]);

  const gifFunction = async () => {
    try {
      const apiKey = import.meta.env.VITE_REACT_APP_GIPHY_API_KEY;

      const response = await fetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`
      );
      const data = await response.json();
      const randomGifUrl = data.data.images.fixed_height.url;
      setMessage(randomGifUrl);
    } catch (error) {
      console.error("Error fetching random gif", error);
    }
  };

  const login = () => {
    socket.connect();
    setIsLoggedIn(true);
    setRoom("Lobby");
  };

  const createNewRoom = (newRoomName: string) => {
    setRoom(newRoomName);
  };

  const handleClickRoom = (key: string) => {
    setRoom(key);
  };

  const sendMessage = async (message: string) => {
    if (message !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
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
