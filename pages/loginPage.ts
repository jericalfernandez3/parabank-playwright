import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly $loginPage: Locator

    constructor(pageForConstructor: Page) {
        this.page = pageForConstructor;
        this.$loginPage = this.page.getByTestId(
            "login-page"
        )
    }

    async goto() {
        const url = process.env.url as string;
        await this.page.goto(url);
        await expect(this.page).toHaveTitle("ParaBank | Welcome | Online Banking");
    }

    async registerUser(firstName: string, lastName: string, street: string, city: string, state: string, zipCode: string, phoneNumber: string, ssn: string, username: string, password: string) {
        await this.goto();
        await this.page.getByRole('link', { name: 'Register' }).click();
        await this.page.locator('[id="customer\\.firstName"]').fill(firstName);
        await this.page.locator('[id="customer\\.lastName"]').fill(lastName);
        await this.page.locator('[id="customer\\.address\\.street"]').fill(street);
        await this.page.locator('[id="customer\\.address\\.city"]').fill(city);
        await this.page.locator('[id="customer\\.address\\.state"]').fill(state);
        await this.page.locator('[id="customer\\.address\\.zipCode"]').fill(zipCode);
        await this.page.locator('[id="customer\\.phoneNumber"]').fill(phoneNumber);
        await this.page.locator('[id="customer\\.ssn"]').fill(ssn);
        await this.page.locator('[id="customer\\.username"]').fill(username);
        await this.page.locator('[id="customer\\.password"]').fill(password);
        await this.page.locator('#repeatedPassword').fill(password);
        await this.page.getByRole('button', { name: 'Register' }).click();
        //Validate if the user is registered successfully
        await expect(this.page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
        await expect(this.page.getByText('Your account was created')).toBeVisible();
    }

}
