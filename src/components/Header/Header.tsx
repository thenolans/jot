import Container from "components/Container";
import GearIcon from "components/GearIcon";
import Urls from "constants/urls";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Container>
      <div className="flex justify-end ">
        <Link
          to={Urls.routes.account}
          className="text-gray-300 hover:text-yellow-600"
        >
          <GearIcon />
          <span className="sr-only">Account settings</span>
        </Link>
      </div>
      <Link
        className="block font-display text-center text-6xl text-yellow-600"
        to={Urls.routes.app}
      >
        Jot
      </Link>
    </Container>
  );
}
