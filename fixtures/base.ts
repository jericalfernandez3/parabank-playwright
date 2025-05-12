import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';

type EndToEndTestsFixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
};

export const test = base.extend<EndToEndTestsFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page))
    },    
})

export { expect } from '@playwright/test';