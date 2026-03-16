# Quantity Measurement WebApp

## Overview
The Quantity Measurement WebApp is a web application designed to facilitate the conversion and comparison of various measurement units. It utilizes a JSON Server as a backend to manage data related to measurement units, conversion factors, and user history.

## Project Structure
```
quantity-measurement-webapp
├── css
│   └── styles.css
├── js
│   ├── conversion.js
│   ├── api.js
│   ├── ui.js
│   └── app.js
├── db.json
├── index.html
├── package.json
├── .gitignore
└── README.md
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd quantity-measurement-webapp
   ```

2. **Install Dependencies**
   Ensure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run JSON Server**
   To start the JSON Server, run:
   ```bash
   json-server --watch db.json
   ```
   This will serve the database at `http://localhost:3000`.

4. **Open the Application**
   Open `index.html` in your web browser to view the application.

## Usage
- The application allows users to select measurement units and perform conversions.
- Users can view their conversion history, which is stored in the JSON Server database.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.