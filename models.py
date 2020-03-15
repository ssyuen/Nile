from server import db

from sqlalchemy import Column, Date, Float, ForeignKey, Index, String, Table, Time, text
from sqlalchemy.dialects.mysql import INTEGER, LONGBLOB
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Admin(db.Model):
    __tablename__ = 'Admin'
    __table_args__ = (
        db.Index('Key', 'firstname', 'lastname', 'pw'),
    )

    email = db.Column(db.String(45, 'utf8mb4_general_ci'), primary_key=True, unique=True)
    firstname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)
    lastname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)
    pw = db.Column(db.String(100, 'utf8mb4_general_ci'), nullable=False)


class Address(db.Model):
    __tablename__ = 'address'
    __table_args__ = (
        db.Index('Key', 'street', 'city', 'state', 'zip'),
    )

    addressID = db.Column(db.Integer(), primary_key=True)
    street = db.Column(db.String(45, 'utf8mb4_general_ci'))
    city = db.Column(db.String(45, 'utf8mb4_general_ci'))
    state = db.Column(db.String(45, 'utf8mb4_general_ci'))
    zip = db.Column(db.String(45, 'utf8mb4_general_ci'))


class Binding(db.Model):
    __tablename__ = 'binding'

    bindingID = db.Column(db.Integer(), primary_key=True)
    binding = db.Column(db.String(45, 'utf8mb4_general_ci'))


class Genre(db.Model):
    __tablename__ = 'genre'

    genreID = db.Column(db.Integer(), primary_key=True)
    genre = db.Column(db.String(45, 'utf8mb4_general_ci'))


class Payment(db.Model):
    __tablename__ = 'payment'
    __table_args__ = (
        db.Index('Key', 'cardNumber', 'address', 'expirationDate'),
    )

    paymentID = db.Column(db.Integer(), primary_key=True)
    cardNumber = db.Column(db.Integer())
    address = db.Column(db.String(255, 'utf8mb4_general_ci'))
    expirationDate = db.Column(db.Date)


class Promotion(db.Model):
    __tablename__ = 'promotion'
    __table_args__ = (
        db.Index('Key', 'code', 'discount', 'startDate', 'endDate'),
    )

    promotionID = db.Column(db.Integer(), primary_key=True)
    code = db.Column(db.String(45, 'utf8mb4_general_ci'))
    discount = db.Column(db.Float(asdecimal=True))
    startDate = db.Column(db.Date)
    endDate = db.Column(db.Date)


class Status(db.Model):
    __tablename__ = 'status'

    statusID = db.Column(db.Integer(), primary_key=True)
    status = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False, index=True)


class Book(db.Model):
    __tablename__ = 'book'
    __table_args__ = (
        db.Index('Key', 'title', 'price'),
    )

    isbn = db.Column(db.Integer(), primary_key=True)
    bindingID = db.Column(db.ForeignKey('binding.bindingID'), index=True)
    genreID = db.Column(db.ForeignKey('genre.genreID'), index=True)
    title = db.Column(db.String(45, 'utf8mb4_general_ci'))
    price = db.Column(db.Float(asdecimal=True))
    numPages = db.Column(db.Integer())
    image = db.Column(LONGBLOB)
    edition = db.Column(db.String(45, 'utf8mb4_general_ci'))
    publisher = db.Column(db.String(45, 'utf8mb4_general_ci'))
    publicationDate = db.Column(db.Date)
    stock = db.Column(db.Integer())
    authorFirstName = db.Column(db.String(45, 'utf8mb4_general_ci'))
    authorLastName = db.Column(db.String(45, 'utf8mb4_general_ci'))
    summary = db.Column(db.String(500, 'utf8mb4_general_ci'))

    binding = db.relationship('Binding')
    genre = db.relationship('Genre')


class Order(db.Model):
    __tablename__ = 'orders'
    __table_args__ = (
        db.Index('Key', 'total', 'date'),
    )

    orderID = db.Column(db.Integer(), primary_key=True)
    promotionID = db.Column(db.ForeignKey('promotion.promotionID'), index=True)
    total = db.Column(db.Float(asdecimal=True))
    date = db.Column(db.Date)
    confirmationNumber = db.Column(db.Integer())
    orderTime = db.Column(db.Time)

    promotion = db.relationship('Promotion')


# t_orderDetails = Table(
#     'orderDetails', metadata,
#     Column('orderID', ForeignKey('orders.orderID'), nullable=False),
#     Column('ISBN', ForeignKey('book.ISBN'), nullable=False, index=True),
#     Column('quantity', INTEGER(10), index=True, server_default=text("'0'")),
#     Index('FK', 'orderID', 'ISBN')
# )
class OrderDetails(db.Model):
    __tablename__ = 'orderDetails'
    __table_args__ = (
        db.Index('FK', 'orderID', 'isbn'),

        # db.UniqueConstraint("isbn","quantity"),
    )
    orderID = db.Column(db.ForeignKey('orders.orderID'),nullable=False,primary_key=True)
    isbn = db.Column(db.ForeignKey('book.isbn'), nullable=False, index=True,primary_key=True)
    quantity = db.Column(db.Integer(),index=True,server_default=db.text("0"))


class ShoppingCart(db.Model):
    __tablename__ = 'shoppingCart'

    cartID = db.Column(db.Integer(), primary_key=True)
    orderID = db.Column(db.ForeignKey('orders.orderID'), index=True)

    order = db.relationship('Order')


class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = (
        db.Index('Key', 'pw', 'firstname', 'lastname'),
        db.Index('FK', 'addressID', 'paymentID', 'statusID', 'cartID'),
    )

    email = db.Column(db.String(45, 'utf8mb4_general_ci'), primary_key=True, unique=True)
    addressID = db.Column(db.ForeignKey('address.addressID'))
    paymentID = db.Column(db.ForeignKey('payment.paymentID'), index=True)
    statusID = db.Column(db.ForeignKey('status.statusID'), nullable=False, index=True)
    cartID = db.Column(db.ForeignKey('shoppingCart.cartID'), nullable=False, index=True)
    pw = db.Column(db.String(100, 'utf8mb4_general_ci'), nullable=False)
    firstname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)
    lastname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)

    address = db.relationship('Address')
    shoppingCart = db.relationship('ShoppingCart')
    payment = db.relationship('Payment')
    status = db.relationship('Status')

db.create_all()