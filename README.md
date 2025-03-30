# User Management System

A Next.js-based user management system that provides an intuitive interface for adding, updating, deleting, and importing users. The system leverages modern UI techniques (Tailwind CSS, Radix UI components) and a custom hook for seamless data fetching and state management.

## Demo
https://www.loom.com/share/fe7456e1f3df47b29429c881607ce26b?sid=58d94a6b-1a9e-4f15-b6a9-f9c0347f60e0

## Features

- **User CRUD Operations:** Create, read, update, and delete users.
- **File Import:** Import user data from an Excel file into the database.
- **Sticky Header & Search:** A sticky header with form inputs and a search bar for quick access.
- **Responsive Design:** Built with Tailwind CSS for a modern, responsive UI.
- **Scroll-Up Button:** Appears when scrolled down (threshold: 150px) and allows smooth scrolling back to the top.
- **Reusability:** Uses a custom hook (`useUsers`) for API interactions and a reusable delete confirmation dialog.

## Dependencies

Make sure you have the following dependencies installed (they should be listed in your `package.json`):

- **Next.js & React:** `next`, `react`, `react-dom`
- **Tailwind CSS:** `tailwindcss` (plus PostCSS and Autoprefixer as needed)
- **MySQL Connection:** `mysql2`
- **Excel Parsing:** `xlsx`
- **Toast Notifications:** `sonner`
- **Radix UI Accordion:** `@radix-ui/react-accordion`
- **Utility Libraries:** (if used) `clsx`, `tailwind-merge`

## Getting Started

Follow these steps to run the project on your local machine.

### Prerequisites

- **Node.js:** Version 14 or above ([nodejs.org](https://nodejs.org/)).
- **npm** or **yarn:** Package managers that come with Node.js.
- **MySQL Database:** Ensure you have a running MySQL instance with valid credentials.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Vadym-Teslytskyy/Test_node-next-JS.git
   cd Test_node-next-JS

2. **Install dependencies:**
```bash
    npm install sonner mysql2 xlsx @radix-ui/react-accordion
```
<br>or<br>
```bash
    yarn install sonner mysql2 xlsx @radix-ui/react-accordion
```

3. **Configure Environment Variables:**
<br>
Create a .env.local file in the root directory and add the following (modify according to your MySQL setup):<br>

DB_HOST=localhost  <br>
DB_USER=your_mysql_username  <br>
DB_PASSWORD=your_mysql_password  <br>
DB_NAME=your_database_name  <br>

4. **Run the development server:**
```bash
    npm run dev
```
<br>or<br>
```bash
    yarn dev
```

5. **Open your browser:**

Visit http://localhost:3000 to view the application.

## Project Structure

``` text

    your-repo/
    ├── src/
    │   ├── app/
    │   │   ├── api/                 # API routes (users, uploadFile, etc.)
    │   │   ├── hook/                # Custom hooks (useUsers)
    │   │   └── page.tsx             # Main Users page
    │   ├── components/
    │   │   └── ui/                  # UI components (Button, Input, Table, AlertDialog, DeleteConfirmationDialog, etc.)
    │   └── lib/
    │       └── dataBaseConnection.ts# MySQL connection pool configuration
    ├── public/                      # Static assets (images, icons, etc.)
    ├── package.json
    └── README.md
```

## Usability
### Simple Setup: 
 The system provides an easy-to-use interface to manage users with minimal configuration.

### Real-Time Feedback: 
 Users receive immediate feedback via toast messages for actions like adding, updating, and deleting.

### Accessible & Responsive:
 Designed with accessibility and responsiveness in mind, ensuring a smooth experience across devices.

### Modular & Maintainable:
 With a clear separation between UI components and business logic (via custom hooks and reusable components), the system is easy to extend and maintain.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your suggestions or improvements.
Here is the Trello board for current and future work: https://trello.com/invite/b/67e975ee002e3d956828bcd8/ATTI3f72dd2a3a8670d04ccb581ad54d26b775B1F5BF/user-managment-project
