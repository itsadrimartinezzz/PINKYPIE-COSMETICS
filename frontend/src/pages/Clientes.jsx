import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Clientes() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar title="Clientes" />

        <section className="content-card">
          <h2>Clientes</h2>
          <p>Aquí irá el CRUD de clientes.</p>
        </section>
      </main>
    </div>
  );
}

export default Clientes;