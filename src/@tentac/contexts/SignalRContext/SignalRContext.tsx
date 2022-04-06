import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";

export interface ISignalRContext {
  onUserPost: (userId: string) => any;
}

export interface ISignalRReturn {
  connection: HubConnection;
  invokeServerside: (name: string, ...args: any[]) => void;
}

const defaultSignalRContextProps: ISignalRContext = {
  onUserPost: () => {},
};

function useSignalR(props: ISignalRContext = defaultSignalRContextProps) {
  const [connection, setConnection] = useState<HubConnection>();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl("https://localhost:44300/Post")
      .withAutomaticReconnect()
      .build();

    if (newConnection) setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          connection.on("UserPosted", async (userId) => {
            await props.onUserPost(userId);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const invokeServerside = async (
    methodName: string,
    invokedMethod: string,
    ...args: any[]
  ) => await connection?.invoke(`${methodName}`, invokedMethod, ...args);

  return {
    connection,
    invokeServerside,
  };
}

export default useSignalR;
