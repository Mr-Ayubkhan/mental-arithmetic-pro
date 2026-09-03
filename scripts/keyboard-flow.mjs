import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const cases = [
  { route: "/algebra", answer: "5" },
  { route: "/geometriya", answer: "14" },
  { route: "/trigonometriya", answer: "0.5" },
];

for (const testCase of cases) {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:3000${testCase.route}`, { waitUntil: "networkidle" });
  const input = page.getByLabel("Mavzu javobi");
  await input.focus();
  const firstQuestion = await page.locator("h2").textContent();
  await input.fill(testCase.answer);
  await page.keyboard.press("Enter");
  await page.getByText(/To‘g‘ri!/).waitFor();
  await page.keyboard.press("Enter");
  const nextQuestion = await page.locator("h2").textContent();
  if (!firstQuestion || !nextQuestion || firstQuestion === nextQuestion) {
    throw new Error(`Keyboard flow failed for ${testCase.route}`);
  }
  console.log(`${testCase.route}: Enter submits and advances (${firstQuestion} -> ${nextQuestion})`);
  await page.close();
}

const home = await browser.newPage();
await home.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
const homeInput = home.getByLabel("Javob");
await homeInput.focus();
await homeInput.fill("0");
await home.keyboard.press("Enter");
await home.getByText("Formula:").waitFor();
console.log("/: Enter shows formula feedback for a wrong answer");
await home.keyboard.press("Enter");
await home.close();

const glossary = await browser.newPage();
await glossary.goto("http://127.0.0.1:3000/geometriya-lugati", { waitUntil: "networkidle" });
const search = glossary.getByPlaceholder("Masalan: radius");
await search.focus();
await search.fill("radius");
await glossary.getByText("Radius").waitFor();
console.log("/geometriya-lugati: keyboard search finds Radius");
await glossary.close();

await browser.close();
