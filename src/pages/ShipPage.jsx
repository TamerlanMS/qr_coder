import { useState } from 'react';
import Scanner from '../components/Scanner';
import ConfirmModal from '../components/ConfirmModal';
import LoadingOverlay from '../components/LoadingOverlay';
import { BarcodeFormat } from '@zxing/browser';

//const webhookURL = 'https://ts21.cloud1c.pro/gourme_container/hs/GourmetContainer'; // или '/api/container' при прокси
const webhookURL = '/api/container';

async function sendWithTimeout(url, options = {}, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    const text = await res.text().catch(() => '');
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`);
    return { res, text };
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Таймаут запроса. Проверьте интернет/сервер.');
    throw e;
  } finally { clearTimeout(t); }
}

export default function ShipPage({ onBack }) {
  const [partner, setPartner]     = useState('');
  const [container, setContainer] = useState('');
  const [ask, setAsk]             = useState(false);
  const [sending, setSending]     = useState(false);

  const onPartner = (txt) => { if (!partner) setPartner(txt); };
  const onContainer = (txt) => { if (!container) { setContainer(txt); setAsk(true); } };

  const send = async () => {
    setSending(true);
    try {
      const compactPartner = partner.trim().split(' ')[0]; // только код до пробела
      const payload = {
        partnerCode: compactPartner,
        containerCode: container,
      };
      await sendWithTimeout(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      alert('Контейнер успешно отгружен');
      onBack();
    } catch (e) {
      alert('Ошибка отправки: ' + e.message);
      setAsk(false);
      setContainer('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto relative">
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
          <Scanner onResult={onContainer} formats={[BarcodeFormat.EAN_13]} />
        </>
      )}

      <ConfirmModal
        open={ask}
        title="Отгрузить данные?"
        message={`Партнёр: ${partner}\nКонтейнер: ${container}`}
        onYes={send}
        onNo={() => { setAsk(false); setContainer(''); }}
      />

      <LoadingOverlay open={sending} text="Отправка данных…" />
    </div>
  );
}
