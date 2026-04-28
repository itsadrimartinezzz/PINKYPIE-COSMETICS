import { useEffect, useState } from 'react';

function ClientForm({
  clienteEditando,
  onSubmit,
  onCancel
}) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    if (clienteEditando) {
      setForm({
        nombre: clienteEditando.nombre || '',
        apellido: clienteEditando.apellido || '',
        email: clienteEditando.email || '',
        telefono: clienteEditando.telefono || '',
        direccion: clienteEditando.direccion || ''
      });
    }
  }, [clienteEditando]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card client-form" onSubmit={enviarFormulario}>
        <div className="modal-header">
          <div>
            <h2>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <p>Completa la información del cliente</p>
          </div>

          <button type="button" onClick={onCancel} className="close-button">
            ×
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={manejarCambio}
              placeholder="5010-0000"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <textarea
            name="direccion"
            value={form.direccion}
            onChange={manejarCambio}
            rows="3"
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancelar
          </button>

          <button type="submit" className="primary-button">
            {clienteEditando ? 'Guardar Cambios' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientForm;