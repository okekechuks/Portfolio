# Personal Portfolio Website

A modern, responsive, and developer-centric portfolio built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Designed with scalability in mind, this project includes a lightweight CMS-style admin dashboard that allows portfolio content to be managed without modifying source code.

##  Features

### Public Portfolio

* Modern and responsive design
* Dark mode first
* Hero section with profile information
* Skills section with dynamic badges
* Projects showcase
* Professional experience timeline
* Social links and contact information
* Framer Motion animations
* Mobile-friendly layout

### Admin Dashboard

* Secure admin login
* Skills management
* Project management
* Experience management
* Social links management
* Theme and settings management
* Dynamic content updates
* No code changes required for content updates

### Architecture

* Component-driven design
* Service layer abstraction
* Zustand state management
* API-ready structure
* Separation of concerns
* Reusable UI components
* Clean and scalable codebase

---

# Tech Stack

## Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide React

## State Management

* Zustand

## Future Backend Support

The project is designed to support future integration with:

* Supabase
* PostgreSQL
* MongoDB
* REST APIs
* GraphQL
* Headless CMS solutions

---

# Folder Structure

```text
src
│
├── app
├── components
├── components/ui
├── components/admin
├── data
├── services
├── store
├── hooks
├── lib
├── types
├── utils
├── animations
└── assets
```

---

# Core Sections

## Hero Section

Introduces the developer with:

* Profile image
* Name
* Role
* Introduction
* Resume download
* Contact actions

---

## Skills Section

Skills are loaded dynamically and grouped into:

* Languages
* Frontend
* Backend
* Databases
* Tools
* Learning Technologies

Only enabled skills are displayed.

---

## Projects

Project cards contain:

* Title
* Description
* Tech stack
* GitHub link
* Live demo link
* Featured status

Projects are managed from the admin dashboard.

---

## Experience

Professional experience entries include:

* Company
* Role
* Duration
* Description
* Technologies used

Entries can be enabled or disabled from the admin panel.

---

## Admin Dashboard

The admin dashboard acts as a lightweight content management system.

### Skills Management

Enable or disable technologies and set:

* Learning status
* Proficiency level

### Project Management

Create, edit, and remove projects.

### Experience Management

Manage work history entries.

### Social Links

Update:

* Email
* GitHub
* LinkedIn
* WhatsApp
* Twitter/X
* Website

### Settings

Customize:

* Hero title
* Introduction text
* Resume
* Profile image
* Theme preferences

---

# Design Philosophy

This project emphasizes:

* Simplicity
* Maintainability
* Scalability
* Performance
* Accessibility
* Responsive design

The architecture separates UI components from business logic to make future backend integrations straightforward.

---

# Development Principles

* SOLID principles
* Reusable components
* Service-oriented architecture
* Type safety with TypeScript
* Server and Client Component separation
* Async data handling
* Error handling
* Performance optimization
* SEO best practices

---

# Getting Started

## Clone the repository

```bash
git clone <repository-url>
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

# Future Improvements

* Supabase integration
* PostgreSQL database
* NextAuth authentication
* Blog system
* Analytics dashboard
* Contact form backend
* Role-based access control
* Multi-user admin accounts
* Markdown support
* Image uploads and cloud storage
* Notifications
* API endpoints
* GraphQL support

---

# License

This project is open source and available under the MIT License.

---
Enjoy!!