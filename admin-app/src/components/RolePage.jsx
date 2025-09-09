import { useParams } from "react-router-dom";

const RolePage = () => {
  const { roleName } = useParams();

  return <h2>{roleName} Role Page</h2>;
};

export default RolePage;
