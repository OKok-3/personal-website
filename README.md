# Personal Website

A repo for my personal website, built with [Flask](https://flask.palletsprojects.com/en/stable/) and [Next.js](https://nextjs.org/) (app-router).

# Table of Contents

- [Backend](#backend)
    - [Features](#features)
    - [Core Packages](#core-packages)
    - [Tools Used](#tools-used)

## Backend

The backend is built using [Flask](https://flask.palletsprojects.com/en/stable/) in Python, with a [SQLite3](https://www.sqlite.org/) database connected with [SQLAlchemy](https://www.sqlalchemy.org/).
### Features

The following features are implemented:

* User registration/login
* Password hashing with argon2id
* Barebones CMS through API calls
* Stateless REST API with JWT Bearer Token authentication
* File upload and storage (part of barebones CMS, not client facing)

These features are developed so that I don't need to package, build, and deploy my entire website every time when there is new content and for minor changes. Additionally, I like building pretty things :) As my frontend development skills grow, it will also be easier for me to overhaul the frontend given the content are completely isolated in the backend.

Although this backend is probably over-engineered for a personal website, I still decided to build it as it was a good practice and learning opportunity.

### Core packages
* [Flask](https://flask.palletsprojects.com/en/stable/)
* [SQLAlchemy](https://www.sqlalchemy.org/)
* [PyJWT](https://github.com/jpadilla/pyjwt)
* [Pytest](https://github.com/pytest-dev/pytest)
    * [pytest-xdist](https://github.com/pytest-dev/pytest-xdist) -- to run tests in parallel
    * [pytest-cov](https://github.com/pytest-dev/pytest-cov) -- to generate test coverage reports
* [Argon2.cffi](https://github.com/hynek/argon2-cffi)

### Tools Used
* [uv](https://github.com/astral-sh/uv) -- for project and dependency management
* [ruff](https://github.com/astral-sh/ruff) -- for linting