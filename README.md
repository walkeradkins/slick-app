# slick
Welcome to slick! This project is inspired by [Slack](https://slack.com/) where users have the immersive experience of channels, direct message, live server, and searching other users to begin a chat.

## Index

- [live site](https://app-slick.herokuapp.com/)

- [Home](https://github.com/walkeradkins/slick-app/wiki)

- [Backend Routes](https://github.com/walkeradkins/slick-app/wiki/Backend-Routes)

- [Database Schema](https://github.com/walkeradkins/slick-app/wiki/Database-Schema)

- [Feature List](https://github.com/walkeradkins/slick-app/wiki/Feature--List)

- [Frontend Routes](https://github.com/walkeradkins/slick-app/wiki/Frontend-Routes)

- [User Stories Channel](https://github.com/walkeradkins/slick-app/wiki/User-Stories-Channels)

## Meet the Developers
- [Walker Adkins](https://github.com/walkeradkins)
- [Jae Shin](https://github.com/Shin-Jae)
- [Dayton Chen](https://github.com/spursforever)

## Technologies Used
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="javascript" title="javascript" width="60" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" alt="socketio" title="socketio" width="60" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg" alt="html5" title="html5" width="60" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg" alt="css3" title="css3" width="60" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlalchemy/sqlalchemy-original.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-plain-wordmark.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg" style="width:60px;" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-plain-wordmark.svg" style="width:60px;" />

## Getting Started
1. Clone this repistory

    ```bash
    https://github.com/walkeradkins/slick-app.git
    ```

2. Install the project's backend dependencies at root directory

    ```bash
    pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
    ```

    ```bash
    pipenv install psycopg2-binary
    ```

3. Navigate to react-app direct and install the project's frontend dependencies

    ```bash
    npm install
    ```

4. Add an .env file in root file containing the variables from the .env.example file

5. Create user and database based on what you setup in .env file
   ```bash
   psql -c "CREATE USER <database_username> PASSWORD '<password>' CREATEDB"
   ```
   ```bash
   psql -c "CREATE DATABASE <database_name> WITH OWNER <database_username>"
   ```

6. Use the following commands to apply the provided database migrations and seeder.

    ```bash
   pipenv shell
   ```  

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

8. You can now test the application. (Please make sure to flask run on root directory and npm start on react-app directory!!!)
   ```bash
   flask run
   ```

    ```bash
    npm start
    ```

9. You can sign in via Demo User or create an account yourself

## Features
1. Users
* User can log in, and log out of the site
* User can sign up as a new user
* User can also choose to log in as a demo user.
2. Channels
* Logged-in users can create, edit, and delete channels
* Logged-in users can add members when they are creating or editing channels
* Logged-in users will only see the channels that they belong
3. Message
* Every user can send individual direct message(DM) or group message to other users
* Inside the DM channel, logged-in users can create, edit, and delete their own message
4. Live Server
* When two logged-in users are chatting, both of them will see the chat being updated 
5. Seach
* All logged-in users can search other users

## Homepage

## Channel Page

## Direct Message Page

## Search

## Future Implementations
1. Notifications
* Users should be able to see the notifications of new messages
2. Reactions
* Users should be able to react a message using an emoji

## Helpful commands
|    Command            |    Purpose    |
| -------------         | ------------- |
| `pipenv shell`        | Open your terminal in the virtual environment and be able to run flask commands without a prefix |
| `pipenv run`          | Run a command from the context of the virtual environment without actually entering into it. You can use this as a prefix for flask commands  |
| `flask db upgrade`    | Check in with the database and run any needed migrations  |
| `flask db downgrade`  | Check in with the database and revert any needed migrations  |
| `flask seed all`      | Just a helpful syntax to run queries against the db to seed data. See the **app/seeds** folder for reference and more details |
| `heroku login -i`      | Authenticate your heroku-cli using the command line. Drop the -i to authenticate via the browser |
| `heroku authorizations:create` | Once authenticated, use this to generate an Oauth token |
| `heroku run -a <app name>` | Run a command from within the deployed container on Heroku |
