import { useState } from 'react';
import Scanner from '../components/Scanner';
import ConfirmModal from '../components/ConfirmModal';
import { BarcodeFormat } from '@zxing/browser';

const webhookURL = 'https://ts21.cloud1c.pro/gourme_container/hs/ContainerKK';   // заменить!

export default function ShipPage({ onBack }) {
  const [partner, setPartner]   = useState('');
  const [container, setContainer] = useState('');
  const [ask, setAsk]           = useState(false);
  const [sending, setSending]   = useState(false);

  /* ---------- сканирование ---------- */

  const onPartner = txt => !partner && setPartner(txt);
  const onContainer = txt => {
    if (!container) { setContainer(txt); setAsk(true); }
  };

  /* ---------- отправка ---------- */

  const send = async () => {
    setSending(true);
    try {
      const payload = `${partner.split(' ')[0]},${container}`;
      await fetch(webhookURL, { method:'POST', headers:{'Content-Type':'text/plain'}, body: payload });
      alert('Контейнер успешно отгружен');
      onBack();                    // возвращаемся в меню
    } catch (e) { alert('Ошибка: '+e.message); }
    finally { setSending(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <button className="underline mb-2" onClick={onBack}>← Назад</button>
      <h1 className="text-xl font-bold mb-2">Отгрузка</h1>

      {!partner && (
        <>
          <p className="mb-2">Сканируйте QR-код партнёра</p>
          <Scanner onResult={onPartner} formats={[BarcodeFormat.QR_CODE]} />
        </>
      )}

      {partner && !container && (
        <>
          <p className="mb-2">Партнёр: <b>{partner}</b></p>
          <p className="mb-2">Сканируйте штрих-код контейнера</p>
          <Scanner
            onResult={onContainer}
            formats={[BarcodeFormat.EAN_13]}   // ← только “товарный” код
          />
        </>
      )}

      <ConfirmModal
        open={ask}
        title="Отгрузить данные?"
        message={`Партнёр: ${partner}\nКонтейнер: ${container}`}
        onYes={send}
        onNo={() => { setAsk(false); setContainer(''); }}
      />

      {sending && <p className="mt-4">Отправка…</p>}
    </div>
  );
}
