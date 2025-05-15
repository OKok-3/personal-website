# Personal Website

A repo for my personal website, built with [Flask](https://flask.palletsprojects.com/en/stable/) and [Next.js](https://nextjs.org/) (app-router).

## Backend

The backend is built using [Flask](https://flask.palletsprojects.com/en/stable/) in Python, with a [SQLite3](https://www.sqlite.org/) database connected with [SQLAlchemy](https://www.sqlalchemy.org/).
### Features

The following features are implemented:

* User registration/login
* Password hashing with argon2id
* Barebones CMS through API calls
* Stateless REST API with JWT Bearer Token authentication

These features are developed so that I don't need to package, build, and deploy my entire website every time when there is new content and for minor changes. Although the backend is over-engineered for a personal website, for example there's currently no interactive component on the website that necessitates user registration, I still decided to build it as it was a good practice and learning opportunity.

### Core packages
* [Flask](https://flask.palletsprojects.com/en/stable/)
* [SQLAlchemy](https://www.sqlalchemy.org/)
* [PyJWT](https://github.com/jpadilla/pyjwt)
* [Pytest](https://github.com/pytest-dev/pytest)
    * [pytest-xdist](https://github.com/pytest-dev/pytest-xdist) -- to run tests in parallel
    * [pytest-cov](https://github.com/pytest-dev/pytest-cov) -- to generate test coverage reports
* [Argon2.cffi](https://github.com/hynek/argon2-cffi)

## Tools Used
* [uv](https://github.com/astral-sh/uv) -- for project and dependency management
* [ruff](https://github.com/astral-sh/ruff) -- for linting