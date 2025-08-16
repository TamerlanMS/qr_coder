import { useState } from 'react';
import Scanner from '../components/Scanner';
import ConfirmModal from '../components/ConfirmModal';
import LoadingOverlay from '../components/LoadingOverlay';
import { BarcodeFormat } from '@zxing/browser';

const webhookURL = 'https://ts21.cloud1c.pro/gourme_container/hs/GourmetContainer'; // или '/api/container' при прокси

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

export default function ReturnPage({ onBack }) {
  const [code, setCode]       = useState('');
  const [ask, setAsk]         = useState(false);
  const [sending, setSending] = useState(false);

  const onScan = (txt) => {
    const digits = txt.replace(/\D/g, ''); // только цифры
    if (digits) { setCode(digits); setAsk(true); }
  };

  const send = async () => {
    setSending(true);
    try {
      const payload = {
        partnerCode: '',       // по ТЗ при возврате пусто
        containerCode: code,   // номер контейнера как есть
      };
      await sendWithTimeout(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      alert('Контейнер успешно списан');
      onBack();
    } catch (e) {
      alert('Ошибка отправки: ' + e.message);
      setAsk(false);
      setCode('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto relative">
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
        onNo={() => { setAsk(false); setCode(''); }}
      />

      <LoadingOverlay open={sending} text="Отправка данных…" />
    </div>
  );
}
