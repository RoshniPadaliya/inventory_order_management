# Inventory and Order Management System - Backend

## Overview

This is the backend system for the Inventory and Order Management System, enabling user authentication, inventory management, and order processing.

## Features

- **User Authentication:**
  - JWT-based authentication for customers and admins.
  - Role-based access control.

- **Inventory Management:**
  - CRUD operations for products.
  - Manage stock levels with low-stock alerts.

- **Order Management:**
  - Customers can place orders and view order history.
  - Admins can manage all orders and update order statuses.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT for Authentication**
- **bcryptjs for Password Hashing**

## Getting Started

### Prerequisites

- **Node.js** and **npm** installed.
- **MongoDB** instance (local or Atlas).

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/inventory-order-management-backend.git
    cd inventory-order-management-backend/backend
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**

    Create a `.env` file in the `backend` folder and add the following:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d
    ```

4. **Run the Server:**

    ```bash
    npm start
    ```

    The server will run on `http://localhost:5000`.

### Deployment

The backend can be deployed on **Heroku**. Follow these steps:

1. **Create a Heroku App:**

    ```bash
    heroku create your-app-name
    ```

2. **Set Environment Variables on Heroku:**

    ```bash
    heroku config:set MONGO_URI=your_mongodb_connection_string
    heroku config:set JWT_SECRET=your_jwt_secret
    heroku config:set JWT_EXPIRES_IN=7d
    ```

3. **Push to Heroku:**

    ```bash
    git push heroku main
    ```

4. **Access the Live App:**

    The live link will be available in the Heroku dashboard or via the terminal after deployment.

### API Documentation

#### Authentication

- **Register User**

    - **URL:** `/api/auth/register`
    - **Method:** `POST`
    - **Body:**
        ```json
        {
          "name": "John Doe",
          "email": "john@example.com",
          "password": "password123",
          "role": "admin" // Optional: 'admin' or 'customer'
        }
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": {
            "_id": "userId",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "admin",
            "token": "jwt_token"
          }
        }
        ```

- **Login User**

    - **URL:** `/api/auth/login`
    - **Method:** `POST`
    - **Body:**
        ```json
        {
          "email": "john@example.com",
          "password": "password123"
        }
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": {
            "_id": "userId",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "admin",
            "token": "jwt_token"
          }
        }
        ```

#### Products

- **Get All Products**

    - **URL:** `/api/products`
    - **Method:** `GET`
    - **Access:** Public
    - **Response:**
        ```json
        {
          "success": true,
          "count": 10,
          "data": [ ...products ]
        }
        ```

- **Get Single Product**

    - **URL:** `/api/products/:id`
    - **Method:** `GET`
    - **Access:** Public
    - **Response:**
        ```json
        {
          "success": true,
          "data": { ...product }
        }
        ```

- **Create Product**

    - **URL:** `/api/products`
    - **Method:** `POST`
    - **Access:** Private/Admin
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Body:**
        ```json
        {
          "name": "Product Name",
          "description": "Product Description",
          "price": 100,
          "stock": 50,
          "lowStockThreshold": 10
        }
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": { ...createdProduct }
        }
        ```

- **Update Product**

    - **URL:** `/api/products/:id`
    - **Method:** `PUT`
    - **Access:** Private/Admin
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Body:** (Any fields to update)
        ```json
        {
          "price": 120
        }
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": { ...updatedProduct }
        }
        ```

- **Delete Product**

    - **URL:** `/api/products/:id`
    - **Method:** `DELETE`
    - **Access:** Private/Admin
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "message": "Product removed"
        }
        ```

- **Update Stock**

    - **URL:** `/api/products/:id/stock`
    - **Method:** `PUT`
    - **Access:** Private/Admin
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Body:**
        ```json
        {
          "stock": 40
        }
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": { ...updatedProduct }
        }
        ```

#### Orders

- **Place Order**

    - **URL:** `/api/orders`
    - **Method:** `POST`
    - **Access:** Private/Customer
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Body:**
        ```json
        {
          "orderItems": [
            {
              "product": "productId1",
              "quantity": 2
            },
            {
              "product": "productId2",
              "quantity": 1
            }
          ]
        }
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": { ...order }
        }
        ```

- **Get Orders**

    - **URL:** `/api/orders`
    - **Method:** `GET`
    - **Access:** Private/Admin or Private/Customer
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Response (Admin):**
        ```json
        {
          "success": true,
          "count": 20,
          "data": [ ...allOrders ]
        }
        ```
    - **Response (Customer):**
        ```json
        {
          "success": true,
          "count": 5,
          "data": [ ...userOrders ]
        }
        ```

- **Get Single Order**

    - **URL:** `/api/orders/:id`
    - **Method:** `GET`
    - **Access:** Private/Admin or Private/Customer (owns the order)
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": { ...order }
        }
        ```

- **Update Order Status**

    - **URL:** `/api/orders/:id/status`
    - **Method:** `PUT`
    - **Access:** Private/Admin
    - **Headers:**
        ```
        Authorization: Bearer jwt_token
        ```
    - **Body:**
        ```json
        {
          "status": "Shipped"
        }
        ```
    - **Response:**
        ```json
        {
          "success": true,
          "data": { ...updatedOrder }
        }
        ```

## vercel live

[Live Backend on vercel] 



## git repo 

https://github.com/RoshniPadaliya/inventory_order_management.git