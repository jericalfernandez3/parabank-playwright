import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(pageForConstructor: Page) {
        this.page = pageForConstructor;
    }

    // -- Locator variables
    registerLinkButton = () => this.page.getByRole('link', { name: 'Register' });
    firstNameInput = () => this.page.locator('[id="customer\\.firstName"]');
    lastNameInput = () => this.page.locator('[id="customer\\.lastName"]');
    streetInput = () => this.page.locator('[id="customer\\.address\\.street"]');
    cityInput = () => this.page.locator('[id="customer\\.address\\.city"]');
    stateInput = () => this.page.locator('[id="customer\\.address\\.state"]');
    zipCodeInput = () => this.page.locator('[id="customer\\.address\\.zipCode"]');
    phoneNumberInput = () => this.page.locator('[id="customer\\.phoneNumber"]');
    ssnInput = () => this.page.locator('[id="customer\\.ssn"]');
    usernameInput = () => this.page.locator('[id="customer\\.username"]');
    passwordInput = () => this.page.locator('[id="customer\\.password"]');
    repeatedPasswordInput = () => this.page.locator('#repeatedPassword');
    registerButton = () => this.page.getByRole('button', { name: 'Register' });
    successMessage = () => this.page.getByRole('heading', { name: 'Welcome' });

    // -- Methods
    async goto() {
        const url = process.env.url as string;
        await this.page.goto(url);
        await expect(this.page).toHaveTitle("ParaBank | Welcome | Online Banking");
    }

    async registerUser(firstName: string, lastName: string, street: string, city: string, state: string, zipCode: string, phoneNumber: string, ssn: string, username: string, password: string) {
        await this.goto();
        await this.registerLinkButton().click();
        await this.firstNameInput().fill(firstName);
        await this.lastNameInput().fill(lastName);
        await this.streetInput().fill(street);
        await this.cityInput().fill(city);
        await this.stateInput().fill(state);
        await this.zipCodeInput().fill(zipCode);
        await this.phoneNumberInput().fill(phoneNumber);
        await this.ssnInput().fill(ssn);
        await this.usernameInput().fill(username);
        await this.passwordInput().fill(password);
        await this.repeatedPasswordInput().fill(password);
        await this.registerButton().click();
        //Validate if the user is registered successfully
        await expect(this.page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
        await expect(this.successMessage()).toBeVisible();
    }

}