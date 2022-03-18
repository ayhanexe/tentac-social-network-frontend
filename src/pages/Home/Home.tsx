import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div>Home</div>
      <div>
        <Link to="/Authentication?mode=login">Login</Link>
        <br />
        <Link to="/Authentication">Register</Link>
      </div>
    </>
  );
}
