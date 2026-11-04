import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// CodeQL js/polynomial-redos: a hostile If-None-Match header must stay cheap.
process.chdir(fs.mkdtempSync(path.join(os.tmpdir(), "choumi-etag-")));
const { etagMatches } = await import("../lib/http.js");

test("etagMatches: our copy among the visitor's, however spaced", () => {
  assert.equal(etagMatches('W/"a-b"', 'W/"a-b"'), true);
  assert.equal(etagMatches('W/"x", W/"a-b",W/"y"', 'W/"a-b"'), true);
  assert.equal(etagMatches('W/"x", W/"y"', 'W/"a-b"'), false);
  assert.equal(etagMatches("", 'W/"a-b"'), false);
  assert.equal(etagMatches(null, 'W/"a-b"'), false);
});

test("etagMatches: a hostile header costs a linear scan, not an explosion", () => {
  const evil = " \t,".repeat(20000) + "x".repeat(20000);
  const t0 = Date.now();
  assert.equal(etagMatches(evil, 'W/"a-b"'), false);
  assert.ok(Date.now() - t0 < 1000, `took ${Date.now() - t0} ms`);
});
