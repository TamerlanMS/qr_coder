import { useState } from 'react';
import Scanner from '../components/Scanner';
import ConfirmModal from '../components/ConfirmModal';
import { BarcodeFormat } from '@zxing/browser';

const webhookURL = 'https://ts21.cloud1c.pro/gourme_container/hs/ContainerKK';

export default function ReturnPage({ onBack }) {
  const [code, setCode] = useState('');
  const [ask, setAsk]   = useState(false);
  const [sending, setSending] = useState(false);

  const onScan = txt => {
    const digits = txt.replace(/\\D/g,'');
    if (digits) { setCode(digits); setAsk(true); }
  };

  const send = async () => {
    setSending(true);
    try {
      await fetch(webhookURL, { method:'POST', headers:{'Content-Type':'text/plain'}, body: `,${code}` });
      alert('Контейнер успешно списан');
      onBack();
    } catch(e){ alert('Ошибка: '+e.message); }
    finally { setSending(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <button className="underline mb-2" onClick={onBack}>← Назад</button>
      <h1 className="text-xl font-bold mb-2">Возврат</h1>

      {!code && (
        <>
          <p className="mb-2">Сканируйте штрих-код контейнера</p>
          <Scanner onResult={onScan} formats={[BarcodeFormat.EAN_13]} />
        </>
      )}

      <ConfirmModal
        open={ask}
        title="Оформить возврат контейнера?"
        message={`Контейнер: ${code}`}
        onYes={send}
        onNo={()=>{ setAsk(false); setCode(''); }}
      />

      {sending && <p className="mt-4">Отправка…</p>}
    </div>
  );
}
