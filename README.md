<p align="center">
  <img src="static/images/NileLg.png">
</p>

# Site
https://www.nilebookstore.com

- LET SAM KNOW IF YOU NEED HIM TO PULL CHANGES TO MASTER ON HOSTING SERVER

## Execution

- DO NOT TEST ANYTHING ON THE ACTUAL WEBSITE AS SAM HAS NOT ADDED APPROPRIATE ENV VARS.
- Before execution, add `DB_USER` and `DB_PASS` to the local machine environment variables. This represents your
MySql local instance's username and password
- To start the server, make sure you have done `pipenv shell` in the top-level directory of nile, and run `./start.sh`

## Installation

1. Clone this repository to your local via git clone <hhttps://github.com/ssyuen/Nile.git>

2. cd into the cloned directory

3. `pipenv shell` will activate the virtual environment.

4. `pipenv install` will install the dependencies (i.e. requests.py and pandas)

5. Make sure when you are done with development, run `exit` to exit out of the virtual environment. This is important to make sure you will not have to delete and re-clone the repository.

## Todo List

- [ ] Back-end Development
  - [ ] Registration
  - [ ] Jinja2 with sessions in all html files
  - [ ] If web user clicks on checkout, direct to login, redirect to checkout upon successful login
  - [ ] Books
    - [ ] TBA
  - [ ] User Profile
    - [ ] Update My Info
      - [ ] Individual Edit Buttons
      - [ ] Update all fields
    - [ ] Update Password
  - [ ] Payment Info
    - [ ] Individual Edit Buttons
    - [ ] Update all fields
    - [ ] Remove payment method
  - [ ] Add Payment Info
  - [ ] Billing Address
    - [ ] Individual Edit Buttons
    - [ ] Update all fields
    - [ ] Remove address
  - [ ] Add Address
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
  - [ ] About page
  - [ ] Shopping Cart
    - [ ] Cart Pricing needs to reflect price in cart
    - [ ] Increasing quantity of an item should dynamically increase Cart Pricing
    - [ ] Remove Item from cart
    - [ ] Number above Shopping Cart icon needs to adjust to the number of items in the cart dyanmically
  - [ ] Promotions
    - [ ] Expiration dates need to be added
  - [ ] Custom Error pages
    - [ ] 404
    - [ ] 400
    - [ ] 500
