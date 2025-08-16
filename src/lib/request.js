// единая точка отправки на сервер 1С через прокси /api/container
export async function sendPayload(payload, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch('/api/container', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // формат оставляем прежний: "PARTNER,CONTAINER"
      body: payload,
      signal: ctrl.signal,
    });

    const text = await res.text().catch(() => '');

    if (!res.ok) {
      // Прокидываем и статус, и текст ответа (если есть)
      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`);
    }

    return { ok: true, status: res.status, body: text };
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Таймаут запроса. Проверьте интернет/сервер.');
    throw new Error(e.message || 'Ошибка сети');
  } finally {
    clearTimeout(timer);
  }
}
