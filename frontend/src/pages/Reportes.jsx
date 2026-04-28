import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Reportes() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar title="Reportes" />

        <section className="content-card">
          <h2>Reportes</h2>
          <p>Aquí se mostrarán los reportes SQL.</p>
        </section>
      </main>
    </div>
  );
}

export default Reportes;