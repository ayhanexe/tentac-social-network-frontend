import { useParams } from "react-router-dom";

export default function PersonDetails() {
  const { id } = useParams();

  return <div>{id}</div>;
}
