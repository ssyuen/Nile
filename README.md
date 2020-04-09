<p align="center">
  <img src="static/images/Misc/Nile Dark Text Rectangular.png">
</p>

https://www.nilebookstore.com

## DELIVERABLE 6 EXECUTION INSTRUCTIONS AND REQUIREMENTS

### REQUIREMENTS

The following is required to run this project:

- Python 3.7
  - Using pip3 (or pip if you default to Python 3.7), install pipenv using this command: `pip3 install pipenv` or `pip install pipenv`.
    - If you have trouble running this or get Permission denied, then try the following: `pip install pipenv -u`

### INSTRUCTIONS

1. Unzip/decompress the file

2. Go to INTO the directory of the unzipped file.'

3. If you are on windows, run the following command to set up the appropriate environment variables: `TYPE CON "DB=niledb\nDB_HOST=localhost\nMAIL_SERVER=smtp.gmail.com\nMAIL_PORT=465\nMAIL_USER=rootatnilebookstore@gmail.com\nMAIL_PASS=Testing1" > .env`

4. If you are on mac or some variant of linux, run the following command to set up the appropriate environment variables: `printf "DB=niledb\nDB_HOST=localhost\nMAIL_SERVER=smtp.gmail.com\nMAIL_PORT=465\nMAIL_USER=rootatnilebookstore@gmail.com\nMAIL_PASS=Testing1" > .env`

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

## Execution

- Assuming you are not in the virtual environment, go to the root directory of the project and run `pipenv run server`. This just runs the script without you having to start a virtual environment.


- To start the server, make sure you have done `pipenv shell` in the top-level directory of nile, and run `./start.sh`
- If `DB_USER` and `DB_PASS` are not found in the local machine environment variables, the shell script will prompt you
for it. Read the instructions at the top of the script.

## Todo List

- [ ] Back-end Development
  - [x] Registration
  - [x] Jinja2 with sessions in all html files
  - [ ] If web user clicks on checkout, direct to login, redirect to checkout upon successful login
  - [x] Install third party libraries (bootstrap, JQuery, JS)
  - [ ] Books
    - [x] Add Books
    - [ ] Manage Books
    - [ ] Add Promotions
    - [ ] Manage Promotions
    - [ ] Manage Users
  - [ ] User Profile
    - [x] Update My Info
      - [x] Individual Edit Buttons
      - [x] Update all fields
    - [x] Update Password
  - [ ] Payment Info
    - [ ] Individual Edit Buttons
    - [ ] Update all fields
    - [x] Remove payment method
  - [x] Add Payment Info
  - [ ] Billing Address
    - [ ] Individual Edit Buttons
    - [x] Update all fields
    - [x] Remove address
  - [x] Add Address
  - [ ] Search Bar
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
    - [ ] Expiration dates need to be added for admin
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
