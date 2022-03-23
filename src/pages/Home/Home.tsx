import "./Home.scss";

export default function Home() {
  return (
    <div>
      <header
        id="header"
        className="m-5 py-3 px-5 rounded-lg shadow-md flex justify-between"
      >
        <a href="/" className="h-full">
          <img src="./assets/media/tentac-logo-dark.svg" className="h-full" />
        </a>
        
        <div id="user-area">
          <div id="message">
            Hi, 
          </div>
        </div>
      </header>
      <main></main>
      <footer></footer>
    </div>
  );
}
