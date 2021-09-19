import Container from "components/Container";
import Icon from "components/Icon";
import Link from "components/Link";
import Logo from "components/Logo";
import SROnly from "components/SROnly";
import Urls from "constants/urls";

export default function Header() {
  return (
    <Container>
      <div className="space-y-8 py-8">
        <div className="flex justify-between">
          <Link theme="muted" to={Urls.routes.app}>
            <Icon variant="fa-home" size="fa-2x" />
            <SROnly>Home</SROnly>
          </Link>
          <Link theme="muted" to={Urls.routes.account}>
            <Icon variant="fa-gear" size="fa-2x" />
            <SROnly>Account settings</SROnly>
          </Link>
        </div>
        <Link className="block text-center" to={Urls.routes.app}>
          <Logo />
        </Link>
      </div>
    </Container>
  );
}
