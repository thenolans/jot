import Container from "components/Container";

export default function FloatingButtons() {
  return (
    <>
      <div className="fixed bottom-0 left-0 w-full py-4">
        <Container>
          <div className="flex justify-between px-2"></div>
        </Container>
      </div>
    </>
  );
}
