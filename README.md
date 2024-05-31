# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" height="40" width="40" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original-wordmark.svg" height="40" width="40" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" height="40" width="40" /> be-nc-news

## Project Overview

be-nc-news is a RESTful API that serves news articles, comments, and topics. The API provides various endpoints to interact with the data, allowing users to retrieve, add, update, and delete articles and comments. It is built using Node.js, Express.js, and PostgreSQL.

### Hosted Version

You can find the hosted version of the API [here](https://be-nc-news-ttz6.onrender.com).

## Getting Started

Follow these instructions to set up a copy of the project on your local machine for development and testing.

### Prerequisites

Ensure you have the following software installed on your machine:

Node.js (minimum version: 21.7.2)
PostgreSQL (minimum version: 14.2)

### Cloning the Repository

Clone the repository to your local machine using the following command:

```
git clone https://github.com/joao-ponte/be-nc-news
cd be-nc-news
```

### Installing Dependencies

Install the project dependencies by running:

```
npm install
```

### Setting Up the Environment Variables

Create two .env files, one for development and one for testing. These files should be placed in the root directory of the project.

1. .env.development

```
PGDATABASE=nc_news
```

2. .env.test

```
PGDATABASE=nc_news_test
```

### Setting Up the Database

Set up the databases by running the setup script:

```
npm run setup-dbs
```

Seed the local development database with initial data:

```
npm run seed
```

### Running the Tests

To run the test suite, execute the following command:

```
npm test
```

### Starting the Server

To start the server, run:

```
npm start
```

The server will start running on the default port 9090. You can configure the port and other settings in listen.js.

## API Documentation

### Endpoints

**Articles**

- GET /api/articles: Get all articles.
- GET /api/articles/:article_id: Get an article by its ID.
- PATCH /api/articles/:article_id: Update the votes of an article.

**Comments**

- GET /api/articles/:article_id/comments: Get comments for a specific article.
- POST /api/articles/:article_id/comments: Add a comment to a specific article.
- DELETE /api/comments/:comment_id: Delete a comment by its ID.

**Topics**

- GET /api/topics: Get all topics.

**Users**

- GET /api/users: Get all topics.

**Endpoint Information**

- GET /api: Serves up a JSON representation of all available endpoints of the API.

## API Reference

### Articles

#### Get all articles

```
  GET /api/articles
```

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `None`    |      |             |

#### Get an article by its ID

```
  GET /api/article/${article}
```

| Parameter    | Type     | Description                          |
| :----------- | :------- | :----------------------------------- |
| `article_id` | `string` | **Required**. ID of article to fetch |

#### Update article votes

```
  PATCH /api/articles/${article_id}
```

| Parameter    | Type     | Description                          |
| :----------- | :------- | :----------------------------------- |
| `article_id` | `string` | **Required**. ID of article to fetch |


**Request Body:**

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `inc_votes` | `number` | **Required**. The number of votes to increment or decrement |

### Comments

#### Get comments for an article

```
  GET /api/articles/${article_id}/comments
```

| Parameter    | Type     | Description                                           |
| :----------- | :------- | :---------------------------------------------------- |
| `article_id` | `string` | **Required**. ID of the article to fetch comments for |

#### Add a comment to an article

```
  POST /api/articles/${article_id}/comments
```

| Parameter    | Type     | Description                                         |
| :----------- | :------- | :-------------------------------------------------- |
| `article_id` | `string` | **Required**. ID of the article to add a comment to |

**Request Body:**
| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `username` | `string` | **Required**. Username of the commenter |
| `body` | `string` | **Required**. Content of the comment|

#### Delete a comment by ID

```
  DELETE /api/comments/${comment_id}
```

| Parameter    | Type     | Description                               |
| :----------- | :------- | :---------------------------------------- |
| `comment_id` | `string` | **Required**. ID of the comment to delete |

### Topics

#### Get all topics

```
 GET /api/topics
```

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `None`    |      |             |

### Users

#### Get all users

```
GET /api/users
```

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `None`    |      |             |

## Author

[@Joao Ponte](https://www.linkedin.com/in/jponte/)
