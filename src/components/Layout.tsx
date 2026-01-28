import { Header } from "./Header";
import { Footer } from "./Footer";
import "./layout.css";

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className="container">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}