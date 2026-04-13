# Community Workshop & Resource Organizer

## Overview
The **Community Workshop & Resource Organizer** is a full-stack web application designed to streamline the management of educational workshops, local tech meetups, and professional training sessions. It provides a seamless experience for both **Organizers** hosting events and **Attendees** seeking to learn and access resources.


## Tech Stack
* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** C# .NET 
* **Database:** Microsoft SQL Server (SSMS) 

## Core Features

### For Attendees (Participants)
* **Discovery Dashboard:** Browse and search for upcoming workshops by title, speaker, or category.
* **One-Click RSVP:** Register for events with real-time seat tracking to prevent overbooking.
* **My Schedule:** A personalized dashboard showing enrolled workshops.
* **Resource Hub:** Secure access to download presentation slides, code snippets, and materials for registered events.

### For Organizers (Admins/Hosts)
* **Management Dashboard:** A command center to view all hosted events and monitor seating capacity.
* **Workshop Engine:** Create, update, and manage workshop details (date, time, capacity, etc.).
* **Resource Upload Center:** Attach relevant files and URLs to specific workshops.
* **Attendee Roster:** Monitor registrations and manage the attendee list for specific sessions.

## 🚀 Getting Started

### Prerequisites
Before running the project locally, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [.NET SDK](https://dotnet.microsoft.com/download)
* [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

### 1. Database Setup
1. Open SSMS and connect to your local SQL Server instance.
2. Run the `schema.sql` script (located in the `/database` folder) to generate the required tables.
3. Update the `appsettings.json` file in the backend directory with your local SQL Server connection string.

### 2. Backend Setup (.NET API)
```bash
cd backend
dotnet restore
dotnet build
dotnet run
