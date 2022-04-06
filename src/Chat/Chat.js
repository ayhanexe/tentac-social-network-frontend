import React, { useState, useEffect, useRef, memo } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import ChatWindow from "../@components/ChatWindow/ChatWindow";
import ChatInput from "../@components/ChatInput/ChatInput";
import withSignalR from "../@tentac/contexts/SignalRContext/SignalRContext";

const Chat = () => {


//   const sendMessage = async (user, message) => {
//     const chatMessage = {
//       user: user,
//       message: message,
//     };

//     if (connection.connection) {
//       try {
//         await connection.invoke("SendMessage", chatMessage);
//       } catch (e) {
//         console.log(e);
//       }
//     } else {
//       alert("No connection to server yet.");
//     }
//   };

  return (
    <div>
        <h1>Test</h1>
    </div>
  );
};

export default memo(Chat);
