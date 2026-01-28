import "./layout.css";

export function Header() {
  return (
    <header className="header">
      <h1>🐾 Amor de Bicho</h1>
      <nav>
        <a href="#">Início</a>
        <a href="#">Pets</a>
        <a href="#">Cadastro</a>
      </nav>
    </header>
  );
}