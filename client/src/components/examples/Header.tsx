import Header from "../Header";

export default function HeaderExample() {
  return (
    <div className="bg-night min-h-[120px]">
      <Header onNavigate={(section) => console.log(`Navigate to: ${section}`)} />
    </div>
  );
}
