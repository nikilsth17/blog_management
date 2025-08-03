> 👋 Hello Recruiters!

Thank you for checking out my project! This **Blog Management API** is part of a backend development challenge where I’ve implemented RESTful APIs using **Node.js**, **Express**, and **MongoDB**.  

It showcases:
- Clean code structure and best practices
- Data validation using Joi
- API features like filtering, pagination, sorting
- Modular and scalable project architecture

---

## 🚀 Project Goal

Build a robust Blog Management API to perform CRUD operations and provide enhanced features like filtering, pagination, and status-specific updates.

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Joi** (for input validation)
- **nodemon** (for development)
- **bcrypt** (hashing password securely)
- **env-cmd** (display your current environment or run a specified command in a changed environment)
---

## 📦 API Features

### Core Endpoints

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| POST   | `/api/user/register`      | Create a new user                        |
| POST   | `/api/user/login`         | Login a user                             |
| POST   | `/api/blog`              | Create a new task                        |
| GET    | `/api/blog`              | Retrieve all blog with pagination, sorting, and filtering |
| GET    | `/api/blog/:id`          | Retrieve a specific task by ID           |
| PUT    | `/api/blog/:id`          | Update a task (title, content, status) |
| DELETE | `/api/blog/:id`          | Delete a task by ID                      |
| PATCH  | `/api/blog/:id/status`   | Update only the task status              |

---
## 📄  Schema
```js
🧑 User schema
{
  firstName: String,
  lastName:String,
  email: String, // required, unique
  password: String // hashed
  gender:String, // enum: ["male", "female", "other"]
  location:String
}

📄 Blog Schema
{
  title: String,
  content: String, // required
  status: String, // enum: ["draft", "published", "archived"]
  createdAt: Date,
  tags:Array, // eg: tags:["interesting"],
  author:String // basically it pass user login id

}
```

---

## ⚙️ Installation & Setup



```bash
### 1. Clone the Repository
git clone https://github.com/nikilsth17/Blog-management.git
cd blog-management-api

### 2. Npm install
npm install

### 3. Development mode
npm start

```
Feel free to explore the code, try out the endpoints, and see how I've structured everything.  
If you have any questions or would like to discuss opportunities, I'd love to connect!

📩 **Email:** nikillawo7@gmail.com  


Thanks again for visiting!