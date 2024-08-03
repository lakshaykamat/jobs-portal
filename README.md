# JobVault

JobVault is a comprehensive job portal that provides a seamless experience for job seekers. It includes a Next.js client for displaying job listings, a scraper server for fetching jobs from popular job portals like LinkedIn, Indeed, and Naukri, and a main server that provides API routes for client interactions.

## Features

- **Next.js Client**:

  - Displays all job listings.
  - Allows users to save job posts.
  - Enables users to apply for jobs directly from the portal.

- **Scraper Server**:

  - Scrapes jobs from LinkedIn, Indeed, and Naukri.
  - Aggregates job listings into a single database.

- **Main Server**:

  - Provides API routes for the Next.js client.
  - Manages user authentication and job interactions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Scraping Jobs](#scraping-jobs)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js (>=14.x)
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/lakshaykamat/jobvault.git
cd jobvault
```

### Install Dependencies

#### Main Server

```bash
cd server
npm install
```

#### Next.js Client

```bash
cd client
npm install
```

#### Scraper Server

```bash
cd scraper
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

```bash
MONGO_URI=your_uri
MAX_RATE_LIMIT_REQUEST=your_number
AUTH_SECRET_KEY=your_secret
```

## Usage

### Running the Main Server

```bash
cd server
npm start
```

### Running the Next.js Client

```bash
cd client
npm run dev
```

### Running the Scraper Server

```bash
cd scraper
npm start
```

## API Routes

The main server provides the following API routes:

- **User Routes**:

  - `POST /api/v1/users/signup`: Register a new user.
  - `POST /api/v1/users/login`: Authenticate a user and return a JWT token.
  - `GET /api/v1/users/`: Get user details (requires authentication).
  - `POST /api/v1/users/savejob`: Save a job post (requires authentication).

- **Job Routes**:

  - `GET /api/v1/jobs`: Get all job listings.

## Scraping Jobs

The scraper server fetches jobs from LinkedIn, Indeed, and Naukri and stores them in the MongoDB database. You can schedule the scraper to run at regular intervals using a cron job or a task scheduler of your choice.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request to add new features or fix bugs.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request
