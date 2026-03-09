# 🏫 Hostel Leave Management System

<p align="center">
  <img src="https://images.unsplash.com/photo-1562774053-701939374585" width="100%" height="250"/>
</p>

A web-based system designed to simplify hostel leave management for students and hostel authorities.

---

# 👥 User Roles in the System

The application provides **three different login roles**, each with specific functionalities.

## 👨‍🎓 Student Login

Students can access the system to manage their leave applications and hostel information.

### Features

* Apply for hostel leave
* View mess menu
* Track leave request status
* Receive notifications when leave is approved or rejected
* View previously applied leave history

---

## 👨‍💼 Manager Login

The manager acts as the **intermediate authority** who reviews student leave requests.

### Features

* View all leave applications submitted by students
* Verify leave details
* Forward requests for admin approval
* Monitor leave records

---

## 🛠️ Admin Login

The admin (warden or hostel authority) has **full control over the system**.

### Features

* Approve or reject leave requests
* Manage students and hostel records
* Monitor overall leave activity
* Oversee hostel operations

---

# 🔄 System Workflow

1. Student logs into the system.
2. Student applies for leave.
3. The leave request is sent to the **Manager**.
4. The Manager reviews the request.
5. The request is forwarded to the **Admin**.
6. Admin approves or rejects the leave.
7. The result is sent back to the **Student as an alert/notification**.

---

# 🧰 Tech Stack

Frontend

* HTML
* CSS
* JavaScript
* Vite

Backend

* Node.js
* Express.js

Database

* Supabase

---

# 📂 Project Structure

backend – Handles API and business logic
frontend – User interface for students, managers, and admins
Supabase – Cloud database for storing leave records
