import Programs from "../Programs";

export default function ProgramsExample() {
  return (
    <Programs onProgramSelect={(program) => console.log(`Selected program: ${program}`)} />
  );
}
