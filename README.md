# CampusPass

CampusPass is a full-stack campus event management and registration platform built for students, organizers, and administrators.

It provides a centralized place to discover campus events, manage registrations, handle limited seats and waitlists, and manage events according to user roles. The system also supports real-time seat availability updates using Socket.IO and time-bound registration windows.

## Live Demo

- Frontend: https://campus-pass-eight.vercel.app/
- Backend API: https://campuspass-backend-n7z2.onrender.com/

> The backend API is protected by authentication on most application routes.

---

## Why CampusPass?

Campus events are often managed through disconnected forms, messages, spreadsheets, and announcements. CampusPass brings the complete event lifecycle into one platform.

Students can discover and register for events, organizers can create and manage their events, and administrators can monitor the overall platform.

---

## Features

### Authentication & Authorization

- JWT-based authentication
- Secure login and signup
- Role-based access control
- Three user roles:
  - Student
  - Organizer
  - Admin
- Protected frontend routes
- Backend authorization middleware

### Student Features

- Browse upcoming campus events
- View event details
- Register for events
- Automatically join a waitlist when an event is full
- View personal registrations
- Cancel registrations from the My Registrations page
- Registration cancellation is disabled after the registration window closes
- View registration status:
  - Confirmed
  - Waitlisted

### Organizer Features

- Create events
- Edit events
- Delete events
- View only their own events
- Set event date and duration
- Configure registration opening and closing times
- Monitor available seats
- View registrations for their events

### Admin Features

- Admin dashboard
- View platform statistics
- View users
- View all events
- Delete events when required

### Registration System

- Atomic seat allocation to prevent overbooking
- Waitlist support
- Automatic promotion of the oldest waitlisted student when a confirmed registration is cancelled
- Duplicate registration protection
- Registration windows
- Registration closes automatically based on the configured end time
- Registration cannot be made after the event has started

### Real-Time Updates

Socket.IO is used to keep event seat counts synchronized across connected clients.

For example:

```text
Student A registers
       ↓
Available seats: 10 → 9
       ↓
Socket.IO broadcasts the update
       ↓
Other connected clients see 9 seats
```

The system also avoids manually modifying the seat count on the frontend when a Socket.IO update is received.

### Pagination

Server-side pagination is implemented for larger datasets, including:

- Events
- Organizer's events
- Admin users
- Admin events

### Responsive UI

The frontend is designed to work across:

- Mobile
- Tablet
- Laptop
- Desktop

The UI uses a consistent blue, white, and slate color palette with simple transitions and responsive layouts.

---

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Axios
- Zustand
- React Hot Toast
- Socket.IO Client
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- CORS

### Database

MongoDB / MongoDB Atlas

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## System Architecture

```text
                    ┌─────────────────────────┐
                    │        Students         │
                    │       Organizers        │
                    │         Admins          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   React + Vite Client   │
                    │      Tailwind CSS       │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              REST API                   Socket.IO
                    │                         │
                    ▼                         ▼
          ┌────────────────────────────────────────┐
          │          Node.js + Express             │
          │          Authentication               │
          │          Authorization                │
          │          Event Management             │
          │          Registration Logic            │
          │          Waitlist Management           │
          └────────────────────┬───────────────────┘
                               │
                               ▼
                     ┌─────────────────────┐
                     │    MongoDB Atlas    │
                     │ Users               │
                     │ Events              │
                     │ Registrations       │
                     └─────────────────────┘
```

---

## Core Event Flow

### Event Creation

An organizer creates an event with:

- Title
- Description
- Category
- Event date
- Event start time
- Event end time
- Venue
- Total seats
- Registration opening time
- Registration closing time

The backend validates the registration window and event timing before saving the event.

### Registration Window

An event can be in one of three registration states:

```text
Registration not started
        ↓
Registration open
        ↓
Registration closed
```

The UI reflects the current state and the backend enforces the same rule.

### Seat Allocation

When a student registers:

```text
Is registration window open?
        │
        ├── No → Reject registration
        │
        ▼
Is the event already started?
        │
        ├── Yes → Reject registration
        │
        ▼
Is the student already registered?
        │
        ├── Yes → Reject duplicate registration
        │
        ▼
Is a seat available?
        │
        ├── Yes → Confirm registration
        │
        └── No → Add to waitlist
```

Seat reservation uses an atomic MongoDB update:

```js
{
  _id: eventId,
  availableSeats: { $gt: 0 }
}
```

This helps prevent multiple users from taking the same last available seat during concurrent registrations.

---

## Project Structure

A simplified structure is:

```text
CampusPass/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── socket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── socket.js
│   ├── app.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## API Overview

### Authentication

```text
POST /api/users
POST /api/login
```

### Events

```text
GET    /api/events
GET    /api/events/:id
GET    /api/events/my-events
POST   /api/events
PATCH  /api/events/:id
DELETE /api/events/:id
```

### Registration

```text
POST  /api/events/:id/register
PATCH /api/events/:id/register
GET   /api/students/registrations
GET   /api/events/:id/registrations
```

### Admin

```text
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/events
DELETE /api/admin/events/:id
```

> Exact authorization requirements depend on the route and user role.

---

## Production Deployment

### Frontend

CampusPass frontend is deployed using Vercel.

Set the Vercel environment variable:

```env
VITE_API_URL=https://campuspass-backend-n7z2.onrender.com
```

### Backend

The backend is deployed using Render.

Configure:

```env
MONGODB_URI=mongodb+srv://25je0277_db_user:VwdE4wMBK1r8xzXs@cluster0.nwboj84.mongodb.net/CampusPass?retryWrites=true&w=majority
JWT_SECRET=Kunal2890
FRONTEND_URL=https://campus-pass-eight.vercel.app
```

### Database

MongoDB Atlas is used as the production database.

---

## Engineering Highlights

Some of the more important engineering decisions in CampusPass include:

### Role-Based Authorization

Authorization is enforced on the backend rather than relying only on frontend navigation.

### Atomic Seat Allocation

Seat reservation is performed using an atomic database operation:

```js
availableSeats: { $gt: 0 }
```

combined with `$inc`.

This reduces the chance of overbooking during concurrent requests.

### Waitlist Management

When no seats are available:

```text
Student
   ↓
Waitlist
   ↓
Existing student cancels
   ↓
Oldest waitlisted student
   ↓
Confirmed
```

### Real-Time Seat Synchronization

Socket.IO broadcasts seat changes so connected clients can update without refreshing.

### Server-Side Pagination

Large lists are paginated at the API/database level instead of loading every record into the browser.

### Time-Bound Registration

Registration is only accepted between:

```text
registrationStart
        ↓
registrationEnd
```

and registration is rejected once the event has started.

---

## Future Improvements

The core platform is complete, but possible future extensions include:

- Event search and advanced filtering
- Email reminders
- QR-code based event tickets
- Attendance tracking
- Event certificates
- More detailed analytics
- User notifications
- Calendar integration

---

## Project Goals

CampusPass was designed to demonstrate practical full-stack development concepts including:

- REST API development
- Authentication and authorization
- MongoDB data modeling
- Concurrency-safe resource allocation
- Real-time communication
- Pagination
- Role-based application design
- Responsive frontend development
- Production deployment

---
