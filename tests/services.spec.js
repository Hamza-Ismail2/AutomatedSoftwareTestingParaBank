import { test, expect } from '../fixtures/testSetup';

test.describe('Customer Care & External Request Portals', () => {
  test.afterEach(async ({ page, screenshotHelper }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await screenshotHelper.captureOnFailure(page);
    }
  });

  test('should display Bill Pay form with payee fields', async ({ authenticatedPage, billPayPage, page, screenshotHelper }) => {
    void authenticatedPage;
    await billPayPage.open();
    await billPayPage.verifyFormVisible();
    await screenshotHelper.captureStep(page, { name: 'billpay-form' });
  });

  test('should submit bill payment successfully', async ({ authenticatedPage, billPayPage, testData, page, screenshotHelper }) => {
    void authenticatedPage;
    await billPayPage.open();
    await billPayPage.submitPayment(testData.billPay);
    await billPayPage.verifyPaymentSuccess();
    await screenshotHelper.captureStep(page, { name: 'billpay-success' });
  });

  test('should load Contact Us page with customer care form', async ({ contactPage, page, screenshotHelper }) => {
    await contactPage.openContactPage();
    await expect(page.getByRole('button', { name: 'Send to Customer Care' })).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'contact-page' });
  });

  test('should display Services page with ATM and Online service links', async ({ contactPage, page, screenshotHelper }) => {
    await contactPage.openServicesPage();
    await contactPage.verifyServicesContent();
    await screenshotHelper.captureStep(page, { name: 'services-page' });
  });

  test('should load Update Contact Info page for authenticated user', async ({ authenticatedPage, contactPage, testData, page, screenshotHelper }) => {
    void authenticatedPage;
    await contactPage.openUpdateProfilePage();
    await contactPage.updateContactInfo(testData.contactUpdate);
    await contactPage.verifyProfileUpdated();
    await screenshotHelper.captureStep(page, { name: 'profile-updated' });
  });
});