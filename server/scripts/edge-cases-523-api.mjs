/**
 * Task 5.2.3 — API edge-case sampler (EC-04–10, 12, 13, 15).
 * Run: API_BASE=http://localhost:3001/api node scripts/edge-cases-523-api.mjs
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

function repeat(char, count) {
  return char.repeat(count);
}

async function main() {
  const users = await request('GET', '/users');
  const userId = users.json?.[0]?.id;
  if (!userId) {
    console.error('No users available — run npm run db:seed');
    process.exit(1);
  }

  // Fixture: open ticket for EC-13 and EC-15 (title)
  const openCreate = await request('POST', '/tickets', {
    title: 'Edge case 523 open fixture',
    description: 'Fixture for concurrent status updates.',
    priority: 'Low',
    createdBy: userId,
  });
  const openId = openCreate.json?.id;

  // Fixture: in-progress ticket for EC-04
  const ipCreate = await request('POST', '/tickets', {
    title: 'Edge case 523 in-progress fixture',
    description: 'Fixture for skip Resolved transition.',
    priority: 'Low',
    createdBy: userId,
  });
  const ipId = ipCreate.json?.id;
  if (ipId) {
    await request('PATCH', `/tickets/${ipId}/status`, { status: 'In Progress' });
  }

  // Fixture: resolved ticket for EC-05
  const resCreate = await request('POST', '/tickets', {
    title: 'Edge case 523 resolved fixture',
    description: 'Fixture for revert transition.',
    priority: 'Low',
    createdBy: userId,
  });
  const resId = resCreate.json?.id;
  if (resId) {
    await request('PATCH', `/tickets/${resId}/status`, { status: 'In Progress' });
    await request('PATCH', `/tickets/${resId}/status`, { status: 'Resolved' });
  }

  // EC-04 — In Progress → Closed (skip Resolved)
  if (ipId) {
    const ec04 = await request('PATCH', `/tickets/${ipId}/status`, { status: 'Closed' });
    record(
      'EC-04',
      ec04.status === 400 && ec04.json?.error?.code === 'INVALID_STATUS_TRANSITION',
      `status=${ec04.status} code=${ec04.json?.error?.code ?? 'n/a'}`,
    );
  } else {
    record('EC-04', false, 'fixture create failed');
  }

  // EC-05 — Resolved → In Progress (revert)
  if (resId) {
    const ec05 = await request('PATCH', `/tickets/${resId}/status`, { status: 'In Progress' });
    record(
      'EC-05',
      ec05.status === 400 && ec05.json?.error?.code === 'INVALID_STATUS_TRANSITION',
      `status=${ec05.status} code=${ec05.json?.error?.code ?? 'n/a'}`,
    );
  } else {
    record('EC-05', false, 'fixture create failed');
  }

  // EC-06 — empty description
  const ec06 = await request('POST', '/tickets', {
    title: 'Has title',
    description: '   ',
    priority: 'Low',
    createdBy: userId,
  });
  record(
    'EC-06',
    ec06.status === 400 && ec06.json?.error?.code === 'VALIDATION_ERROR',
    `status=${ec06.status} code=${ec06.json?.error?.code ?? 'n/a'}`,
  );

  // EC-07 — invalid priority
  const ec07 = await request('POST', '/tickets', {
    title: 'Invalid priority',
    description: 'Urgent is not a valid priority.',
    priority: 'Urgent',
    createdBy: userId,
  });
  record(
    'EC-07',
    ec07.status === 400 && ec07.json?.error?.code === 'VALIDATION_ERROR',
    `status=${ec07.status} code=${ec07.json?.error?.code ?? 'n/a'}`,
  );

  // EC-08 — non-existent user (createdBy and assignedTo)
  const ec08a = await request('POST', '/tickets', {
    title: 'Bad createdBy',
    description: 'User does not exist.',
    priority: 'Low',
    createdBy: 99999,
  });
  const ec08b = await request('POST', '/tickets', {
    title: 'Bad assignedTo',
    description: 'Assignee does not exist.',
    priority: 'Low',
    createdBy: userId,
    assignedTo: 99999,
  });
  record(
    'EC-08',
    ec08a.status === 404 &&
      ec08a.json?.error?.code === 'NOT_FOUND' &&
      ec08b.status === 404 &&
      ec08b.json?.error?.code === 'NOT_FOUND',
    `createdBy=${ec08a.status}/${ec08a.json?.error?.code}; assignedTo=${ec08b.status}/${ec08b.json?.error?.code}`,
  );

  // EC-09 — comment on missing ticket
  const ec09 = await request('POST', '/tickets/99999/comments', {
    message: 'Orphan comment',
    createdBy: userId,
  });
  record(
    'EC-09',
    ec09.status === 404 && ec09.json?.error?.code === 'NOT_FOUND',
    `status=${ec09.status} code=${ec09.json?.error?.code ?? 'n/a'}`,
  );

  // EC-10 — empty comment message
  const commentTicket = await request('POST', '/tickets', {
    title: 'Comment validation fixture',
    description: 'For EC-10.',
    priority: 'Low',
    createdBy: userId,
  });
  const commentTicketId = commentTicket.json?.id;
  if (commentTicketId) {
    const ec10a = await request('POST', `/tickets/${commentTicketId}/comments`, {
      message: '',
      createdBy: userId,
    });
    const ec10b = await request('POST', `/tickets/${commentTicketId}/comments`, {
      message: '   ',
      createdBy: userId,
    });
    record(
      'EC-10',
      ec10a.status === 400 &&
        ec10a.json?.error?.code === 'VALIDATION_ERROR' &&
        ec10b.status === 400 &&
        ec10b.json?.error?.code === 'VALIDATION_ERROR',
      `empty=${ec10a.status}; whitespace=${ec10b.status}`,
    );
  } else {
    record('EC-10', false, 'fixture create failed');
  }

  // EC-12 — filter + search with zero results
  const ec12 = await request('GET', '/tickets?status=Open&search=zzznomatch523');
  record(
    'EC-12',
    ec12.status === 200 && Array.isArray(ec12.json) && ec12.json.length === 0,
    `count=${ec12.json?.length ?? 'n/a'}`,
  );

  // EC-13 — concurrent status updates (Open → In Progress twice)
  if (openId) {
    const [r1, r2] = await Promise.all([
      request('PATCH', `/tickets/${openId}/status`, { status: 'In Progress' }),
      request('PATCH', `/tickets/${openId}/status`, { status: 'In Progress' }),
    ]);
    const statuses = [r1.status, r2.status].sort();
    const codes = [r1.json?.error?.code, r2.json?.error?.code];
    const oneOkOneFail =
      statuses.includes(200) &&
      statuses.includes(400) &&
      codes.includes('INVALID_STATUS_TRANSITION');
    record(
      'EC-13',
      oneOkOneFail,
      `responses=${r1.status}/${r2.status} codes=${codes.filter(Boolean).join(',') || 'n/a'}`,
    );
  } else {
    record('EC-13', false, 'fixture create failed');
  }

  // EC-15 — over max length (title 201, description 5001, comment 2001)
  const ec15title = await request('POST', '/tickets', {
    title: repeat('a', 201),
    description: 'Valid description',
    priority: 'Low',
    createdBy: userId,
  });
  const ec15desc = await request('POST', '/tickets', {
    title: 'Valid title',
    description: repeat('b', 5001),
    priority: 'Low',
    createdBy: userId,
  });
  let ec15commentOk = false;
  if (commentTicketId) {
    const ec15comment = await request('POST', `/tickets/${commentTicketId}/comments`, {
      message: repeat('c', 2001),
      createdBy: userId,
    });
    ec15commentOk =
      ec15comment.status === 400 && ec15comment.json?.error?.code === 'VALIDATION_ERROR';
  }
  record(
    'EC-15',
    ec15title.status === 400 &&
      ec15title.json?.error?.code === 'VALIDATION_ERROR' &&
      ec15desc.status === 400 &&
      ec15desc.json?.error?.code === 'VALIDATION_ERROR' &&
      ec15commentOk,
    `title=${ec15title.status}; desc=${ec15desc.status}; comment=${ec15commentOk ? 400 : 'fail'}`,
  );

  const failed = results.filter((r) => !r.pass);
  console.log(`\n--- ${results.length - failed.length}/${results.length} API edge cases passed ---`);
  if (failed.length) {
    console.log('Failed:', failed.map((f) => f.id).join(', '));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
