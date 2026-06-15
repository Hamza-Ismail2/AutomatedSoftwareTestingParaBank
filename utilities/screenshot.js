import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

export class ScreenshotHelper {
  screenshotDir;

  constructor(testInfo) {
    this.testInfo = testInfo;
    this.screenshotDir = path.join(
      path.dirname(testInfo.outputDir),
      'screenshots',
      sanitizeFilename(testInfo.title)
    );
    fs.mkdirSync(this.screenshotDir, { recursive: true });
  }

  async captureStep(page, options) {
    const filePath = path.join(
      this.screenshotDir,
      `${Date.now()}_${sanitizeFilename(options.name)}.png`
    );
    await page.screenshot({ path: filePath, fullPage: options.fullPage ?? false });
    await this.testInfo.attach(`step-${options.name}`, {
      path: filePath,
      contentType: 'image/png',
    });
    logger.step(`Screenshot captured: ${options.name}`, this.testInfo.title);
    return filePath;
  }

  async captureOnFailure(page) {
    if (this.testInfo.status === this.testInfo.expectedStatus) {
      return undefined;
    }
    try {
      const filePath = path.join(this.screenshotDir, `FAILURE_${Date.now()}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      await this.testInfo.attach('failure-screenshot', {
        path: filePath,
        contentType: 'image/png',
      });
      logger.error(`Failure screenshot saved: ${filePath}`, this.testInfo.title);
      return filePath;
    } catch (error) {
      logger.warn(`Unable to capture failure screenshot: ${error}`, this.testInfo.title);
      return undefined;
    }
  }
}

function sanitizeFilename(value) {
  return value.replace(/[^a-z0-9_-]/gi, '_').substring(0, 80);
}

export function createScreenshotHelper(testInfo) {
  return new ScreenshotHelper(testInfo);
}