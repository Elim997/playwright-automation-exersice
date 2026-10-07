# Billing Widget - QA Answers

## a. Problems I found in the screen

### Security / payment flow

1. The screen seems to collect the card number directly in the form.
   If this is a regular input that sends the full card number to the company backend, it is risky. A safer flow would use a payment provider field that returns a token instead of sending the raw card number to our server.

2. There is no CVV field.
   For most online card payments, CVV is expected. Without it, the payment may fail or have weaker fraud protection.

3. Card Type is selected manually.
   The user can choose VISA but enter a Mastercard number. The system should detect the card type automatically from the card number.

4. There is no visible validation.
   I would expect validation for card number format, expiration date in the future, required fields, and postal code/address fields.

### Usability

5. The form tells the user “No dashes or spaces” for the card number.
   This is not ideal. Users often type card numbers with spaces. The system should accept it and clean the value internally.

6. Required fields are marked with `*`, but the mock-up does not show how errors are displayed.
   Good validation should show clear inline errors near the field.

7. The payment amount is `30.00` but no currency is shown.
   For a global SaaS company, this is confusing. It should show something like `USD 30.00`.

### Global / international usage

8. The address form looks US-focused.
   “State or Province” is required, but not every country uses states. Also, there is no country field, so the form cannot adapt to different address formats.

9. Postal code validation may be too strict.
   Some countries use letters, spaces, or dashes, and some countries do not use postal codes at all.

### Accessibility

10. Required fields are shown mainly with a red asterisk.
    I would also check that the fields are marked correctly for screen readers, for example with required attributes or aria attributes.

---

## b. Sample test cases

### TC-01 - Successful payment with valid details

**Steps:**

1. Open the Account Information screen.
2. Fill all required fields with valid card and billing details.
3. Select a future expiration month and year.
4. Click Continue.

**Expected result:**
The form is submitted successfully and the user moves to the next step or confirmation page.

---

### TC-02 - Missing required card number

**Steps:**

1. Fill all required fields except Card Number.
2. Click Continue.

**Expected result:**
The form should not submit. An error should appear near the Card Number field, and the user should understand what needs to be fixed.

---

### TC-03 - Invalid card details

**Steps:**

1. Select VISA.
2. Enter a card number that does not match VISA, or enter an invalid card number.
3. Select an expired date.
4. Click Continue.

**Expected result:**
The form should block submission and show a clear validation message before sending the payment request.

---

## c. Product solution for the most severe issue

The most severe issue is the possibility that the company is handling raw credit card numbers directly.

I would replace the custom card number and expiration fields with a secure payment provider component, for example Stripe Elements or Braintree Hosted Fields. The user still fills the card details inside the page, but the sensitive card data goes directly to the payment provider. The company backend receives only a token/payment method ID.

This reduces risk because our system does not store or process the full card number. It also helps with card validation, card brand detection, CVV support, and clearer payment errors.
