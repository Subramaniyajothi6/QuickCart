# QuickCart - Full-Stack E-Commerce Platform

QuickCart is a **full-stack e-commerce application** built with **Next.js 15**, **MongoDB**, and **Clerk Authentication**. This project is created for **educational purposes** to demonstrate modern web development practices and full-stack application architecture.

***

## ✨ Features

### Customer Features
- 🛍️ Browse products with dynamic filtering
- 🛒 Real-time shopping cart with persistence
- 📦 Order placement and tracking
- 👤 User authentication via Clerk
- 📍 Multiple delivery addresses management
- 💳 Order history and status tracking

### Seller Features
- 📊 Seller dashboard
- ➕ Product management (add, update, delete)
- 📋 Order management and tracking
- 📈 Sales overview

### Technical Features
- ⚡ Built with **Next.js 15** (App Router)
- 🎨 **Tailwind CSS** for responsive design
- 🔐 **Clerk** authentication with role-based access
- 🗄️ **MongoDB** database
- 🔄 **Inngest** for background job processing
- ☁️ **Cloudinary** for image uploads
- 🌐 **Axios** for API requests
- 🔥 **React Hot Toast** notifications

***

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Clerk account for authentication
- Cloudinary account for image uploads
- Inngest account (optional, for production)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Subramaniyajothi6/QuickCart.git
cd QuickCart
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Currency
NEXT_PUBLIC_CURRENCY=$

# Inngest (optional for local development)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Run Inngest Dev Server (in a separate terminal)**

```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

6. **Open your browser**

Navigate to `http://localhost:3000`

***

## 📁 Project Structure

```
QuickCart/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── cart/            # Cart management
│   │   ├── order/           # Order processing
│   │   ├── product/         # Product CRUD
│   │   ├── user/            # User data
│   │   └── inngest/         # Inngest webhook
│   ├── (routes)/            # Page routes
│   └── layout.js            # Root layout
├── components/              # React components
├── config/                  # Configuration files
│   ├── db.js               # MongoDB connection
│   └── inngest.js          # Inngest functions
├── models/                  # MongoDB schemas
│   ├── User.js
│   ├── product.js
│   └── order.js
├── context/                 # React Context
│   └── AppContext.jsx
└── public/                  # Static assets
```

***

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **File Storage**: Cloudinary
- **Background Jobs**: Inngest
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

***

## 👥 User Roles

### Customer
- Browse and search products
- Add products to cart
- Place orders
- Track order status
- Manage delivery addresses

### Seller
- Access seller dashboard
- Add new products with images
- View and manage product listings
- Process customer orders
- Update order status

---

## 📚 Learning Outcomes

This project demonstrates:
- Modern Next.js 15 App Router architecture
- Full-stack development with API routes
- MongoDB schema design and relationships
- Authentication and authorization with Clerk
- State management with React Context
- Background job processing with Inngest
- File upload and cloud storage integration
- Responsive design with Tailwind CSS
- RESTful API design patterns
- Error handling and validation

***

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🎓 Educational Purpose

This project is built for **learning and educational purposes** to help developers understand:
- Full-stack e-commerce application development
- Modern React and Next.js patterns
- Database design and integration
- Authentication implementation
- Background job processing
- Cloud service integration

***

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

***
## 🎓 Credits

This project was built by the **GreatStack** YouTube tutorial as part of my full-stack web development learning journey. Special thanks to GreatStack for creating comprehensive and beginner-friendly educational content.

**Note**: This is a learning project created for educational purposes.

## 🌟 Show Your Support

If you find this project helpful for learning, please give it a ⭐ on GitHub!

---

**Happy Learning! 🎓**
