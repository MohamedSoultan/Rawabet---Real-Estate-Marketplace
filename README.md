Rawabet Real Estate Platform - Frontend Handover

Project Overview

Rawabet is a digital real estate brokerage platform focused on
organizing buying and renting journeys inside Kafr El Sheikh.

Frontend Responsibilities

User interface

Property browsing

Property details

Customer experience

Dashboards

Forms

Client-side validation

API integration

User Roles

Guest

Browse properties

Search properties

View details

Customer

Profile

Favorites

Property requests

Contact Rawabet

Owner

Submit properties

Manage submitted properties

Broker

Submit and manage own properties

Operations

Review properties

Approve/reject submissions

Sales

Manage leads and follow ups

Super Admin

Users

Roles

Permissions

Settings

Routes

Public: - / - /properties - /property/ - /about - /contact

Customer: - /account - /favorites - /requests

Owner: - /owner/dashboard

Broker: - /broker/dashboard

Internal: - /operations/dashboard - /sales/dashboard - /super-admin

Property Status

Draft

Pending Review

Under Review

Approved

Rejected

Needs Modification

Published

Archived

Lead Status

New

Contacted

Interested

Follow Up

Closed Won

Closed Lost

Environment Variables

Required:

VITE_APP_URL= VITE_API_BASE_URL=

Never store passwords, secrets, or private keys.

Development

Install: npm install

Run: npm run dev

Build: npm run build

Backend Integration Requirements

Required modules:

Authentication: - Login - Logout - Current user - Profile

Properties: - Listing - Search - Filters - Details - Create - Update

Favorites: - Add - Remove - Get

Leads: - Create - Update - View

Requests: - Create - Track status

Security

Backend is the source of truth for authentication and authorization.

Frontend must not contain sensitive credentials.

QA

Test: - Customer flow - Owner flow - Broker flow - Operations flow -
Sales flow - Admin flow

Responsive testing: - Mobile - Tablet - Desktop

Deployment

DevOps should configure: - Domain - SSL - Environment variables -
Production build

Version: v1.0
