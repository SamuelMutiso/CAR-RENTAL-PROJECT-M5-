const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("response", (res) => {
    if (res.url().includes("wikimedia")) errors.push(`RESPONSE: ${res.url()} -> ${res.status()}`);
  });

  // log in as an existing client so /events/new (protected) is reachable
  await page.goto("http://127.0.0.1:5173/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "client1@gearshift.com");
  await page.fill('input[type="password"]', "client123");
  await page.click('button:has-text("Log in")');
  await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {});

  await page.goto("http://127.0.0.1:5173/events/new", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Plan your wedding convoy", { timeout: 10000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "/tmp/claude-1000/-home-derrick-gearshift-updated-/0b3e6e9f-dff1-4938-9a7c-e18bb8865c17/scratchpad/event_wedding.png" });

  // switch to funeral
  await page.click('button:has-text("Funeral")');
  await page.waitForSelector("text=Arrange a funeral convoy", { timeout: 10000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "/tmp/claude-1000/-home-derrick-gearshift-updated-/0b3e6e9f-dff1-4938-9a7c-e18bb8865c17/scratchpad/event_funeral.png" });

  console.log("DONE");
  console.log("EVENTS:", JSON.stringify(errors, null, 2));
  await browser.close();
})().catch((err) => { console.error("FAILED:", err); process.exit(1); });
