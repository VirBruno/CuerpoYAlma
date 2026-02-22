import "./Modal.css";

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>{title}</h2>

        {children}
      </div>
    </div>
  );
}
