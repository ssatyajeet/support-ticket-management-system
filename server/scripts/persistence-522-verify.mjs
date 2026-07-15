/**
 * Task 5.2.2 — Verify persistence marker after restart.
 * Run: API_BASE=http://localhost:3001/api TICKET_ID=<id> node scripts/persistence-522-verify.mjs
 */
const BASE = process.env.API_BASE ?? 'http://localhost:3001/api';
const TICKET_ID = process.env.TICKET_ID;
const EXPECTED_TITLE = 'Persistence check 5.2.2 — 2026-07-13';
const EXPECTED_COMMENT = 'Marker comment for Task 5.2.2 persistence verification.';

if (!TICKET_ID) {
  console.error('TICKET_ID env var required');
  process.exit(1);
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

async function main() {
  const health = await request('GET', '/health');
  if (health.status !== 200) {
    console.error('FAIL health', health.status);
    process.exit(1);
  }

  const detail = await request('GET', `/tickets/${TICKET_ID}`);
  const list = await request('GET', '/tickets');

  const titleOk = detail.json?.title === EXPECTED_TITLE;
  const commentOk = detail.json?.comments?.some((c) => c.message === EXPECTED_COMMENT);
  const inList = list.json?.some((t) => t.id === Number(TICKET_ID));

  const pass = detail.status === 200 && titleOk && commentOk && inList;

  console.log(
    JSON.stringify(
      {
        pass,
        ticketId: Number(TICKET_ID),
        status: detail.status,
        title: detail.json?.title,
        titleOk,
        commentOk,
        inList,
        ticketCount: list.json?.length,
        updatedAt: detail.json?.updatedAt,
      },
      null,
      2,
    ),
  );

  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
