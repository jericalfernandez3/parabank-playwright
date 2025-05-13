import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    constructor(pageForConstructor: Page) {
        this.page = pageForConstructor;
    }

    // -- Locator variables
    globalNavigationMenu(linkName: string): Locator {
        return this.page.locator('#headerPanel').getByRole('link', { name: linkName });
    }
    genericTextLocator(headerText: string): Locator {
        return this.page.getByText(headerText);
    }
    productsPageHeaderText = () => this.page.locator('//p[@class="page-title" and contains(text(), "Products")]');
    locationPageHeaderText = () => this.page.locator('//div[@class="page_body"]//p[contains(text(), "Solutions")]');
    administrationPageHeaderText = () => this.page.getByRole('heading', { name: 'Administration' });
    homeButton = () => this.page.getByRole('link', { name: 'home' });
    accountServicesButton(accountService: string): Locator {
        return this.page.getByRole('link', { name: accountService });
    }
    savingsBankType = () => this.page.locator('#type').selectOption('1');
    openNewAccountButton = () => this.page.getByRole('button', { name: 'Open New Account' });
    newAccountNumber = () => this.page.locator('#newAccountId');
    firstAccountNumber = () => this.page.locator('//table[@id="accountTable"]//td/a').first();
    firstAccountNumberBalance = () => this.page.locator('//table[@id="accountTable"]//td').nth(1);
    minimumAmountToOpenNewAccount = () => this.page.locator('//div[@id="openAccountForm"]//select[@id="type"]//following-sibling::p/b');
    newAccountNumberBalance = () => this.page.locator('//table[@id="accountTable"]//td').nth(4);
    fundTransferFromAccount = () => this.page.locator('#fromAccountId');
    fundTransferToAccount = () => this.page.locator('#toAccountId');
    fundTransferAmount = () => this.page.locator('#amount');
    fundTransferButton = () => this.page.getByRole('button', { name: 'Transfer' })
    fundTransferSuccessMessage = () => this.page.locator('//div[@id="showResult"]/p');
    payeeName = () => this.page.locator('input[name="payee\\.name"]');
    payeeAddress = () => this.page.locator('input[name="payee\\.address\\.street"]');
    payeeCity = () => this.page.locator('input[name="payee\\.address\\.city"]');
    payeeState = () => this.page.locator('input[name="payee\\.address\\.state"]');
    payeeZipCode = () => this.page.locator('input[name="payee\\.address\\.zipCode"]');
    payeePhoneNumber = () => this.page.locator('input[name="payee\\.phoneNumber"]');
    payeeAccountNumber = () => this.page.locator('input[name="payee\\.accountNumber"]');
    payeeVerifyAccountNumber = () => this.page.locator('input[name="verifyAccount"]');
    payBillsAmount = () => this.page.locator('input[name="amount"]');
    billsPayFromAccount = () => this.page.locator('select[name="fromAccountId"]');
    sendPaymentButton = () => this.page.getByRole('button', { name: 'Send Payment' });
    billsPaymentSuccessMessageHeader = () => this.page.getByRole('heading', { name: 'Bill Payment Complete' });
    billsPaymentSuccessMessage = () => this.page.locator('//div[@id="billpayResult"]/p');

    // -- Methods
    async verifyAboutUsPage() {
        await this.globalNavigationMenu('About Us').click();
        await expect(this.page).toHaveTitle("ParaBank | About Us");
        await expect(this.genericTextLocator('For more information about')).toBeVisible();
    }

    async verifyServicesPage() {
        await this.globalNavigationMenu('Services').click();
        await expect(this.page).toHaveTitle("ParaBank | Services");
        await expect(this.genericTextLocator('Available Bookstore SOAP')).toBeVisible();
    }

    async verifyProductsPage() {
        await this.globalNavigationMenu('Products').click();
        await expect(this.page).toHaveTitle("Automated Software Testing Tools - Ensure Quality - Parasoft");
        await expect(this.productsPageHeaderText()).toBeVisible();
    }

    async verifyLocationsPage() {
        await this.globalNavigationMenu('Locations').click();
        await expect(this.page).toHaveTitle("Automated Software Testing Solutions For Every Testing Need");
        await expect(this.locationPageHeaderText()).toBeVisible();
    }

    async verifyAdministrationPage() {
        await this.globalNavigationMenu('Admin Page').click();
        await expect(this.page).toHaveTitle("ParaBank | Administration");
        await expect(this.administrationPageHeaderText()).toBeVisible();
    }

    async verifyGlobalNavigationPage() {
        await this.homeButton().first().click();
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
        await this.accountServicesButton(accountService).click();
        await this.page.waitForResponse((response) => response.url().includes('accounts') && response.status() === 200, { timeout: 10000 });
    }

    async createBankAccount() {
        // Get the first account number
        await this.savingsBankType();
        await this.openNewAccountButton().click();
        // Validate if the user is able to create a new account successfully
        await expect(this.genericTextLocator('Congratulations, your account')).toBeVisible();
        await expect(this.genericTextLocator('Your new account number:')).toBeVisible();
        // Get the new account number
        const newAccountNumber = (await this.newAccountNumber().textContent() || '').trim();
        // Return new account number    
        return newAccountNumber;
    }

    async getFirstAccountNumber() {
        const firstAccountNumber = (await this.firstAccountNumber().textContent() || '').trim();
        return firstAccountNumber;
    }

    async getFirstAccountNumberBalance() {
        const rawBalance = (await this.firstAccountNumberBalance().textContent())?.trim();
        const balance = parseFloat(rawBalance?.replace('$', '').replace(',', '') || '0');
        return balance;
    }

    async getMinimumAmountToOpenNewAccount() {
        const rawMinimumAmount = (await this.minimumAmountToOpenNewAccount().textContent()|| '').trim();
        const match = rawMinimumAmount.match(/\$([\d,.]+)/);    // This regex will look for a dollar sign followed by digits
        const minimumAmount = match ? parseFloat(match[1].replace(',', '')) : 0;
        return minimumAmount;
    }

    async getNewAccountNumberBalance() {
        const rawBalance = (await this.newAccountNumberBalance().textContent())?.trim();
        const balance = parseFloat(rawBalance?.replace('$', '').replace(',', '') || '0');
        return balance;
    }

    async selectTransferFundFromAccount(fromAccount: string) {
        await this.fundTransferFromAccount().selectOption(fromAccount);
    }

    async selectTransferFundToAccount(toAccount: string) {
        await this.fundTransferToAccount().selectOption(toAccount);
    }

    async enterTransferFundsAmount(amount: string) {
        await this.fundTransferAmount().fill(amount);
    }

    async transactFundTransfer(fromAccount: string, toAccount: string, amount: string) {
        await this.accountServicesButton('Transfer Funds').click();
        await this.selectTransferFundFromAccount(fromAccount)
        await this.selectTransferFundToAccount(toAccount)
        await this.fundTransferAmount().fill(amount);
        await this.fundTransferButton().click();
        // Validate Successful Fund Transfer
        await expect(this.genericTextLocator('Transfer Complete!')).toBeVisible();
        await expect(this.fundTransferSuccessMessage().first()).toHaveText('$' + amount + '.00  has been transferred from account #' + fromAccount + ' to account #' + toAccount + '.');
    }

    async enterPayeeName(payeeName: string) {
        await this.payeeName().fill(payeeName);
    }

    async enterPayeeAddress(address: string) {
        await this.payeeAddress().fill(address);
    }

    async enterPayeeCity(city: string) {
        await this.payeeCity().fill(city);
    }

    async enterPayeeState(state: string) {
        await this.payeeState().fill(state);
    }

    async enterPayeeZipCode(zipCode: string) {
        await this.payeeZipCode().fill(zipCode);
    }
    
    async enterPayeePhoneNumber(phoneNumber: string) {
        await this.payeePhoneNumber().fill(phoneNumber);
    }

    async enterPayeeAccountNumber(accountNumber: string) {
        await this.payeeAccountNumber().fill(accountNumber);
    }

    async enterPayeeAccountVerifyNumber(verifyAccountNumber: string) {
        await this.payeeVerifyAccountNumber().fill(verifyAccountNumber);
    }

    async enterPayBillsAmount(amount: string) {
        await this.payBillsAmount().fill(amount);
    }

    async selectBillsPayFromAccount(accountNumber: string) {
        await this.billsPayFromAccount().selectOption(accountNumber);
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

        const headingLocator = this.billsPaymentSuccessMessageHeader();
        for (let i = 0; i < 5; i++) { // Retry up to 5 times (~1 second interval)
            const count = await headingLocator.count();
            if (count === 1) {
              break;
            }
            await this.sendPaymentButton().click();
            await this.page.waitForTimeout(3000); // Wait 1 second before next click
          }

        // Validate Successful Bill Payment
        await expect(this.billsPaymentSuccessMessageHeader()).toBeVisible();
        const confirmationText = (await this.billsPaymentSuccessMessage().first().textContent())?.trim();
        expect(confirmationText).toBe(`Bill Payment to ${payeeName} in the amount of $${amount}.00 from account ${fromAccountNumber} was successful.`);
    }

}
