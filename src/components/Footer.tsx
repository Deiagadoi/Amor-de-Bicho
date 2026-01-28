import "./layout.css";

export function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Amor de Bicho - Todos os direitos reservados</p>
    </footer>
  );
}