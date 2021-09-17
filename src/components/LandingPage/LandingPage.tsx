import LoginButton from "components/LoginButton";
import SignUpButton from "components/SignUpButton";

export default function LandingPage() {
  return (
    <div className="container max-w-sm mx-auto py-16 space-y-12">
      <h1 className="text-3xl font-bold text-gray-700">Landing page</h1>
      <p className="text-lg text-gray-600">
        This would be the first page users would land on if they are not logged
        into the application
      </p>
      <div className="space-x-4">
        <LoginButton />
        <SignUpButton />
      </div>
    </div>
  );
}
