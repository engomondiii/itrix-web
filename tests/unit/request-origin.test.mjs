import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../../src/lib/server/request-origin.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { hasAllowedRequestOrigin } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('edge origins are configured explicitly and forwarded headers cannot authorize POSTs', () => {
  const previous = process.env.WEBSITE_PUBLIC_URL;
  const previousPublic = process.env.NEXT_PUBLIC_SITE_URL;
  const request = (origin, url = 'https://itrix-web-production.up.railway.app/api/website/intake') =>
    new Request(url, { headers: { ...(origin ? { origin } : {}), 'x-forwarded-host': 'attacker.example' } });
  try {
    process.env.WEBSITE_PUBLIC_URL = 'https://itrix.co.kr';
    assert.equal(hasAllowedRequestOrigin(request('https://itrix.co.kr')), true);
    assert.equal(hasAllowedRequestOrigin(request('https://attacker.example')), false);
    assert.equal(hasAllowedRequestOrigin(request('https://attacker.example', 'https://attacker.example/api/website/intake')), false);
    assert.equal(hasAllowedRequestOrigin(request('https://itrix.co.kr.attacker.example')), false);
    assert.equal(hasAllowedRequestOrigin(request('http://itrix.co.kr')), false);
    assert.equal(hasAllowedRequestOrigin(request('null')), false);
    assert.equal(hasAllowedRequestOrigin(request()), false);
    process.env.WEBSITE_PUBLIC_URL = 'invalid configuration';
    assert.equal(hasAllowedRequestOrigin(request('https://itrix.co.kr')), false);
    delete process.env.WEBSITE_PUBLIC_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    assert.equal(hasAllowedRequestOrigin(request('https://localhost:3000', 'https://localhost:3000/api/website/intake')), true);
  } finally {
    if (previous === undefined) delete process.env.WEBSITE_PUBLIC_URL;
    else process.env.WEBSITE_PUBLIC_URL = previous;
    if (previousPublic === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousPublic;
  }
});
