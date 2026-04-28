import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Ventas() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar title="Ventas" />

        <section className="content-card">
          <h2>Ventas</h2>
          <p>Aquí se registrarán ventas con transacción.</p>
        </section>
      </main>
    </div>
  );
}

export default Ventas;