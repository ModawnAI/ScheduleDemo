Module 1: Work Order Management System 
Objective
To centralize, streamline, and track all customer work orders by replacing the current system of multiple email inboxes with a single, intelligent web and mobile application. The goal is to improve response times, provide full operational visibility, enhance customer service, and ensure the system is fast and reliable for field use, including offline.

1. Scope & Ticket Lifecycle
1.1. Intake & Creation
Centralized Intake: Work orders will be ingested from multiple channels (Email, SMS, Customer Portal) and automatically parsed to create new tickets in the system.
Automated Ticket Creation: The system will parse inbound messages to identify and link the ticket to the correct Site (e.g., Tuscany Bay HOA) and Contact (e.g., Arnold & Lynn Feigin).
Initial Status: All newly created tickets are assigned the status New.
Data Storage: Each ticket will store an external reference ID, subject, body, and tags (e.g., Branch, Service Type, Priority).
1.2. Status Tracking
Statuses: The ticket lifecycle follows a simple, clear progression: New -> Open -> Closed.
Status Transitions:
A ticket becomes Open when it is first assigned to a user.
A user can move an Open ticket to Closed and must provide a closing reason (e.g., "Proposal sent - closing").
1.3. Reopen Rule
Automatic Reopening: A ticket with a Closed status will automatically flip back to Open if a customer or any public-facing reply is received on that thread.
Reopen Logging: When a ticket is reopened, a "reopen event" is logged in the audit trail, and the ticket's reopen_count is incremented.
1.4. Duplicate Detection (Deduplication)
Logic: If a new inbound request matches the same external_ref and Site within 60 days of an existing ticket, the new message will be appended to the existing ticket's conversation thread.
Action: If the existing ticket was Closed, this action will also trigger the Reopen Rule.

2. Core User Experience (UX) & Key Views
The system will be built around three primary user views:
1) Manager View - "My Communities"
Content: Displays all New and Open work orders for the communities assigned to that manager.
Quick Actions: Allows managers to perform key actions directly from the list view: Assign, Close, Reply, and Add internal note.
2) Individual View - "My Work"
Content: A personalized dashboard showing all tickets assigned to the logged-in user, organized into sections: Newly Assigned, Reopened to Me, and All Open Assigned to Me.
3) Coverage View - "Branch Open by Property"
Content: For covering managers or branch-level oversight, this view shows all Open tickets within the user's branch, grouped by community/property.

3. Key Workflows & Features
3.1. Assignment & Notifications
Auto-Watching: Upon ticket creation, all managers assigned to that Site are automatically added as "watchers."
Initial Notification: Site managers receive a work_order.created notification (in-app, push, or email/SMS fallback).
Manual Assignment: A manager or user with permission can assign a ticket from the ticket header. This action sets or updates the owner. If the ticket was New, its status changes to Open.
Assignment Notification: The newly assigned owner receives a work_order.assigned notification. The previous owner (if any) remains a watcher.
Reopen Notification: When a ticket is reopened, the last owner and all Site managers receive a work_order.reopened notification. The ticket will be clearly marked with a "Reopened" badge in the UI.
3.2. Communication & Collaboration
Unified Thread: All communication (customer replies, staff replies, internal notes) is displayed in a single, chronological timeline.
Visibility: Messages can be marked as public (visible to the customer) or internal (visible only to staff).
Attachments: Users can attach photos and other files to messages. This functionality must work offline.
3.3. Offline-First Capability (PWA)
The system will be a Progressive Web App (PWA) designed for reliable field use.
Local Cache: The app will locally cache "My Work" tickets, recent tickets for managed communities, and essential data like contacts, sites, and thumbnails.
Outbox Queue: All actions performed offline (replies, assignments, status changes, photo uploads) are queued locally with an optimistic UI (the action appears to complete instantly).
Synchronization: The queue is automatically flushed to the server when connectivity is restored or the app is brought to the foreground. All events are timestamped by the server upon sync.
Conflict Resolution: For simplicity, messages are append-only. For status changes, the latest server-side update wins. A small banner ("Updated on server") will notify the user if their cached view was superseded.
3.4. AI & Voice Assistance (Internal Use Only)
AI-Powered Suggestions: The tool will provide AI assistance for internal staff to:
Generate suggested replies.
Summarize long conversation threads.
Adjust the tone or shorten text.
Voice-to-Text: Users can compose messages using voice-to-text. An offline audio memo can be recorded, with transcription occurring once the device is back online.
3.5. Multi-Lingual Support
Inbound: The system will offer a "Translate-to-English" preview for inbound messages that are not in English.
Outbound: All outgoing replies composed within the system for the MVP will be English-only. (Note: This clarifies the original plan's broader multi-lingual support, focusing on a specific translation feature for the MVP).

4. System & Data
4.1. Audit Trail
Complete Record: Every significant action is logged as an immutable WorkOrderEvent.
Logged Events: created, assigned, status_changed, message_added, reopened, closed, attachment_added.
Visibility: The full, filterable event timeline is visible on every ticket and will be exportable. Each event includes the actor, action, and timestamp.
4.2. Permissions & Visibility
Managers: Can view all New and Open tickets for their assigned communities.
Owners: Can view all Open tickets assigned to them in their "My Work" view.
Coverage Users: Can view all Open tickets within their assigned branch.
Data Scoping: All data access is controlled by row-level security based on the user's branch and site assignments.
4.3. Minimal Data Model (MVP)
WorkOrder: id, status, site_id, customer_id, contact_id, owner_user_id, tags[], external_ref, last_activity, reopen_count, timestamps.
WorkOrderMessage: id, work_order_id, sender {customer|staff|system}, visibility {public|internal}, body, attachments[], created_at.
WorkOrderEvent: id, work_order_id, event_type, actor, at, meta.
Supporting Tables: SiteManagerAssignment, WorkOrderWatcher.

5. Acceptance Checks & Success Metrics
5.1. Key Acceptance Checks
A new ticket created for a managed community correctly notifies all assigned managers and appears in their "My Communities" view.
A manager can assign a ticket; the new owner is notified and sees the ticket in their "My Work" view.
Closing a ticket with a reason works as expected. A subsequent public reply reopens the ticket, notifies the last owner and managers, and increments the reopen counter.
The audit timeline accurately reflects every state change with the correct actor and timestamp.
Offline mode: A user can open a cached ticket, compose a reply with a photo, and close the ticket. All actions sync correctly and in order when connectivity is restored.
5.2. Success Metrics
Reduction in average time to close a work order.
Decrease in the work order reopen rate.
Clear visibility into the total volume of work orders by property, manager, and service type.
Significant reduction in duplicate work order submissions.
