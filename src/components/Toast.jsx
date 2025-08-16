export default function Toast({ open, type = 'info', message, onClose }) {
  if (!open) return null;
  const base =
    'fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-5 py-4 rounded-2xl shadow-lg text-white text-base md:text-lg';
  const color =
    type === 'success' ? 'bg-emerald-600' :
    type === 'error'   ? 'bg-rose-600'    :
                         'bg-slate-700';

  return (
    <div className={`${base} ${color}`} onClick={onClose} role="alert">
      {message}
    </div>
  );
}
