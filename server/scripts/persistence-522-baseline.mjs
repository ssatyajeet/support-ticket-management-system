/**
 * Task 5.2.2 — Create persistence marker ticket + comment.
 * Run: API_BASE=http://localhost:3001/api node scripts/persistence-522-baseline.mjs
 */
const BASE = process.env.API_BASE ?? 'http://localhost:3001/api';
const MARKER_TITLE = 'Persistence check 5.2.2 — 2026-07-13';
const MARKER_COMMENT = 'Marker comment for Task 5.2.2 persistence verification.';

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
  const users = await request('GET', '/users');
  if (users.status !== 200 || !users.json?.[0]?.id) {
    console.error('Failed to fetch users', users);
    process.exit(1);
  }
  const userId = users.json[0].id;

  const listBefore = await request('GET', '/tickets');
  const countBefore = listBefore.json?.length ?? 0;

  const created = await request('POST', '/tickets', {
    title: MARKER_TITLE,
    description: 'Baseline marker for server and database restart tests.',
    priority: 'Medium',
    createdBy: userId,
  });

  if (created.status !== 201 || !created.json?.id) {
    console.error('Failed to create marker ticket', created);
    process.exit(1);
  }

  const ticketId = created.json.id;

  const comment = await request('POST', `/tickets/${ticketId}/comments`, {
    message: MARKER_COMMENT,
    createdBy: userId,
  });

  if (comment.status !== 201) {
    console.error('Failed to create marker comment', comment);
    process.exit(1);
  }

  const detail = await request('GET', `/tickets/${ticketId}`);
  const listAfter = await request('GET', '/tickets');

  const baseline = {
    ticketId,
    title: MARKER_TITLE,
    commentMessage: MARKER_COMMENT,
    updatedAt: detail.json?.updatedAt,
    ticketCountBefore: countBefore,
    ticketCountAfter: listAfter.json?.length ?? 0,
    commentCount: detail.json?.comments?.length ?? 0,
    apiBase: BASE,
    createdAt: new Date().toISOString(),
  };

  console.log(JSON.stringify(baseline, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
