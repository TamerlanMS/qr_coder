// Простая «занавеска» с крутилкой SVG (без зависимостей и Tailwind-анимаций)
export default function LoadingOverlay({ open, text = 'Отправка…' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl px-6 py-5 shadow-lg flex flex-col items-center gap-4">
        {/* SVG со встроенной анимацией, работает без CSS */}
        <svg width="48" height="48" viewBox="0 0 38 38" stroke="#4f46e5" aria-label="loading">
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="3">
              <circle strokeOpacity=".2" cx="18" cy="18" r="18"/>
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="0.8s"
                  repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </svg>
        <div className="text-lg">{text}</div>
      </div>
    </div>
  );
}
