import { test, expect } from '../fixtures/testSetup.js';
import { generateUniqueSsn, generateUniqueUsername } from '../utilities/dataParser.js';
import { isAuthenticated, registerFreshUser } from '../utilities/authHelper.js';

test.describe('Authentication & Account Creation', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test.afterEach(async ({ page, screenshotHelper }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await screenshotHelper.captureOnFailure(page);
    }
  });

  test('should display Customer Login form on landing page', async ({ loginPage, screenshotHelper, page }) => {
    await loginPage.verifyLoginFormVisible();
    await screenshotHelper.captureStep(page, { name: 'login-form-visible' });
  });

  test('should login successfully with valid credentials', async ({ loginPage, testData, page }) => {
    const sessionUser = await registerFreshUser(loginPage, testData);
    await loginPage.logout();

    await test.step('Enter credentials and login', async () => {
      await loginPage.login({
        username: sessionUser.username,
        password: sessionUser.password,
      });
    });

    await test.step('Verify welcome message on landing page', async () => {
      await expect(page.getByRole('heading', { name: 'Accounts Overview', level: 1 })).toBeVisible();
      await expect(loginPage.getWelcomeMessage()).toContainText(sessionUser.fullName);
      await loginPage.attachScreenshot('05 - Welcome message displayed');
    });
  });

  test('should show error message for invalid login credentials', async ({ loginPage, testData }) => {
    for (const invalidCred of testData.invalidCredentials) {
      await loginPage.open();
      await loginPage.login(invalidCred);
      await expect(loginPage.page.locator('body')).toContainText(
        /could not be verified|Please enter a username|internal error has occurred/i
      );
    }
  });

  test('should navigate to Register page from login panel', async ({ loginPage, page, screenshotHelper }) => {
    await loginPage.navigateToRegister();
    await expect(page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'register-page' });
  });

  test('should register a new user account successfully', async ({ loginPage, testData, page, screenshotHelper }) => {
    const username = generateUniqueUsername();
    const password = 'Pass123!';
    const registrationData = {
      ...testData.registration,
      ssn: generateUniqueSsn(),
    };

    await loginPage.navigateToRegister();
    await loginPage.registerUser(registrationData, username, password);
    await expect(loginPage.getRegistrationSuccessMessage()).toBeVisible();
    await expect(page.getByText(`Welcome ${registrationData.firstName} ${registrationData.lastName}`)).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'registration-success' });
  });

  test('should recover login info via customer lookup form', async ({ loginPage, testData, page, screenshotHelper }) => {
    const username = generateUniqueUsername();
    const password = 'Pass123!';
    const profile = {
      ...testData.registration,
      ssn: generateUniqueSsn(),
    };

    await loginPage.navigateToRegister();
    await loginPage.registerUser(profile, username, password);
    await expect(loginPage.getRegistrationSuccessMessage()).toBeVisible();
    await loginPage.logout();

    await loginPage.navigateToForgotLogin();
    await loginPage.submitCustomerLookup(profile);
    await expect(page.getByText(new RegExp(`Username:\\s*${username}`, 'i'))).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'lookup-result' });
  });

  test('should log out and return to Customer Login', async ({ loginPage, testData }) => {
    const sessionUser = await registerFreshUser(loginPage, testData);
    if (!(await isAuthenticated(loginPage))) {
      await loginPage.login({
        username: sessionUser.username,
        password: sessionUser.password,
      });
      await expect(loginPage.getWelcomeMessage()).toBeVisible();
    }
    await loginPage.logout();
    await expect(loginPage.customerLoginHeading).toBeVisible();
  });

  test('should display eight Account Services sidebar links when logged in', async ({ loginPage, testData }) => {
    await registerFreshUser(loginPage, testData);
    const links = loginPage.getAccountServiceLinks();
    expect(links).toHaveLength(8);
    for (const link of links) {
      await expect(link).toBeVisible();
    }
  });

  test('should reject registration when passwords do not match', async ({ loginPage, testData, page }) => {
    const username = generateUniqueUsername('mismatch');
    const profile = { ...testData.registration, ssn: generateUniqueSsn() };

    await loginPage.navigateToRegister();
    await loginPage.fillRegistrationWithMismatchedPassword(
      profile,
      username,
      'SecurePass1!',
      'DifferentPass2!'
    );
    await expect(page.getByText('Passwords did not match.')).toBeVisible();
  });

  test('should display customer lookup form fields on forgot login page', async ({ loginPage }) => {
    await loginPage.navigateToForgotLogin();
    await loginPage.verifyLookupFormFields();
  });

  test('should display ParaBank tagline on landing page', async ({ siteNavigationPage }) => {
    await expect(siteNavigationPage.tagline).toBeVisible();
  });
});
