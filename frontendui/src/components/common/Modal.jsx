export default function Modal({ onClose, children, maxWidth = "max-w-md" }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
        <div className={`relative w-full ${maxWidth} rounded-4xl bg-white shadow-xl`}>
          {children}
        </div>
      </div>
    </>
  );
}
