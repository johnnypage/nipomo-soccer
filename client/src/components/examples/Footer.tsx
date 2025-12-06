import Footer from "../Footer";

export default function FooterExample() {
  return (
    <Footer onNavigate={(section) => console.log(`Navigate to: ${section}`)} />
  );
}
