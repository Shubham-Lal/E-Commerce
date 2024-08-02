# APIs

- POST /register: Register a new user
    - Requires `email`, `password` and `confirm_password` in the request body.
    - Verify user with `signUp` api call on supabase with `email` & `password`.
    - Adds user to User database in MongoDB.
    - Request:
    ```
    body: {
        "email": "a@b.c",
        "password": "123456",
        "confirm_password": "123456"
    }
    ```
    - Response:
    ```
    {
        success: true,
        message: "Account verification sent to your mail"
    }
    ```

- POST /login: Log in an existing user and create a session
    - Requires `email` and `password` in the request body.
    - Verify user with `signInWithPassword` api call on supabase with `email` & `password`.
    - Update user's Session with login timestamp and IP address.
    - Request:
    ```
    body: {
        "email": "a@b.c",
        "password": "123456",
        "ip": "192.158.1.38" // not required by default
    }
    ```
    - Response:
    ```
    {
        success: true,
        message: "Login success",
        data: {
                user: {
                    id: "", // User's id
                    email: "a@b.c",
                    role: "" // user or admin
                },
                token: "" // access token
            }
    }
    ```

- POST /products: Create a new product
    - Requires `token` for the authorization. Verify if the user has admin privilege.
    - Requires `name`, `description`, `price` and `stock` in the request body.
    - Adds product to Product database in MongoDB.
    - Request:
    ```
    authorization: 'Bearer ...'
    body: {
        "name": "T-Shirt",
        "description": "Cotton t-shirts",
        "price": "100",
        "stock": "20"
    }
    ```
    - Response:
    ```
    {
        success: true,
        data: [] // Array of products in object
    }
    ```

- GET /products: Retrieve all products
    - Fetch all products from MongoDB database.
    - Response:
    ```
    {
        success: true,
        data: [] // Array of products in object
    }
    ```

- PUT /products/:id: Update a product by ID
    - Requires `token` for the authorization. Verify if the user has admin privilege.
    - Requires `name`, `description`, `price` and `stock` in the request body.
    - Update product by their id.
    - Request:
    ```
    authorization: 'Bearer ...'
    body: {
        "name": "T-Shirt",
        "description": "Cotton t-shirts",
        "price": "150",
        "stock": "30"
    }
    ```
    - Response:
    ```
    {
        success: true,
        data: [] // Array of products in object
    }
    ```

- DELETE /products/:id: Delete a product by ID
    - Requires `token` for the authorization. Verify if the user has admin privilege.
    - Delete product by their id.
    - Request: `authorization: 'Bearer ...'`
    - Response:
    ```
    {
        success: true,
        data: [] // Array of products in object
    }
    ```

- POST /cart: Add a product to the shopping cart
    - Requires `token` for the authorization.
    - Requires `cart` in the request body. The `cart` has array of objects comprising of product id and the quantity.
    - Create or update cart with user id.
    - Request:
    ```
    authorization: 'Bearer ...'
    body: {
        "cart": [{_id: "", quantity: ""}, {_id: "", quantity: ""}]
    }
    ```
    - Response:
    ```
    {
        success: true,
        data: [] // Array of products in object
    }
    ```

- GET /cart: Retrieve the user's shopping cart
    - Requires `token` for the authorization.
    - Request: `authorization: 'Bearer ...'`
    - Response:
    ```
    {
        success: true,
        data: [] // Array of products along with quantity in object
    }
    ```

- POST /orders: Place an order
    - Requires `token` for the authorization.
    - Requires `cart` in the request body. The `cart` has array of objects comprising of product details and the quantity.
    - Verify product is missing or out of stock.
    - Create or update user's cart by adding product id and quantity.
    - Generate a stripe checkout session for the payment. A payment url is passsed in response to the client.
    - Request:
    ```
    authorization: 'Bearer ...'
    body: {
        "cart": [{_id: "", title: "", description: "", "price": "", stock: "", quantity: ""}]
    }
    ```
    - Response:
    ```
    {
        success: true,
        payment_url: "" // Stripe payment url
    }
    ```

- GET /orders: Retrieve all orders for the logged-in user
    - Requires `token` for the authorization.
    - Fetch all user orders with their id
    - Request: `authorization: 'Bearer ...'`
    - Response:
    ```
    {
        success: true,
        data: "" // Array of orders in object
    }
    ```

- GET /sessions: Retrieve all user sessions
    - Requires `token` for the authorization.
    - Update user's Session with login timestamp and IP address.
    - Request: `authorization: 'Bearer ...'`
    - Response:
    ```
    {
        success: true,
        message: "Login success",
        data: {
                user: {
                    id: "", // User's id
                    email: "a@b.c",
                    role: "" // user or admin
                }
            }
    }
    ```

- POST /payment: Process a payment through the external payment gateway
    - Requires `session_id` for fetching the payment info and other metadata.
    - Calculate total amount charged.
    - Removes the products from the cart.
    - Create the order document with user id.
    - Redirects user to orders page