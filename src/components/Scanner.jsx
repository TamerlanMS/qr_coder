import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

export default function Scanner({ onResult, formats }) {
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    /* формируем hints лишь если передали formats */
    const hints = new Map();
    if (formats?.length) {
      const list = formats
        .map(f => (typeof f === 'string' ? BarcodeFormat[f] : f))
        .filter(Boolean);
      if (list.length) hints.set(DecodeHintType.POSSIBLE_FORMATS, list);
    }

    const reader = new BrowserMultiFormatReader(hints);
    let controls;

    reader
      .decodeFromVideoDevice(null, videoRef.current, (res, err, ctrl) => {
        controls ??= ctrl;          // сохранили controls один раз
        if (res) {
          onResult(res.getText().trim());
          controls.stop();          // гасим камеру сразу после удачи
        }
        if (err && !(err instanceof DOMException)) console.warn(err);
      })
      .catch(e => setError(e.message));

    return () => controls?.stop();  // корректная остановка потока
  }, [formats, onResult]);

  return (
    <>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <video ref={videoRef} className="w-full rounded-lg border shadow" />
    </>
  );
}
