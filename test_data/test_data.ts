// Test Data for unique username
const now = new Date();
export const generateUsernameData = {
  month: String(now.getMonth() + 1).padStart(2, '0'),
  day: String(now.getDate()).padStart(2, '0'),
  year: now.getFullYear(),
  hours: String(now.getHours()).padStart(2, '0'),
  minutes: String(now.getMinutes()).padStart(2, '0'),
  seconds: String(now.getSeconds()).padStart(2, '0'),
  milliseconds: now.getMilliseconds(),
  generatedUsername: `qa${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getFullYear()}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}${now.getMilliseconds()}`
}

// Test Data for Register User
export const registerUserData = {
    firstName: "John",
    lastName: "Doe",
    street: "123 Main St",
    city: "Los Angeles",
    state: "California",
    zipCode: "30006",
    phoneNumber: "9999999999",
    ssn: "123456789",
  };

// Test Data for Fund Transfer
export const fundTransferData = {
    amount: "20",
  };

// Test Data for Pay Bill
export const payBillData = {
    payeeName: "John Doe",
    address: "321 Main St",
    city: "San Diego",
    state: "California",
    zipCode: "10006",
    phoneNumber: "8888888888",
    amount: "10",
    transactionType: "Debit",
  };