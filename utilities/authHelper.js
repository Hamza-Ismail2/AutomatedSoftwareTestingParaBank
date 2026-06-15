import { expect } from '@playwright/test';
import { generateUniqueSsn, generateUniqueUsername } from './dataParser.js';
import { logger } from './logger.js';

export async function isAuthenticated(loginPage) {
  return loginPage.getWelcomeMessage().isVisible().catch(() => false);
}

export async function registerFreshUser(loginPage, testData) {
  const username = generateUniqueUsername('auto');
  const password = 'Pass123!';
  const profile = {
    ...testData.registration,
    ssn: generateUniqueSsn(),
  };
  const fullName = `${profile.firstName} ${profile.lastName}`;

  await loginPage.navigate('/register.htm');
  await expect(loginPage.page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible();
  await loginPage.registerUser(profile, username, password);
  await expect(loginPage.getRegistrationSuccessMessage()).toBeVisible({ timeout: 30000 });
  await expect(loginPage.getWelcomeMessage()).toContainText(profile.firstName, { timeout: 30000 });
  logger.info(`Registered session user: ${username}`, 'authHelper');
  return { username, password, fullName };
}

export async function establishAuthenticatedSession(page, loginPage, testData) {
  await loginPage.open();
  await loginPage.login(testData.validUser);

  if (await isAuthenticated(loginPage)) {
    logger.info(`Authenticated as ${testData.validUser.username}`, 'authHelper');
    return { username: testData.validUser.username, fullName: testData.validUser.fullName };
  }

  logger.warn('Demo user login unavailable — registering a fresh session user', 'authHelper');
  const sessionUser = await registerFreshUser(loginPage, testData);
  return { username: sessionUser.username, fullName: sessionUser.fullName };
}

export async function loginAndAwaitOutcome(loginPage, credentials) {
  await loginPage.login(credentials);
  await expect(
    loginPage.getWelcomeMessage()
      .or(loginPage.errorMessage)
      .or(loginPage.page.getByRole('heading', { name: 'Error!' }))
      .first()
  ).toBeVisible({ timeout: 20000 });
}
