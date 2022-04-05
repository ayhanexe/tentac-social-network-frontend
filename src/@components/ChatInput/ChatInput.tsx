import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import path from "path-browserify";

const ChatInput = (props: any) => {
  const [connection, setConnection] = useState<HubConnection>();
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(path.join(`${process.env.REACT_APP_STATIC_FILES_BASE}`, "/hubs/post"))
      .withAutomaticReconnect()
      .build();

    if (newConnection) setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("ReceiveMessage", (message) => {
            console.log(message);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const isUserProvided = user && user !== "";
    const isMessageProvided = message && message !== "";

    if (isUserProvided && isMessageProvided) {
      props.sendMessage(user, message);
    } else {
      alert("Please insert an user and a message.");
    }
  };

  const onUserUpdate = (e: any) => {
    setUser(e.target.value);
  };

  const onMessageUpdate = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="user">User:</label>
      <br />
      <input id="user" name="user" value={user} onChange={onUserUpdate} />
      <br />
      <label htmlFor="message">Message:</label>
      <br />
      <input
        type="text"
        id="message"
        name="message"
        value={message}
        onChange={onMessageUpdate}
      />
      <br />
      <br />
      <button>Submit</button>
    </form>
  );
};

export default ChatInput;
