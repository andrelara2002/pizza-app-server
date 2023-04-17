# Pizza app server
Server for the pizza demo application I am developing.
----------------------------------------------------------------

Hello, I am developing this server to test my Node Js skills, creating a connection with a MongoDB. Through this API, it is possible to perform authentication, requests, and changes to the data that is in the database. Token concepts have also been applied.

Among the modules used are:
- Nodemon
- Express
- Mongoose
- Cors
- Body parser
- Json Web Token

Soon I will be publishing the frontend of the application, which I am still deciding whether it will be in flutter or react native.
[Front end: link](https://github.com/andrelara2002/pizza-app)

#Version 0.1
- Base project structure
- Configuration and connection to the database
- Division of route structure into: User, Pizza, Esfirra, Order
- First routes and structure of searching for items by "id" and "name"

#Version 0.2 (Current)
- Addition of tokens to perform authentication
- Requiring user tokens to perform registration and management activities
- Encoding "user id", along with "access level" to avoid searching the database to authenticate the user
- Implementing access levels for application management functions
- Defining access levels for: 1) Common users, 2) Employees and support, 3) System administrators
- Fixing "GET" routes that received requests for "POST", so all get functions do not need to send parameters
- Creating a function to decode user token data
- Bug fixes for reloading tokens and token verification
- Creating a "settings" file to store general server configurations
