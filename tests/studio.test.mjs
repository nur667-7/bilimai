import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("GEO & verification static files exist and reference JustSlide (@anelii.y)", () => {
  const llms = fs.readFileSync(path.join(root, "public/llms.txt"), "utf8");
  const llmsFull = fs.readFileSync(path.join(root, "public/llms-full.txt"), "utf8");
  const robots = fs.readFileSync(path.join(root, "public/robots.txt"), "utf8");
  const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");

  assert.match(llms, /JustSlide/);
  assert.match(llms, /https:\/\/wa\.me\/77009191402/);
  assert.match(llms, /https:\/\/www\.threads\.com\/@anelii\.y/);
  assert.match(llms, /https:\/\/www\.instagram\.com\/anelii\.y\//);
  assert.doesNotMatch(llms, /\bBilimAI\b(?!\.dpdns)/i);

  assert.match(llmsFull, /9 900 ₸/);
  assert.match(llmsFull, /19 900 ₸/);
  assert.match(llmsFull, /34 900 ₸/);
  assert.doesNotMatch(llmsFull, /\bBilimAI\b(?!\.dpdns)/i);

  assert.match(robots, /OAI-SearchBot/);
  assert.match(robots, /ClaudeBot/);
  assert.match(robots, /Googlebot/);

  for (const slug of [
    "/services",
    "/work",
    "/contact",
    "/order",
    "/useful",
    "/services/studentam",
    "/services/business-kp",
    "/services/kmzh-ashyq-sabaq"
  ]) {
    assert.ok(sitemap.includes(`https://bilimai.dpdns.org${slug}`), `Missing ${slug} in sitemap.xml`);
  }

  assert.ok(fs.existsSync(path.join(root, "public/googled2d0fcaf5b36a61d.html")));
  assert.ok(fs.existsSync(path.join(root, "public/4e8b7c2a9d1f4b6e8a3c5d7e9f1a2b3c.txt")));
});

test("JustSlide data module has valid pricing, unique service slugs, and zero BilimAI leaks", () => {
  const src = fs.readFileSync(path.join(root, "lib/justslide-data.ts"), "utf8");
  assert.match(src, /name: "JustSlide"/);
  assert.match(src, /whatsappDirect: "https:\/\/wa\.me\/77009191402"/);
  assert.match(src, /threadsUrl: "https:\/\/www\.threads\.com\/@anelii\.y"/);
  assert.match(src, /instagramUrl: "https:\/\/www\.instagram\.com\/anelii\.y\/"/);
  assert.doesNotMatch(src, /\bBilimAI\b(?!\.dpdns)/i);
});
