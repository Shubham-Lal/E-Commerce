# ECommerce App

- [Task](https://coda.io/d/Backend-Developer_dvh_EgmuGcy)
- [Frontend](https://ecommerce-claw.vercel.app)
- [Backend](https://ecommerce-api-claw.vercel.app)

Test Card: `4000 0035 6000 0008`

### Project Overview
The app is comprised of client-server architecture developed under Node.js ecosystem.
It is a simple yet effective e-commerce platform which allows users to performs basic operations- 
purchase a product, add products to cart, checkout cart and view past orders. <br>
The admin has privilege to create, update and delete the product listed on the marketplace.

### Setup Instructions
- Make sure you have Node.js installed on your system.
- <strong>server</strong>
    1. Create a `.env` file at the root of <strong>server</strong> directory and copy-paste the contents of `.env.example` file.
    2. Now head over to MongoDB [site](https://www.mongodb.com), copy your db connection string and paste it to the MONGODB_URI. 
    Similarly signup on Supabase [site](https://supabase.com), copy-paste the Project URL and Public Anon key to the SUPABASE_PROJECT_URL & SUPABASE_ANON_KEY respectively.
    3. Now for STRIPE_SECRET_KEY, navigate to Stripe [dashboard](https://dashboard.stripe.com) and toggle the Test mode to on state and get the Secret Key.
    4. Run `npm install` to install all the required packages. Finally run `npm run dev` to start the development server locally.

- <strong>client</strong>
    1. Create a `.env` file at the root of <strong>client</strong> directory. Add this environment variable to this file: ```VITE_SERVER_URL=http://localhost:8000```
    2. Run `npm install` in the <strong>client</strong> directory to install the necessary packages.
    3. After the package installation is complete, run `npm run dev` and navigate to [http://localhost:3000](http://localhost:3000) on your browser.

### Technologies Used
- `Express.js`- Backend framework
- `MongoDB`- Database
- `Supabase`- Authentication
- `Stripe`- Payement gateway
- `Vite`- Build tool for React
- `Tailwind CSS`- CSS framework

### API Endpoints
[View here](https://github.com/Shubham-Lal/ECommerce/blob/main/API.md)

### Database Schema
[View here](https://github.com/Shubham-Lal/ECommerce/blob/main/DATABASE.md)

### Challenges and Solutions
1. When user click on <strong>Buy Now</strong> to purchase a product, I wondered if it should be `GET` or `POST` request. Then I continued by adding `GET` request to the server with the product id and user access token. Here's the [commit](https://github.com/Shubham-Lal/ECommerce/commit/3c5af71f2763091d908a2b48f79d8cd0963458cf). But as soon I started working on <stromg>Add to Cart</strong>, I integrated `POST` <strong>'/orders'</strong> for purchasing products. This ensured both user and product are registered on the database and after initiating the stripe checkout session, send the `payment_url` as response to client so it can redirect user to payment url.
2. After the payment is successful, I required the product `id` which were purchased but stripe didn't contained all that information. So after going through docs and some github codes, I found a solution to include product id and quantity in the stripe metadata to be extracted in the payment success api.

### Future Improvements
As I finished this project under 4 days, it still requires much improvement in APIs and fetching user, cart and orders data on client-side.