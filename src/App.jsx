import { useState } from 'react';
import ShipPage from './pages/ShipPage';
import ReturnPage from './pages/ReturnPage';

export default function App() {
  const [page, setPage] = useState('');
  if (!page) {
    return (
      <div className="h-screen flex flex-col gap-6 items-center justify-center p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Учёт тары</h1>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <button
            className="w-full px-6 py-4 text-xl md:text-2xl rounded-2xl shadow bg-indigo-600 text-white"
            onClick={() => setPage('ship')}
          >
            Отгрузка
          </button>
          <button
            className="w-full px-6 py-4 text-xl md:text-2xl rounded-2xl shadow bg-emerald-600 text-white"
            onClick={() => setPage('return')}
          >
            Возврат
          </button>
        </div>
      </div>
    );
  }
  return page === 'ship' ? <ShipPage onBack={() => setPage('')} /> : <ReturnPage onBack={() => setPage('')} />;
}
