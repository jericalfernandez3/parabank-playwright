import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly $homePage: Locator

    constructor(pageForConstructor: Page) {
        this.page = pageForConstructor;
        this.$homePage = this.page.getByTestId(
            "home-page"
        )
    }

    async verifyAboutUsPage() {
        await this.page.locator('#headerPanel').getByRole('link', { name: 'About Us' }).click();
        await expect(this.page).toHaveTitle("ParaBank | About Us");
        await expect(this.page.getByText('For more information about')).toBeVisible();
    }

    async verifyServicesPage() {
        await this.page.locator('#headerPanel').getByRole('link', { name: 'Services' }).click();
        await expect(this.page).toHaveTitle("ParaBank | Services");
        await expect(this.page.getByText('Available Bookstore SOAP')).toBeVisible();
    }

    async verifyProductsPage() {
        await this.page.locator('#headerPanel').getByRole('link', { name: 'Products' }).click();
        await expect(this.page).toHaveTitle("Automated Software Testing Tools - Ensure Quality - Parasoft");
        await expect(this.page.locator('//p[@class="page-title" and contains(text(), "Products")]')).toBeVisible();
    }

    async verifyLocationsPage() {
        await this.page.locator('#headerPanel').getByRole('link', { name: 'Locations' }).click();
        await expect(this.page).toHaveTitle("Automated Software Testing Solutions For Every Testing Need");
        await expect(this.page.locator('//div[@class="page_body"]//p[contains(text(), "Solutions")]')).toBeVisible();
    }

    async verifyAdministrationPage() {
        await this.page.getByRole('link', { name: 'Admin Page' }).click();
        await expect(this.page).toHaveTitle("ParaBank | Administration");
        await this.page.getByRole('heading', { name: 'Administration' }).click();
    }

    async verifyGlobalNavigationPage() {
        await this.page.getByRole('link', { name: 'home', exact: true }).click();
        // Verify About Us page
        await this.verifyAboutUsPage();
        // Verify Services page
        await this.verifyServicesPage();
        // Verify Products page
        await this.verifyProductsPage();
        await this.page.goBack();
        // Verify Locations page
        await this.verifyLocationsPage();
        await this.page.goBack();
        // Verify Administration page
        await this.verifyAdministrationPage();
    }

    async navigateToAnyAccountService(accountService: string) {
        await this.page.getByRole('link', { name: accountService }).click();
        await this.page.waitForResponse((response) => response.url().includes('accounts') && response.status() === 200, { timeout: 10000 });
    }

    async createBankAccount() {
        // Get the first account number
        await this.page.locator('#type').selectOption('1');
        await this.page.getByRole('button', { name: 'Open New Account' }).click();
        // Validate if the user is able to create a new account successfully
        await expect(this.page.getByText('Congratulations, your account')).toBeVisible();
        await expect(this.page.getByText('Your new account number:')).toBeVisible();
        // Get the new account number
        const newAccountNumber = (await this.page.locator('#newAccountId').textContent() || '').trim();
        // Return new account number    
        return newAccountNumber;
    }

    async getFirstAccountNumber() {
        const firstAccountNumber = (await this.page.locator('//table[@id="accountTable"]//td/a').first().textContent() || '').trim();
        return firstAccountNumber;
    }

    async getFirstAccountNumberBalance() {
        const rawBalance = (await this.page.locator('//table[@id="accountTable"]//td').nth(1).textContent())?.trim();
        const balance = parseFloat(rawBalance?.replace('$', '').replace(',', '') || '0');
        return balance;
    }

    async getMinimumAmountToOpenNewAccount() {
        const rawMinimumAmount = (await this.page.locator('//div[@id="openAccountForm"]//select[@id="type"]//following-sibling::p/b').textContent()|| '').trim();
        const match = rawMinimumAmount.match(/\$([\d,.]+)/);    // This regex will look for a dollar sign followed by digits
        const minimumAmount = match ? parseFloat(match[1].replace(',', '')) : 0;
        return minimumAmount;
    }

    async getNewAccountNumberBalance() {
        const rawBalance = (await this.page.locator('//table[@id="accountTable"]//td').nth(4).textContent())?.trim();
        const balance = parseFloat(rawBalance?.replace('$', '').replace(',', '') || '0');
        return balance;
    }

    async selectTransferFundFromAccount(fromAccount: string) {
        await this.page.locator('#fromAccountId').selectOption(fromAccount);
    }

    async selectTransferFundToAccount(toAccount: string) {
        await this.page.locator('#toAccountId').selectOption(toAccount);
    }

    async enterTransferFundsAmount(amount: string) {
        await this.page.locator('#amount').fill(amount);
    }

    async transactFundTransfer(fromAccount: string, toAccount: string, amount: string) {
        await this.navigateToAnyAccountService('Transfer Funds')
        await this.selectTransferFundFromAccount(fromAccount)
        await this.selectTransferFundToAccount(toAccount)
        await this.enterTransferFundsAmount(amount)
        await this.page.getByRole('button', { name: 'Transfer' }).click();
        // Validate Successful Fund Transfer
        await expect(this.page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
        await expect(this.page.locator('//div[@id="showResult"]/p').first()).toHaveText('$' + amount + '.00  has been transferred from account #' + fromAccount + ' to account #' + toAccount + '.');
    }

    async enterPayeeName(payeeName: string) {
        await this.page.locator('input[name="payee\\.name"]').fill(payeeName);
    }

    async enterPayeeAddress(address: string) {
        await this.page.locator('input[name="payee\\.address\\.street"]').fill(address);
    }

    async enterPayeeCity(city: string) {
        await this.page.locator('input[name="payee\\.address\\.city"]').fill(city);
    }

    async enterPayeeState(state: string) {
        await this.page.locator('input[name="payee\\.address\\.state"]').fill(state);
    }

    async enterPayeeZipCode(zipCode: string) {
        await this.page.locator('input[name="payee\\.address\\.zipCode"]').fill(zipCode);
    }
    
    async enterPayeePhoneNumber(phoneNumber: string) {
        await this.page.locator('input[name="payee\\.phoneNumber"]').fill(phoneNumber);
    }

    async enterPayeeAccountNumber(accountNumber: string) {
        await this.page.locator('input[name="payee\\.accountNumber"]').fill(accountNumber);
    }

    async enterPayeeAccountVerifyNumber(verifyAccountNumber: string) {
        await this.page.locator('input[name="verifyAccount"]').fill(verifyAccountNumber);
    }

    async enterPayBillsAmount(amount: string) {
        await this.page.locator('input[name="amount"]').fill(amount);
    }

    async selectBillsPayFromAccount(accountNumber: string) {
        await this.page.locator('select[name="fromAccountId"]').selectOption(accountNumber);
    }

    async transactPayBills(payeeName: string, address: string, city: string, state: string, zipCode: string, phoneNumber: string, toAccountNumber: string, amount: string, fromAccountNumber: string) {
        await this.page.getByRole('link', { name: 'Bill Pay' }).click();
        await this.enterPayeeName(payeeName);
        await this.enterPayeeAddress(address);
        await this.enterPayeeCity(city);
        await this.enterPayeeState(state);
        await this.enterPayeeZipCode(zipCode);
        await this.enterPayeePhoneNumber(phoneNumber);
        await this.enterPayeeAccountNumber(toAccountNumber);
        await this.enterPayeeAccountVerifyNumber(toAccountNumber);
        await this.enterPayBillsAmount(amount);
        await this.selectBillsPayFromAccount(fromAccountNumber);

        const headingLocator = this.page.getByRole('heading', { name: 'Bill Payment Complete' });
        for (let i = 0; i < 5; i++) { // Retry up to 5 times (~1 second interval)
            const count = await headingLocator.count();
            if (count === 1) {
              break;
            }
            await this.page.getByRole('button', { name: 'Send Payment' }).click();
            await this.page.waitForTimeout(3000); // Wait 1 second before next click
          }

        // Validate Successful Bill Payment
        await expect(this.page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
        const confirmationText = (await this.page.locator('//div[@id="billpayResult"]/p').first().textContent())?.trim();
        expect(confirmationText).toBe(`Bill Payment to ${payeeName} in the amount of $${amount}.00 from account ${fromAccountNumber} was successful.`);
    }

}
