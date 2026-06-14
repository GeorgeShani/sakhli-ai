# SakhliAI — n8n Workflow Construction Guide (Copy-Paste Pattern)

This version follows the same style as your previous guide so you can copy each workflow section and paste it into **n8n AI** directly.

---

## Shared Setup & Credentials

Before building workflows, configure these credentials in n8n:

### 1. OpenAI Credential
- Use your OpenAI API key.
- Recommended models:
  - `gpt-4o-mini` for assistant/screening
  - `gpt-4o` for contracts/mediation

### 2. Supabase Admin Credential
- Host: your project URL (example: `https://<project-ref>.supabase.co`)
- API Key: `service_role` key

### 3. SakhliAI Webhook Header Credential
- Header Name: `x-n8n-secret`
- Header Value: same as app server `N8N_WEBHOOK_SECRET`

---

## Part A: Automation Workflows (n8n -> SakhliAI)

### A1. Channel Sync (iCal -> Booking Ingest)
Automatically reads channel calendar events and inserts bookings into SakhliAI via the public n8n booking endpoint.

#### Step-by-Step Build:
1. **Trigger: Schedule Node**
   - Run every 15 minutes.
2. **Node 2: Data Source Read**
   - Read your active channel feed source table (your own table of iCal URLs and property IDs).
   - Note: current repository `channel_sync` uses `enabled`, and does not include `ical_url`.
3. **Node 3: HTTP Request (Fetch ICS)**
   - Method: `GET`
   - URL: feed URL from Node 2.
4. **Node 4: Code Node (Parse ICS)**
   - Parse `VEVENT` blocks and extract `guest_name`, `check_in`, `check_out`.
5. **Node 5: HTTP Request (POST Booking)**
   - Method: `POST`
   - URL: `https://<your-app-domain>/api/public/n8n/booking`
   - Add header credential: `x-n8n-secret`
   - Body JSON:
   ```json
   {
     "property_id": "{{ $json.property_id }}",
     "guest_name": "{{ $json.guest_name }}",
     "channel": "airbnb",
     "booking_type": "short_term",
     "check_in": "{{ $json.check_in }}",
     "check_out": "{{ $json.check_out }}",
     "status": "confirmed",
     "guests_count": 1
   }
   ```
6. **Node 6: Supabase (Log Agent Event)**
   - Table: `agent_events`
   - Insert:
   ```json
   {
     "kind": "sync",
     "source": "n8n",
     "title_en": "Calendars Synced",
     "title_ka": "კალენდრები სინქრონიზდა",
     "detail_en": "Channel calendars synchronized and bookings ingested.",
     "detail_ka": "არხების კალენდრები სინქრონიზდა და ჯავშნები ჩაიწერა."
   }
   ```

---

### A2. Cleaning Auto-Dispatch
Finds checkout bookings and auto-creates cleaning tasks in SakhliAI.

#### Step-by-Step Build:
1. **Trigger: Schedule Node**
   - Daily at 08:00.
2. **Node 2: Supabase (Find Checkouts)**
   - Table: `bookings`
   - Filter `check_out = today`.
3. **Node 3: Code Node (Cleaner Assignment)**
   - Return `property_id`, `booking_id`, `cleaner_name`, `cleaner_phone`, `scheduled_for`.
4. **Node 4: HTTP Request (POST Cleaning Task)**
   - Method: `POST`
   - URL: `https://<your-app-domain>/api/public/n8n/cleaning`
   - Header credential: `x-n8n-secret`
   - Body:
   ```json
   {
     "property_id": "{{ $json.property_id }}",
     "booking_id": "{{ $json.booking_id }}",
     "cleaner_name": "{{ $json.cleaner_name }}",
     "cleaner_phone": "{{ $json.cleaner_phone }}",
     "scheduled_for": "{{ $json.scheduled_for }}",
     "status": "assigned",
     "notified": true
   }
   ```
5. **Node 5: SMS/WhatsApp/Email Notification**
   - Notify cleaner with date, property, instructions.
6. **Node 6: Supabase (Log Agent Event)**
   - Table: `agent_events`
   - Insert:
   ```json
   {
     "kind": "cleaning",
     "source": "n8n",
     "title_en": "Cleaning Auto-Dispatched",
     "title_ka": "დასუფთავება დაინიშნა",
     "detail_en": "Turnover task created and cleaner notified.",
     "detail_ka": "დასუფთავების დავალება შეიქმნა და დამლაგებელი ინფორმირებულია."
   }
   ```

---

### A3. Smart-Lock Code Rotation (Optional)
Rotates access code for check-ins and notifies guests.

#### Step-by-Step Build:
1. **Trigger: Schedule Node**
   - Daily before check-in window.
2. **Node 2: Supabase (Check-ins Today)**
   - Table: `bookings`
   - Filter `check_in = today`.
3. **Node 3: Code Node (Generate Code)**
   - Generate secure 4-6 digit code.
4. **Node 4: Supabase (Update Booking Notes)**
   - Write code reference to booking metadata/notes.
5. **Node 5: SMS/Email Node**
   - Send code to guest.
6. **Node 6: Supabase (Log Agent Event)**
   - `kind: "lock"`, `source: "n8n"`.

---

## Part B: Agentic AI Workflows (App -> n8n -> OpenAI)

### B1. AI Assistant Chatbot (Already Implemented)
This workflow is already connected in the app through `VITE_N8N_ASSISTANT_URL`.

#### Step-by-Step Build:
1. **Trigger: Webhook**
   - Method: `POST`
   - Path: `/webhook/assistant`
2. **Node 2: AI Agent / OpenAI Chat**
   - Input: `{{ $json.question }}`
   - Locale: `{{ $json.locale }}`
   - Optional memory keyed by `{{ $json.sessionId }}`
3. **Node 3: Respond to Webhook**
   - Return:
   ```json
   {
     "text": "{{ $json.output }}"
   }
   ```

Input contract from app:
```json
{
  "question": "string",
  "locale": "en|ka",
  "sessionId": "string"
}
```

---

### B2. Dispute Mediator (Implemented in UI)
The app currently calls the mediator URL from `VITE_N8N_MEDIATE_URL` (currently using `/webhook/mediate-conflict`).

#### Step-by-Step Build:
1. **Trigger: Webhook**
   - Method: `POST`
   - Path: `/webhook/mediate-conflict`
2. **Node 2: OpenAI Chat**
   - Use `issue`, `conflictDescription`, `user1`, `user2` for context.
   - Generate balanced bilingual verdict.
3. **Node 3: Supabase (Log Agent Event)**
   - Table: `agent_events`
   - `kind: "mediation"`, `source: "agent"`.
4. **Node 4: Respond to Webhook**
   - Return:
   ```json
   {
     "verdict": "{{ $json.output }}"
   }
   ```

Input contract from app:
```json
{
  "issue": "string",
  "conflictDescription": "string",
  "user1": {},
  "user2": {}
}
```

---

### B3. Student Applicant Screening
Scores student profile risk/fit and stores results in `applicant_screenings`.

#### Step-by-Step Build:
1. **Trigger: Schedule or DB-trigger webhook**
   - Poll new profiles from `student_profiles`.
2. **Node 2: OpenAI Node**
   - Analyze budget, university, habits, bio.
   - Output strict JSON:
   ```json
   {
     "score": 0,
     "verdict": "ideal|good|review",
     "risk_analysis": "string"
   }
   ```
3. **Node 3: Supabase Insert**
   - Table: `applicant_screenings`
4. **Node 4: Supabase Log**
   - Table: `agent_events`
   - `kind: "screen"`, `source: "agent"`.

---

### B4. Lease Draft Generation
Generates bilingual lease text for Smart Contract flow.

#### Step-by-Step Build:
1. **Trigger: Webhook**
   - Method: `POST`
   - Path: `/webhook/lease`
2. **Node 2: OpenAI Chat**
   - Generate formal bilingual lease from property/rent/tenant/host data.
3. **Node 3: Supabase Log**
   - Table: `agent_events`
   - `kind: "contract"`, `source: "agent"`.
4. **Node 4: Respond to Webhook**
   - Return:
   ```json
   {
     "leaseText": "{{ $json.output }}"
   }
   ```

Input contract from app:
```json
{
  "propertyTitle": "string",
  "district": "string",
  "monthlyRent": 1200,
  "tenantName": "string",
  "hostName": "string"
}
```

To enable in frontend:
- Set `VITE_N8N_LEASE_URL` in `.env`

---

## Activation & Verification Checklist

1. Click **Test Workflow** in n8n.
2. Validate each node output.
3. Activate workflow.
4. Ensure app env has:
   - `VITE_N8N_ASSISTANT_URL`
   - `VITE_N8N_MEDIATE_URL`
   - `VITE_N8N_LEASE_URL` (for lease)
5. Ensure app server env has:
   - `N8N_WEBHOOK_SECRET`

---

## Troubleshooting (Quick)

### 401 on `/api/public/n8n/booking` or `/api/public/n8n/cleaning`
- `x-n8n-secret` is missing/wrong.

### Assistant/Mediator silent failure in UI
- Webhook URL wrong or workflow inactive.
- Check n8n Executions panel.

### Lease fallback appears instead of generated text
- `VITE_N8N_LEASE_URL` not set or webhook failing.

### No live automation feed updates
- Confirm `agent_events` inserts are happening and Supabase realtime is active.

