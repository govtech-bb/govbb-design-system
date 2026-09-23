import { createRequire } from 'node:module';
import { resolve } from 'node:path';

// Skills may be installed outside the service (or symlinked by npx skills).
export const projectRequire = createRequire(
  resolve(process.cwd(), 'package.json'),
);

export async function launchBrowser() {
  let chromium;
  for (const name of ['playwright', '@playwright/test']) {
    try {
      ({ chromium } = projectRequire(name));
      break;
    } catch {
      // Try the other supported Playwright package in the consumer project.
    }
  }
  if (!chromium) {
    console.error(
      `Could not load Playwright from ${process.cwd()}.\n` +
        'Install it in this project: npm install -D playwright\n' +
        'Then install Chromium: npx playwright install chromium',
    );
    process.exit(2);
  }
  try {
    return await chromium.launch();
  } catch (error) {
    console.error(
      `Could not launch Chromium: ${error.message}\n` +
        'Run npx playwright install chromium from this project, then retry.\n' +
        'The browser check did not run.',
    );
    process.exit(2);
  }
}
