import {Link} from "react-router-dom";

export default function Home() {
  return (
    <>
      <div>Home</div>
      <div>
          <Link to="/Authentication">Authentication</Link>
      </div>
    </>
  );
}
