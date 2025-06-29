import { useRedirectIfAuthenticated } from "@thenolans/nolan-ui";
import { ROUTE_PATHS } from "constants/urls";

export default function LandingPage() {
  useRedirectIfAuthenticated(ROUTE_PATHS.notes);

  return <div>Marketing</div>;
}
