<p align="center">
  <a href="https://www.nilebookstore.com" target="_blank">
    <img src="static/images/Misc/Nile Dark Text Rectangular.png">
  </a>
  https://www.nilebookstore.com
</p>

# DELIVERABLE 6 EXECUTION INSTRUCTIONS AND REQUIREMENTS

## REQUIREMENTS

The following is required to run this project:

- Python 3.7
  - Using pip3 (or pip if you default to Python 3.7), install pipenv using this command: `pip3 install pipenv` or `pip install pipenv`.
    - If you have trouble running this or get Permission denied, then try the following: `pip install pipenv -u`

## INSTRUCTIONS

1. Unzip/decompress the file

2. Go to INTO the directory of the unzipped file.'

3. If you are on windows, run the following command in Powershell to set up the appropriate environment variables:
``Set-Content ./.env "DB=niledb`nDB_HOST=localhost`nMAIL_SERVER=smtp.gmail.com`nMAIL_PORT=465`nMAIL_USER=rootatnilebookstore@gmail.com`nMAIL_PASS=Testing1``
where the `` `n `` is the newline break.

4. If you are on mac or some variant of linux, run the following command to set up the appropriate environment variables:
`printf "DB=niledb\nDB_HOST=localhost\nMAIL_SERVER=smtp.gmail.com\nMAIL_PORT=465\nMAIL_USER=rootatnilebookstore@gmail.com\nMAIL_PASS=Testing1" > .env`

5. If you are on windows, run this to start the server: `pipenv run windows_server`

6. If you are on mac or some variant of linux, run this to start the server: `pipenv run server`

## Installation

1. Clone this repository to your local via git clone <hhttps://github.com/ssyuen/Nile.git>

2. Install MySql. Create a schema name `niledb`. Run the `NileDBX.X.sql` script to create the necessary tables.

3. cd into the cloned directory

4. `pipenv shell` will activate the virtual environment.

5. `pipenv install` will install the dependencies (i.e. flask and pandas)

6. Make sure when you are done with development, run `exit` to exit out of the virtual environment.
This is important to make sure you will not have to delete and re-clone the repository.

### Testing

- [ ] Registration
  - [ ] Registration Form (Completeness, showing/indicating all mandatory/optional fields)
    - [ ] Form cannot be submitted with empty required fields FRONT END NEEDS TO BE LOOKED INTO BUT NO EFFECT ON BACKEND SO FAR
    - [ ] Input validation on credit card and zipcode
    - [x] Input validation on password and confirm password
    - [x] Input validation on email
    - [ ] If you click on Add Shipping Address, fill out fields in Address, then unclick Add Shipping Address, then shipping address is NOT submitted
      - [ ] Tables in question: address,  user_address
    - [ ] If you click on Add Payment Method, fill out fields in Payment, then unclick Add Payment Method, then payment method and billing address is NOT submitted
      - [ ] Tables in question: payment_method, user_address, address
  - [x] Sending the confirmation email
    - [x] Confirmation email should only verify the user once, so multiple clicks on verification link should not break application
  - [x] Test that user data is stored in the database with correct status (Active/Inactive)
    - [x] Tables in question: user, user_address, user_token, address, payment_method
- [ ] Login
  - [x] Login Form
  - [x] Forget my password (testing that the complete process is correct)
    - [x] Properly sends confirmation email with reset password link
      - [x] Confirmation link should only reset password once
  - [x] Testing for correct login functionality (as existing user, wrong password, admin/user navigate to the correct page based on privileges (customer or admin))
  - [ ] Remember me option works (BONUS)
- [x] Logout
  - [x] Session ended correctly
- [ ] Edit Profile
  - [ ] Edit Profile Form (Completeness and correctness)
    - [ ] Information should be pulled from the database and displayed on form.
    - Users may change:
      - [ ] First and Last Name
      - [ ] Billing Address
      - [ ] Password
      - [ ] Payment Card/Information
  - [ ] Users should NOT be able to modify the email address
  - [ ] Information should be saved in the database correctly.
    - [ ] Tables in question: user, payment_method, user_address
- [ ] Non-Functional Requirements
  - [ ] Usability (UI/UX)
    - [ ] The look and feel of the UI
    - [ ] Guidance
    - [ ] Helpful/Positive Prompts
    - [ ] Error Messages
      - List of errors
        - User tries to login with:
          - [x] Wrong email: `Your login details were not found. Please try again.`
          - [x] Wrong password: `Your login details were not found. Please try again.`
        - User tries to access:
          - [x] Login WITHOUT being verified: `You must verifiy your account before being able to login!`
          - [x] Admin areas/urls: `You need to be an admin to access that area!`
        - Admin tries to access:
          - [x] User specific areas: `Please login using a non-administrative account to access this feature.`
    - [ ] Confirmation Messages
      - [x] Registration confirmation page
  - [ ] Security Requirements
    - [ ] User Privileges (based points given during login process)
    - [x] Users should be asked to provide their current password if they selected to CHANGE their password
    - [x] Password and Payment Method/Information should be in encrypted in the database
    - [x] In case of changing profile information, send an email to the user that the profile has been changed (BONUS)

## Execution

- Assuming you are not in the virtual environment, go to the root directory of the project and run `pipenv run server`. This just runs the script without you having to start a virtual environment.

- To start the server, make sure you have done `pipenv shell` in the top-level directory of nile, and run `./start.sh`
- If `DB_USER` and `DB_PASS` are not found in the local machine environment variables, the shell script will prompt you
for it. Read the instructions at the top of the script.

## Todo List

- [ ] Back-end Development
  - [x] Registration
  - [x] Jinja2 with sessions in all html files
  - [x] If web user clicks on checkout, direct to login, redirect to checkout upon successful login
  - [x] Install third party libraries (bootstrap, JQuery, JS)
  - [ ] Books
    - [x] Manage Books
    - [ ] Manage Promotions
    - [ ] Manage Users
  - [x] User Profile
    - [x] Update My Info
      - [x] Individual Edit Buttons
      - [x] Update all fields
    - [x] Update Password
  - [x] Payment Info
    - [x] Individual Edit Buttons
    - [x] Update all fields
    - [x] Remove payment method
  - [x] Add Payment Info
  - [x] Billing Address
    - [x] Individual Edit Buttons
    - [x] Update all fields
    - [x] Remove address
  - [x] Add Address
  - [x] Search Bar
  - [ ] Shopping Cart
    - [ ] Fill Shopping Cart with user's items from database
    - [ ] Items should be tracked in users table with under items column
  - [x] Password Security
    - [x] Password hashing before entered into database
  - [x] Sign Out
- [x] Database Development
  - [x] Schema Creation
    - [x] Add field for if admin (necessary to differentiate drop down for My Admin Profile and just My Profile)
- [ ] Front-end Development
  - [x] About page
  - [ ] Promotions
    - [x] Expiration dates need to be added for admin
  - [ ] Scripting
    - [x] Required columns for address when the user chooses the optional
    - [x] Change active on Browse to unactive when About is clicked on
    - [x] Password & Confirm Password Restrictions
    - [ ] Shopping Cart
      - [ ] Cart Pricing needs to reflect price in cart
      - [ ] Increasing quantity of an item should dynamically increase Cart Pricing
      - [ ] Remove Item from cart
      - [ ] Number above Shopping Cart icon needs to adjust to the number of items in the cart dyanmically
    - [x] User Profile edit buttons (change from readonly state)
  - [ ] Custom Error pages
    - [ ] 404
    - [ ] 400
    - [ ] 500
