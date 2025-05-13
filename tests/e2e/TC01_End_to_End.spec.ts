import { expect, test } from "../../fixtures/base";
import { generateUsernameData, registerUserData, fundTransferData, payBillData } from "../../test_data/test_data";

// Test Variables
const username = generateUsernameData.generatedUsername;
const password = process.env.password as string;
const transaction_api_base_endpoint = process.env.transaction_api_base_endpoint as string;

test('End to end transaction', async ({ 
    loginPage,
    homePage,
    request
}) => {

    // ------------------------------ UI Test Scenarios ------------------------------ //
    // 1. Register a new user
    await loginPage.registerUser(
        registerUserData.firstName,
        registerUserData.lastName,
        registerUserData.street,
        registerUserData.city,
        registerUserData.state,
        registerUserData.zipCode,
        registerUserData.phoneNumber,
        registerUserData.ssn,
        username,
        password
    );

    // 2. Verify Global Navigation menu in home page is working as expected
    await homePage.verifyGlobalNavigationPage()

    // Get the account number and balance of the first account
    await homePage.navigateToAnyAccountService('Accounts Overview')
    const firstAccountPreviousBalance: number = await homePage.getFirstAccountNumberBalance()
    const firstAccountNumber = await homePage.getFirstAccountNumber()

    // Navigate to 'Open New Account' page
    await homePage.navigateToAnyAccountService('Open New Account')
    // Get the minimum amount to open a new account
    const minimumAmountToOpenNewAccount: number = await homePage.getMinimumAmountToOpenNewAccount()
    
    // 3. Create a new bank account (second account number)
    const newAccountNumber = await homePage.createBankAccount()

    // 4. Validate the previous and current balance of first account number
    await homePage.navigateToAnyAccountService('Accounts Overview')
    const firstAccountCurrentBalance: number = await homePage.getFirstAccountNumberBalance()    // -- current balance from UI
    const expectedFirstAccountCurrentBalance: number = firstAccountPreviousBalance - minimumAmountToOpenNewAccount;       // -- expected balance after creating new account
    expect(expectedFirstAccountCurrentBalance).toBe(firstAccountCurrentBalance)

    // Validate the second account number balance
    const newAccountNumberBalance: number = await homePage.getNewAccountNumberBalance()         // -- current balance from UI
    expect(newAccountNumberBalance).toBe(100.00)

    // 5. Transfer funds from first account to second account
    await homePage.transactFundTransfer(
        newAccountNumber,
        firstAccountNumber,
        fundTransferData.amount
    )
    
    // 6. Pay the bill using the second account
    await homePage.transactPayBills(
        payBillData.payeeName,
        payBillData.address,
        payBillData.city,
        payBillData.state,
        payBillData.zipCode,
        payBillData.phoneNumber,
        firstAccountNumber,
        payBillData.amount,
        newAccountNumber
    )

    // ------------------------------ API Test Scenarios ------------------------------ //
    // Encode username and password for Basic Authentication
    const base64Auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    // API endpoint
    const url = `${transaction_api_base_endpoint}/${newAccountNumber}/transactions/amount/${payBillData.amount}`;

    // API request
    const response = await request.get(url, {
        headers: {
            'Authorization': `Basic ${base64Auth}`
        }
    });
        
    // Validate status code is 200
    expect(response.status()).toBe(200);

    // Parsing API response
    const responseBody = await response.json();

    // Get API response details
    const accountId = String(responseBody[0].accountId);
    const type = responseBody[0].type;
    const amount = String(responseBody[0].amount);

    // Validate API response details
    expect(accountId).toBe(newAccountNumber);
    expect(type).toBe(payBillData.transactionType);
    expect(amount).toBe(payBillData.amount);
});