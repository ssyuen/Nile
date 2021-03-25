<p align="center">
  <a href="https://www.nilebookstore.com" target="_blank">
    <img src="static/images/Misc/Nile Dark Text Rectangular.png">
  </a>
  https://www.nilebookstore.com
</p>

# Introduction
Nile is a bookstore made with a variety of development tools. It features a responsive and material
design which differs from many sites today, but presents a unique UI/UX offering.

### Disclaimer
Disclaimer! This site should **not** be used to fulfil any purchases with valid banking information. The Nile website lacks
robust security standards and industry compliance protocols, while relying only on rudimentary protections.
This site was made to fulfill our term-project requirement for CSCI 4050 - Software Engineering class at The University of Georgia.

All product information including ISBN, publisher, and cover images was taken from Amazon.com. We claim no ownership for any information. 
All rights go to their respective owner(s). Any information on nilebookstore.com inconsistent to its representation on Amazon is purely unintentional, 
originating from errors or faults in retrieving information by our team.

## Implemented Features
Features were developed using stories, epics, various diagrams, and delivered in an Agile fashion through a series
of project deliverables.

- Home Page
    - Search by Title
    - Search by ISBN
    - Search by Category
    - Multi-page layout
- Product Page
    - Comprehensive and well-formed layout
    - Simple add to Cart
- Shopping Cart
    - "Always-on" Cart display on Navbar
    - Remove from Cart
    - Quantity management (max: 80)
        - Total and individual price
    - Multi-page layout
    - Sub-total
    - Single path Checkout (checkout only from shopping cart)
- Registration
    - Email based
    - Add optional billing address
        - Credit card recognition
    - Add optional shipping address
    - Sensitive data encryption
    - Email verification
- Login
    - Remember password (session management)
    - Forgot my password
        - Email verification
- Profile
    - Account Overview
        - Ordered items
        - Delivered items
        - View/Edit name
        - View email
        - Recent orders
    - Change Name
    - Change Password
        - Password confirmation
        - Sensitive data encryption
    - Order History
        - Unique confirmation numbers
        - Comprehensive and well-formed layout
        - Multi-page layout
        - Per-order Grand Total, Shipping Cost, and Sales Tax
        - Reorder Item
    - Manage Shipping Address
        - Edit shipping address
        - Add multiple shipping addresses
    - Manage Billing Address
        - Add multiple billing addresses
        - Credit card recognition
        - Sensitive data encryption
    - Email Settings
        - Unsubscribe from future promotions email notifications
- Checkout
    - Shipping Information
        - Choose from saved address
        - Remember address option
        - United States postal code support
    - Billing Information
        - Choose from saved payment method
        - Remember payment method option
        - United States postal code support
    - Sticky Sidebar
        - Displays Shopping Cart
            - Product name, price, ISBN, and quantity
        - Subtotal
        - Shipping Cost (for GA and CA only)
        - Sales Tax (for GA and CA only)
        - Grand Total
        - Back to Cart option
    - Review Order
        - Edit shipping information
        - Edit billing information
        - Redeem promo code
    - Session management
    - Email confirmation
- Admin Profile
    - Admin detection
    - Checkout and Cart inability
    - Change Name
    - Change Password
        - Password confirmation
        - Sensitive data encryption
    - Manage Books and Inventory
        - Search inventory by title or ISBN
        - Edit all properties of product
        - Add product to existing inventory
        - Remove product from existing inventory
    - Manage Promotions
        - Edit promotion
        - Add promotion
        - Remove promotion
            - Automatic promotion expiration
    - Manage Users
        - Promote user to admin
        - Delete user
    - Email Settings
        - Unsubscribe from future promotions email notifications
- Overall
    - Material design
    - Highly responsive layout
    - Session awareness
    - UI/UX centric features
    - Accessibility
    
# Screenshots

## User Platform
![Nile Home page](demo/Homepage.PNG)

![Nile Login page](demo/Login.PNG)  

![Nile Sign Up page](demo/SignUp.PNG)  

![Nile Sign Up page demo](demo/SignUpInfo.PNG)  

![Nile Profile page](demo/Profile.PNG)  

![Nile Order History page](demo/OrderHistory.PNG)  

![Nile Order Product page](demo/Product.PNG)  

![Nile Shopping Cart page](demo/ShoppingCart.PNG)  

![Nile Checkout-shipping page](demo/CheckoutShipping.PNG)  

![Nile Checkout-billing page](demo/CheckoutBilling.PNG)  

![Nile Checkout-review page](demo/CheckoutReview.PNG)  

![Nile Order History page](demo/PostCheckoutOrderHistory.PNG)  

![Nile Footer](demo/Footer.PNG) 

![Nile Footer Alternate](demo/FooterAlt.PNG)

### Responsive Design
Responsiveness shown through an iPhone X.

![Nile iPhone Profile page](demo/iPhone/iPhoneProfile.PNG)
![Nile iPhone Product page](demo/iPhone/iPhoneProduct.PNG)

## Admin Platform

![Nile Admin Profile page](demo/AdminProfile.PNG) 

![Nile Create Promotions page](demo/CreatePromotions.PNG) 

## Initial Mockups
These mockups were designed prior to backend development as a prototype for the user interface. Our
goal was to create a high-fidelity wireframe for the deliverable. We recorded any drawbacks and
altered the pages. These mockups evolved into the designs under the "Screenshots" header above.

![Nile Mockup Home page](demo/mock/Homepage.PNG)

![Nile Mockup Registration page](demo/mock/Registration.PNG)  

![Nile Mockup Shopping Cart page](demo/mock/ShoppingCart.PNG)  

![Nile Mockup Profile page](demo/mock/Profile.PNG) 

## EER Diagram
Our was database schema was designed and implemented in MySQL. We strived to make the schema design
comprehensive and sensible within the requirement constraints. The EER diagram is displayed below.

![Nile Schema design](demo/diagram/NILE_DB_EER.png)

# Execution Instructions

## Requirements

The following is required to run this project:

- Python 3.7
  - Using pip3 (or pip if you default to Python 3.7), install pipenv using this command: `pip3 install pipenv` or `pip install pipenv`.
    - If you have trouble running this or get Permission denied, then try the following: `pip install pipenv -u`

## Execution

1. If you are on windows, run the following command in Powershell to set up the appropriate environment variables:
``Set-Content ./.env "DB=niledb`nDB_HOST=localhost`nMAIL_SERVER=smtp.gmail.com`nMAIL_PORT=465`nMAIL_USER=rootatnilebookstore@gmail.com`nMAIL_PASS=Testing1"``
where the `` `n `` is the newline break.

2. If you are on mac or some variant of linux, run the following command to set up the appropriate environment variables:
`printf "DB=niledb\nDB_HOST=localhost\nMAIL_SERVER=smtp.gmail.com\nMAIL_PORT=465\nMAIL_USER=rootatnilebookstore@gmail.com\nMAIL_PASS=Testing1" > .env`

3. Clone this repository to your local via git clone <hhttps://github.com/ssyuen/Nile.git>

4. Install MySql. Create a schema name `niledb`. Run the `NileDB8.0.sql` and `NileDB8.1.sql` script to create the necessary tables.

5. cd into the cloned directory

6. `pipenv shell` will activate the virtual environment.

7. `pipenv install` will install the dependencies (i.e. flask and pandas)

8. If you are on windows, run this to start the server: `pipenv run windows_server`
   If you are on mac or some variant of linux, run this to start the server: `pipenv run server`

9. Make sure when you are done with development, run `exit` to exit out of the virtual environment.
This is important to make sure you will not have to delete and re-clone the repository.
