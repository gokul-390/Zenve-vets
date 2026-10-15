# VetConnect — Innovative Veterinary Social Network Backend

Backend service for **VetConnect**, an innovative veterinary social network built with Spring Boot, Java 21, and MySQL.

---

## 🛠 Tech Stack

- **Java**: 21 (LTS)
- **Framework**: Spring Boot 3.3.4
- **ORM & Data**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.x
- **Database Migrations**: Flyway
- **Security**: Spring Security
- **Validation**: Jakarta Bean Validation (Hibernate Validator)
- **API Documentation**: SpringDoc OpenAPI / Swagger UI (v2.6.0)
- **Build Tool**: Maven

---

## 📁 Project Architecture & Structure

```
zenve-vet-backend/
├── pom.xml
├── .gitignore
├── README.md
├── src/
│   ├── main/
│   │   ├── java/com/zenvevet/
│   │   │   ├── config/              # Infrastructure and framework configurations (OpenAPI, etc.)
│   │   │   ├── controller/          # REST API Controllers
│   │   │   ├── dto/                 # Request/Response Data Transfer Objects
│   │   │   ├── entity/              # JPA Domain Entities
│   │   │   ├── exception/           # Custom exceptions & global exception handlers
│   │   │   ├── mapper/              # Entity <-> DTO converters
│   │   │   ├── repository/          # Spring Data JPA Repositories
│   │   │   ├── security/            # Security configurations & JWT / Auth handlers
│   │   │   ├── service/             # Business logic layer
│   │   │   └── ZenveVetApplication.java  # Main application entry point
│   │   └── resources/
│   │       ├── application.properties    # Application settings & environment configurations
│   │       └── db/migration/             # Flyway SQL migration scripts
│   └── test/
│       ├── java/com/zenvevet/            # Integration & unit test suites
│       └── resources/
│           └── application.properties    # Isolated test profile configuration (H2 in-memory)
```

---

## 🔐 Environment Variables & Configuration

This project strictly adheres to 12-factor application security best practices. **Never commit passwords or credentials to source control.**

Configure the following environment variables to connect to your MySQL database:

| Environment Variable | Description | Default Fallback (Development Only) |
|---|---|---|
| `PORT` | HTTP Server port | `8080` |
| `DB_HOST` | MySQL host address | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database schema name | `zenve_vet` |
| `DB_USERNAME` | MySQL database username | `root` |
| `DB_PASSWORD` | MySQL database password | *(empty)* |
| `DB_URL` | Complete JDBC URL override | `jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` |

### Setting Environment Variables (PowerShell example):

```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="zenve_vet"
$env:DB_USERNAME="vet_user"
$env:DB_PASSWORD="your_secure_password"
```

---

## 🚀 Getting Started

### 1. Compile the Project
```bash
mvn clean compile
```

### 2. Run Tests
```bash
mvn test
```

### 3. Run Application Locally
```bash
mvn spring-boot:run
```

---

## 📖 API Documentation (Swagger)

Once the application is running:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
