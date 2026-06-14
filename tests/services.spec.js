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

  test('should show confirmation after submitting contact inquiry', async ({ contactPage, testData, page, screenshotHelper }) => {
    const inquiry = testData.contactInquiry;
    await contactPage.openContactPage();
    await contactPage.submitContactForm(inquiry.name, inquiry.email, inquiry.phone, inquiry.message);
    await contactPage.expectContactSubmissionConfirmation();
    await screenshotHelper.captureStep(page, { name: 'contact-inquiry-sent' });
  });

  test('should display update profile form with editable fields for authenticated user', async ({
    authenticatedPage,
    contactPage,
    screenshotHelper,
    page,
  }) => {
    void authenticatedPage;
    await contactPage.openUpdateProfilePage();
    await contactPage.expectUpdateProfileFormReady();
    await screenshotHelper.captureStep(page, { name: 'profile-form-ready' });
  });

  test('should show loan approval or denial after submitting loan request', async ({
    authenticatedPage,
    requestLoanPage,
    testData,
    page,
    screenshotHelper,
  }) => {
    void authenticatedPage;
    await requestLoanPage.visit();
    await requestLoanPage.submitApplication(testData.loanRequest);
    await requestLoanPage.expectDecisionRendered();
    await screenshotHelper.captureStep(page, { name: 'loan-decision' });
  });

  test('should load About Us page with expected heading', async ({ aboutPage, page, screenshotHelper }) => {
    await aboutPage.visit();
    await expect(page.getByRole('heading', { name: 'ParaSoft Demo Website', level: 1 })).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'about-page' });
  });

  test('should load News page with expected heading', async ({ siteNavigationPage, page, screenshotHelper }) => {
    await siteNavigationPage.openNews();
    await expect(page.getByRole('heading', { name: 'ParaBank News', level: 1 })).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'news-page' });
  });

  test('should list Register link on site map page', async ({ siteNavigationPage }) => {
    await siteNavigationPage.openSiteMap();
    await expect(siteNavigationPage.sitemapRegisterLink).toBeVisible();
  });

  test('should return to login page via footer Home link', async ({ aboutPage, siteNavigationPage }) => {
    await aboutPage.visit();
    await siteNavigationPage.followFooterHomeLink();
  });

  test('should display loan request form controls for authenticated user', async ({
    authenticatedPage,
    requestLoanPage,
    page,
    screenshotHelper,
  }) => {
    void authenticatedPage;
    await requestLoanPage.visit();
    await expect(requestLoanPage.loanAmountInput).toBeVisible();
    await expect(requestLoanPage.applyButton).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'loan-form-controls' });
  });
});