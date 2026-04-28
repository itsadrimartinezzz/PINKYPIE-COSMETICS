import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Productos() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar title="Productos" />

        <section className="content-card">
          <h2>Productos</h2>
          <p>Aquí irá el CRUD de productos.</p>
        </section>
      </main>
    </div>
  );
}

export default Productos;