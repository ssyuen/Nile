from locust import HttpLocust, between, TaskSet, task


class Register(TaskSet):
    DEFAULT_REGISTER_INPUTS = ['inputFirstName',
                               'inputLastName', 'inputEmail', 'inputPassword']
    SHIPPING_INPUTS = ['addAddressStreetAddress', 'addAddressApartmentOrSuite',
                       'addZipcode', 'addAddressCity', 'addAddressState', 'addAddressCountry']
    PAYMENT_INPUTS = ['cardHolderFirstName', 'cardHolderLastName', 'ccn', 'ccexp', 'CCNProvider', 'billingStreetAddress',
                      'billingApartmentOrSuite', 'billingZipcode', 'billingCity', 'billingState', 'billingCountry']
    @task
    def register(self):
        self.client.post('/register/', {'inputFirstName': ''})


class Login(TaskSet):
    pass


class RegisterUser(HttpLocust):
    task_set = Register
    wait_time = between(5, 10)
