/**
 * Task 5.2.1 — API-backed regression runner.
 * Exercises endpoints that underpin AC-01–AC-11 UI flows.
 * Run: node scripts/regression-521-api.mjs (from server/, API on :3001)
 */
const BASE = process.env.API_BASE ?? 'http://localhost:3001/api';

const results = [];

function record(id, pass, note = '') {
  results.push({ id, pass, note });
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`${mark} ${id}${note ? ` — ${note}` : ''}`);
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

async function main() {
  // A3
  const a3 = await request('GET', '/tickets/99999');
  record('A3', a3.status === 404 && a3.json?.error?.code === 'NOT_FOUND');

  // B1
  const b1 = await request('GET', '/tickets');
  record(
    'B1',
    b1.status === 200 && Array.isArray(b1.json) && b1.json.length >= 5,
    `count=${b1.json?.length ?? 0}`,
  );

  // B3
  const b3 = await request('GET', '/tickets?search=zzznomatchxyz123');
  record('B3', b3.status === 200 && Array.isArray(b3.json) && b3.json.length === 0);

  // C1
  const c1 = await request('GET', '/tickets?search=vpn');
  record(
    'C1',
    c1.status === 200 &&
      c1.json?.length >= 1 &&
      c1.json.every((t) =>
        `${t.title} ${t.description}`.toLowerCase().includes('vpn'),
      ),
  );

  // C2
  const c2 = await request('GET', '/tickets?search=home%20network');
  record('C2', c2.status === 200 && c2.json?.some((t) => t.title.includes('VPN')));

  // C3
  const c3 = await request('GET', '/tickets');
  record('C3', c3.status === 200 && c3.json?.length >= 5);

  // C4
  const c4 = await request('GET', '/tickets?status=Open');
  record(
    'C4',
    c4.status === 200 && c4.json?.length === 1 && c4.json[0].status === 'Open',
  );

  // D1-D3 create flow
  const users = await request('GET', '/users');
  const userId = users.json?.[0]?.id;
  if (!userId) {
    record('D1', false, 'no users');
    record('D2', false, 'skipped');
    record('D3', false, 'skipped');
  } else {
    const d1 = await request('POST', '/tickets', {
      title: 'Regression test ticket 521',
      description: 'Created during Task 5.2.1 manual regression.',
      priority: 'High',
      createdBy: userId,
    });
    const ticketId = d1.json?.id;
    record(
      'D1',
      d1.status === 201 && ticketId != null,
      ticketId ? `id=${ticketId}` : d1.json?.error?.code,
    );
    record('D2', d1.json?.status === 'Open');
    record('D3', d1.json?.assignedTo === null && d1.json?.assignedToName == null);

    const d4 = await request('POST', '/tickets', {
      description: 'no title',
      priority: 'Low',
      createdBy: userId,
    });
    record('D4', d4.status === 400 && d4.json?.error?.code === 'VALIDATION_ERROR');

    if (ticketId) {
      // E1
      const e1 = await request('GET', `/tickets/${ticketId}`);
      record(
        'E1',
        e1.status === 200 &&
          e1.json?.title &&
          e1.json?.createdByName &&
          e1.json?.comments != null,
      );

      // E2 - use seeded open ticket with 2 comments
      const openList = await request('GET', '/tickets?status=Open');
      const openId = openList.json?.find((t) => t.title === 'VPN not connecting')?.id
        ?? openList.json?.[0]?.id;
      if (openId) {
        const e2 = await request('GET', `/tickets/${openId}`);
        const comments = e2.json?.comments ?? [];
        const sorted =
          comments.length < 2 ||
          new Date(comments[0].createdAt) <= new Date(comments[1].createdAt);
        record('E2', e2.status === 200 && sorted, `comments=${comments.length}`);
      } else {
        record('E2', false, 'no open ticket');
      }

      // F1 F2
      const before = await request('GET', `/tickets/${ticketId}`);
      const f1 = await request('PATCH', `/tickets/${ticketId}`, {
        title: 'Regression test ticket 521 updated',
        description: 'Updated description for 5.2.1.',
      });
      const after = await request('GET', `/tickets/${ticketId}`);
      record(
        'F1',
        f1.status === 200 && after.json?.title === 'Regression test ticket 521 updated',
      );
      record(
        'F2',
        after.json?.updatedAt &&
          before.json?.updatedAt &&
          after.json.updatedAt !== before.json.updatedAt,
      );

      // G1 G2 - status happy path on regression ticket
      const g1 = await request('PATCH', `/tickets/${ticketId}/status`, {
        status: 'In Progress',
      });
      record('G1', g1.status === 200 && g1.json?.status === 'In Progress');

      const g2a = await request('PATCH', `/tickets/${ticketId}/status`, {
        status: 'Resolved',
      });
      const g2b = await request('PATCH', `/tickets/${ticketId}/status`, {
        status: 'Closed',
      });
      record(
        'G2',
        g2a.status === 200 &&
          g2b.status === 200 &&
          g2b.json?.status === 'Closed',
      );

      // G3 - new open ticket → cancelled
      const g3create = await request('POST', '/tickets', {
        title: 'Cancel me 521',
        description: 'For G3',
        priority: 'Low',
        createdBy: userId,
      });
      const g3id = g3create.json?.id;
      const g3 = await request('PATCH', `/tickets/${g3id}/status`, {
        status: 'Cancelled',
      });
      record('G3', g3.status === 200 && g3.json?.status === 'Cancelled');

      // G4 - closed ticket cannot transition
      const g4 = await request('PATCH', `/tickets/${ticketId}/status`, {
        status: 'In Progress',
      });
      record(
        'G4',
        g4.status === 400 && g4.json?.error?.code === 'INVALID_STATUS_TRANSITION',
      );

      // G5 - invalid open → resolved skip
      const g5create = await request('POST', '/tickets', {
        title: 'Invalid transition 521',
        description: 'G5',
        priority: 'Low',
        createdBy: userId,
      });
      const g5id = g5create.json?.id;
      const g5 = await request('PATCH', `/tickets/${g5id}/status`, {
        status: 'Resolved',
      });
      record(
        'G5',
        g5.status === 400 &&
          g5.json?.error?.code === 'INVALID_STATUS_TRANSITION' &&
          Boolean(g5.json?.error?.message),
      );

      // H1 H2 H3 on open ticket
      const hOpen = await request('POST', '/tickets', {
        title: 'Panel fields 521',
        description: 'H section',
        priority: 'Medium',
        createdBy: userId,
        assignedTo: userId,
      });
      const hId = hOpen.json?.id;
      const managerId = users.json?.find((u) => u.role === 'Manager')?.id ?? users.json[1]?.id;
      const h1 = await request('PATCH', `/tickets/${hId}`, {
        assignedTo: managerId,
      });
      const h1check = await request('GET', `/tickets/${hId}`);
      record(
        'H1',
        h1.status === 200 &&
          h1check.json?.status === 'Open' &&
          h1check.json?.assignedTo === managerId,
      );

      const h2 = await request('PATCH', `/tickets/${hId}`, { assignedTo: null });
      const h2check = await request('GET', `/tickets/${hId}`);
      record('H2', h2.status === 200 && h2check.json?.assignedTo === null);

      const h3 = await request('PATCH', `/tickets/${hId}`, { priority: 'Critical' });
      record('H3', h3.status === 200 && h3.json?.priority === 'Critical');

      // I1
      const i1 = await request('POST', `/tickets/${hId}/comments`, {
        message: 'Regression comment 521',
        createdBy: userId,
      });
      const i1check = await request('GET', `/tickets/${hId}`);
      record(
        'I1',
        i1.status === 201 &&
          i1check.json?.comments?.some((c) => c.message === 'Regression comment 521'),
      );

      // I2 - closed ticket from G2
      const i2 = await request('POST', `/tickets/${ticketId}/comments`, {
        message: 'Comment on closed 521',
        createdBy: userId,
      });
      record('I2', i2.status === 201);
    }
  }

  // J1 - dashboard data via ticket list counts
  const all = await request('GET', '/tickets');
  const statuses = new Set(all.json?.map((t) => t.status) ?? []);
  record(
    'J1',
    all.status === 200 && statuses.has('Open') && statuses.has('Closed'),
    `statuses=${[...statuses].join(',')}`,
  );

  const failed = results.filter((r) => !r.pass);
  console.log(`\n--- ${results.length - failed.length}/${results.length} API cases passed ---`);
  if (failed.length) {
    console.log('Failed:', failed.map((f) => f.id).join(', '));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
