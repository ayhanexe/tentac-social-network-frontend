import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface ISignalRService {
  onUserPosted: (userId: string) => void;
}

export default class SignalRService {
  constructor(props: ISignalRService) {}

  connect() {
    try {
      const newConnection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Information)
        .withUrl("https://localhost:44300/Post")
        .withAutomaticReconnect()
        .build();

      newConnection
        .start()
        .then((result) => {
          newConnection.on("UserPosted", async (userId) => {
            alert("asda");
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
      return newConnection;
    } catch (error) {
      return null;
    }
  }
}
