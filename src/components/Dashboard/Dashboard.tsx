import LogoutButton from "components/LogoutButton";
import Urls from "constants/urls";
import { useQuery } from "react-query";
import http from "utils/http";

export default function Dashboard() {
  const { data } = useQuery(["categories"], () => http.get(Urls.api.posts), {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="container max-w-sm mx-auto py-16 space-y-12">
      <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
      <p className="text-lg text-gray-600">
        This page is a protected route and would typically require
        authentication to view
      </p>
      <LogoutButton />
    </div>
  );
}
