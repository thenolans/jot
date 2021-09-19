import Container from "components/Container";

export default function AuthLoader() {
  return (
    <Container>
      <div className="text-center space-y-4">
        <div className="relative inline-block text-yellow-600">
          <i className="fa fa-circle-o-notch fa-spin fa-5x text-yellow-200" />
          <i className="fa fa-lock fa-2x text-yellow-600 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h1 className="font-display text-5xl text-yellow-600 -ml-4">Jot</h1>
      </div>
    </Container>
  );
}
