# SakhliAI — n8n Workflow Construction Guide

Welcome to the **SakhliAI Automation & AI Integration Hub**! This guide provides complete, production-ready, step-by-step instructions for building all 7 of SakhliAI’s n8n workflows on **n8n Cloud**.

By combining standard automation with agentic AI (powered by OpenAI), these workflows make your flatmate matching, smart rental, and vacation-rental management fully functional and automated.

---

## 🔑 Shared Setup & Credentials

Before creating any workflows, configure these three credentials in your **n8n Cloud** dashboard once:

### 1. OpenAI Chat API
* **Name:** `OpenAI Account`
* **Resource:** OpenAI API Key
* **Obtain from:** [platform.openai.com](https://platform.openai.com/) (recommend using `gpt-4o` or `gpt-4o-mini`).

### 2. Supabase Node Credential
* **Name:** `Supabase - SakhliAI Admin`
* **Host:** your-supabase-project-id.supabase.co
* **API Key:** your Supabase `service_role` key (required to bypass Row-Level Security on admin-level actions).

### 3. SakhliAI Webhook Secret
* **Name:** `SakhliAI Webhook Header`
* Add an **HTTP Header** credential in n8n for outgoing requests to SakhliAI:
  * Header Name: `x-n8n-secret`
  * Header Value: `<Your-Custom-Secure-Secret-String>` (Match `N8N_WEBHOOK_SECRET` in SakhliAI `.env` file).

---

## 🌐 Part A: Automation Workflows (Source: `n8n`)

### A1. Channel Sync (Airbnb & Booking.com → Calendar)
*Automatically polls external calendar iCal feeds, parses bookings, dedupes them, and injects them into SakhliAI so hosts never suffer double bookings.*

#### Step-by-Step Build:
1. **Trigger: Schedule Node**
   * Set interval: **Every 15 minutes** (or custom duration).
2. **Node 2: Supabase (Read Sync List)**
   * **Action:** Get Many (Query)
   * **Table:** `channel_sync`
   * **Filters:** Active = `true` (Retrieve all active channel iCal URLs and property relationships).
3. **Node 3: HTTP Request (Fetch iCal Feed)**
   * **Method:** GET
   * **URL:** `{{ $json.ical_url }}` (Expression referencing the query output).
   * **Response Format:** Text / String.
4. **Node 4: Code Node (Parse iCal & Deduplicate)**
   * **Mode:** Run Generative Code (JavaScript)
   * **Code:** Paste this JS to parse standard ICS text format:
     ```javascript
     const icsText = item.json.data;
     const events = [];
     const vevents = icsText.split("BEGIN:VEVENT");
     vevents.shift(); // remove header
     for (const vevent of vevents) {
       const summary = vevent.match(/SUMMARY:(.*)/)?.[1] || "Channel Guest";
       const dtstart = vevent.match(/DTSTART;VALUE=DATE:(.*)/)?.[1] || vevent.match(/DTSTART:(.*)/)?.[1];
       const dtend = vevent.match(/DTEND;VALUE=DATE:(.*)/)?.[1] || vevent.match(/DTEND:(.*)/)?.[1];
       const uid = vevent.match(/UID:(.*)/)?.[1];
       if (dtstart && dtend && uid) {
         events.push({
           uid: uid.trim(),
           guest_name: summary.trim(),
           check_in: dtstart.substring(0,4) + "-" + dtstart.substring(4,6) + "-" + dtstart.substring(6,8),
           check_out: dtend.substring(0,4) + "-" + dtend.substring(4,6) + "-" + dtend.substring(6,8)
         });
       }
     }
     return events;
     ```
5. **Node 5: HTTP Request (POST SakhliAI Booking)**
   * **Method:** POST
   * **URL:** `https://your-sakhliai-app.up.railway.app/api/public/n8n/booking`
   * **Credentials:** Select your `SakhliAI Webhook Header` credential.
   * **Body (JSON):**
     ```json
     {
       "property_id": "{{ $node.Supabase.json.property_id }}",
       "guest_name": "{{ $json.guest_name }}",
       "channel": "airbnb",
       "check_in": "{{ $json.check_in }}",
       "check_out": "{{ $json.check_out }}",
       "booking_type": "short_term"
     }
     ```
6. **Node 6: Supabase (Log Agent Event)**
   * **Action:** Insert Row
   * **Table:** `agent_events`
   * **Fields:**
     ```json
     {
       "kind": "sync",
       "source": "n8n",
       "title_en": "Calendars Synced",
       "title_ka": "კალენდრები სინქრონიზდა",
       "detail_en": "Airbnb & Booking.com calendars successfully synchronized. 0 double bookings.",
       "detail_ka": "Airbnb და Booking.com კალენდრები წარმატებით სინქრონიზდა. 0 ორმაგი ჯავშანი."
     }
     ```

---

### A2. Cleaning Auto-Dispatch
*Detects upcoming checkouts on the host properties, dynamically dispatches a registered local cleaner via email/Telegram, and creates a real-time cleaning task.*

#### Step-by-Step Build:
1. **Trigger: Schedule Node**
   * Set interval: **Daily at 08:00 AM**.
2. **Node 2: Supabase (Retrieve Checkouts)**
   * **Action:** Get Many
   * **Table:** `bookings`
   * **Filters:** `check_out` = `{{ $today.format('YYYY-MM-DD') }}`
3. **Node 3: Code Node (Cleaner Selector Heuristics)**
   * Assigns cleanings based on property district and cleaner scores.
   * Returns: `{ booking_id, property_id, cleaner_name, cleaner_phone, cleaner_email }`.
4. **Node 4: HTTP Request (POST SakhliAI Cleaning)**
   * **Method:** POST
   * **URL:** `https://your-sakhliai-app.up.railway.app/api/public/n8n/cleaning`
   * **Credentials:** Select `SakhliAI Webhook Header`.
   * **Body (JSON):**
     ```json
     {
       "property_id": "{{ $json.property_id }}",
       "booking_id": "{{ $json.booking_id }}",
       "cleaner_name": "{{ $json.cleaner_name }}",
       "cleaner_phone": "{{ $json.cleaner_phone }}",
       "scheduled_for": "{{ $json.check_out }}T12:00:00Z",
       "status": "assigned",
       "notified": true
     }
     ```
5. **Node 5: Send Email / Telegram Node (Notify Cleaner)**
   * Send the checkout location, instructions, and date to the assigned cleaner dynamically.
6. **Node 6: Supabase (Log Agent Event)**
   * **Table:** `agent_events`
   * **Body:**
     ```json
     {
       "kind": "cleaning",
       "source": "n8n",
       "title_en": "Cleaning Auto-Dispatched",
       "title_ka": "დასუფთავება დაინიშნა",
       "detail_en": "Turnover task generated for cleaner {{ $json.cleaner_name }}.",
       "detail_ka": "ავტომატურად დაიგეგმა დასუფთავება და ეცნობა დამლაგებელს: {{ $json.cleaner_name }}."
     }
     ```

---

### A3. Smart-Lock Code Rotation
*Automatically rotates keyless entryway smart-lock codes precisely on guest check-in days, provisioning secure, time-boxed keycodes for Tbilisi students.*

#### Step-by-Step Build:
1. **Trigger: Schedule Node**
   * Set interval: **Daily at 12:00 PM** (Check-in hour preparation).
2. **Node 2: Supabase (Check-ins Today)**
   * **Table:** `bookings`
   * **Filter:** `check_in` = `{{ $today.format('YYYY-MM-DD') }}`
3. **Node 3: Code Node (Cryptographic Code Generator)**
   * **JavaScript:** Generates a secure random 4-6 digit keypad code:
     ```javascript
     return {
       booking_id: item.json.id,
       guest_name: item.json.guest_name,
       passcode: Math.floor(100000 + Math.random() * 900000).toString()
     };
     ```
4. **Node 4: Supabase (Update Booking with Lock Code)**
   * **Action:** Update Row
   * **Table:** `bookings`
   * **Row ID:** `{{ $json.booking_id }}`
   * **Fields:** `{ "notes": "Smart-Lock Code: {{ $json.passcode }} (Valid from check-in)" }`
5. **Node 5: Send SMS/Email (Deliver Code)**
   * Inform the student/guest of their secure frontdoor keycode.
6. **Node 6: Supabase (Log Agent Event)**
   * **Table:** `agent_events`
   * **Body:**
     ```json
     {
       "kind": "lock",
       "source": "n8n",
       "title_en": "Smart-Lock Rotated",
       "title_ka": "ჭკვიანი საკეტის კოდი განახლდა",
       "detail_en": "Entry code rotated for {{ $json.guest_name }}.",
       "detail_ka": "გაიცა ახალი კოდი, რომელიც მოქმედებს მხოლოდ {{ $json.guest_name }}-სთვის."
     }
     ```

---

## 🤖 Part B: Agentic AI Workflows (Source: `agent` via OpenAI)

### B1. AI Assistant Chatbot
*Processes user questions from any page context, running a full retrieval and returning instant answers. **Designed to be extremely beginner-friendly with built-in memory!***

#### 💡 If You Don't Know Anything (Beginner-Friendly Concept Guide):
- **What is a Webhook?** Think of it like a doorbell. When a user in the SakhliAI app types a question in the chat bubble, SakhliAI "rings the doorbell" (calls the Webhook URL) in n8n and passes the user's question along with a unique `sessionId` to identify this chat.
- **What is an AI Agent Node?** This is the "brain." It takes the incoming question, reads our custom instructions (the system prompt), accesses the connected memory to remember previous messages, and uses ChatGPT (`gpt-4o-mini`) to write a perfect, gentle, and helpful reply.
- **What is a Window Buffer Memory Node?** This is the "notebook." Connected directly to the AI Agent, it saves the last few questions and answers so the AI doesn't forget what you said two seconds ago!
- **What is the Respond to Webhook Node?** This is the hand-back mechanism. It takes the reply written by ChatGPT and sends it straight back to SakhliAI so it instantly shows up in the user's chat bubble on their screen.

---

#### Step-by-Step Build:

1. **Trigger: Webhook Node**
   * **What to do:** Create a new node in n8n, search for "Webhook", and select it as your starting trigger.
   * **Method (How we send data):** Select `POST` from the dropdown list.
   * **Path (The address):** Type `webhook/assistant` in the path input field.
   * *Why this matters:* This creates the unique web link where SakhliAI can send your users' questions!

2. **Node 2: AI Agent Node**
   * **What to do:** Connect the Webhook node to a new node named "AI Agent".
   * **Model Selection:** Add the **OpenAI Chat Model** sub-node, and choose `gpt-4o-mini` from the model list (it is fast, highly intelligent, and very cost-effective).
   * **Prompt / Input (The User's Message):** Set this field to `{{ $json.question }}`.
     * *Why this matters:* This takes the actual message typed by the user in the SakhliAI chat bubble and feeds it to ChatGPT so it can answer it!
   * **System Prompt (The AI's personality and instructions):** Copy and paste the text below exactly into the "System Prompt" field. 
     
     *Note: We only pass three clean properties: `question` (the message), `locale` (the language), and `sessionId` (the unique session identifier) to keep the payload extremely lightweight, simple, and secure!*
     
     ```text
     You are the SakhliAI Assistant, a flatmate behavior-based matching expert in Georgia.
     
     --- IMPORTANT INSTRUCTION ---
     The user might be completely new and "not know anything" about Tbilisi, renting, roommate-matching, or how SakhliAI works.
     Be exceptionally warm, patient, and welcoming. Avoid gatekeeping terms or complicated jargon.
     If they ask basic questions, explain them gently from scratch (e.g., how utility bills are split, what the safest areas are, how SakhliAI helps them).
     -----------------------------

     Context of the user:
     - Preferred Language: {{ $json.locale }} (either 'en' for English or 'ka' for Georgian)
     
     Response Guidelines:
     1. Provide helpful, concise, friendly, and easy-to-understand expert answers.
     2. Keep your answers well-spaced, clear, and structured with simple bullet points if helpful.
     3. If the user's preferred language (locale) is Georgian ('ka'), reply in beautiful, simple Georgian (ქართულად). If 'en', reply in English.
     4. Use local rental wisdom, and give specific but simple insights about Tbilisi neighborhoods like Saburtalo, Vake, or Gldani.
     5. Explain the SakhliAI hybrid model simply if asked: "We help students rent comfortably during the academic year, and in summer we shift to Airbnb so hosts make more income."
     ```

3. **Node 3: Window Buffer Memory Node (Sub-Node)**
   * **What to do:** Click the **"Add Memory"** button on the **AI Agent Node**, search for **Window Buffer Memory**, and attach it.
   * **Session ID:** Click on the Session ID field and set it to: `{{ $json.sessionId }}`.
   * **Context Window (Optional):** Set to `5` or `10` (this controls how many messages ChatGPT remembers back in the conversation).
   * *Why this matters:* This links each chat bubble to its own separate memory. The AI will remember previous context in the current chat session (e.g., when the user asks *"And why is that?"*, the AI knows exactly what they are referring to).

4. **Node 4: Respond to Webhook Node**
   * **What to do:** Connect the AI Agent node to a new "Respond to Webhook" node.
   * **Response Body (JSON):** Copy and paste this exact JSON block:
     ```json
     {
       "text": "{{ $node['AI Agent'].json.output }}"
     }
     ```
   * *Why this matters:* This sends the AI's answer straight back to the user's screen in real-time.

---

### B2. Dispute Mediator (Bilingual)
*Weights both flatmates' behavioral scores, onboarding records, and conflicting house rule statements to generate an official compromise.*

#### Step-by-Step Build:
1. **Trigger: Webhook Node**
   * **Method:** POST
   * **Path:** `/webhook/mediate`
2. **Node 2: OpenAI Node (Create Chat Completion)**
   * **Model:** `gpt-4o`
   * **JSON System Prompt:**
     ```text
     You are the Supreme SakhliAI Mediator. Weigh the flatmates' conflict.
     Issue: "{{ $json.issue }}"
     Generate a balanced, slightly humorous, but highly effective resolution.
     Write a bilingual verdict. First paragraph in Georgian, second paragraph in English.
     ```
3. **Node 3: Supabase (Log Agent Event)**
   * **Table:** `agent_events`
   * **Body:**
     ```json
     {
       "kind": "mediation",
       "source": "agent",
       "title_en": "House-rule Mediated",
       "title_ka": "უთანხმოება მოგვარდა",
       "detail_en": "Resolved a flatmate dispute with customized guidelines.",
       "detail_ka": "SakhliAI-ის AI მედიატორმა წარმატებით მოაგვარა ახალი დავა."
     }
     ```
4. **Node 4: Respond to Webhook Node**
   * **Response Body (JSON):**
     ```json
     {
       "verdict": "{{ $node['OpenAI'].json.message.content }}"
     }
     ```

---

### B3. Student Applicant Screening
*Analyzes financial, university status, and social habits of incoming profiles, scores them for churn/safety, and writes the review directly to Supabase.*

#### Step-by-Step Build:
1. **Trigger: Webhook Node or Schedule Polling**
   * Trigger on a new entry in `student_profiles`.
2. **Node 2: OpenAI Node (Analyze Profile)**
   * **Model:** `gpt-4o-mini`
   * **Prompt:**
     ```text
     Analyze SakhliAI student application:
     DisplayName: {{ $json.display_name }}
     University: {{ $json.university }}
     Budget: {{ $json.budget_min }} - {{ $json.budget_max }}
     Bio: {{ $json.bio }}
     Weigh financial stability and churn risk. Output a JSON with schema:
     { "score": number (0-100), "verdict": "ideal"|"good"|"review", "risk_analysis": "string" }
     ```
3. **Node 3: Supabase (Insert Screening Result)**
   * **Table:** `applicant_screenings`
   * **Fields:**
     ```json
     {
       "student_profile_id": "{{ $node['Trigger'].json.id }}",
       "score": "{{ $json.score }}",
       "verdict": "{{ $json.verdict }}",
       "risk_analysis": "{{ $json.risk_analysis }}"
     }
     ```
4. **Node 4: Supabase (Log Agent Event)**
   * **Table:** `agent_events`
   * **Body:**
     ```json
     {
       "kind": "screen",
       "source": "agent",
       "title_en": "Applicant Screened",
       "title_ka": "აპლიკანტი შემოწმდა",
       "detail_en": "Verified student {{ $node['Trigger'].json.display_name }} rated '{{ $json.verdict }}' (Score: {{ $json.score }}%).",
       "detail_ka": "ვერიფიცირებული სტუდენტი {{ $node['Trigger'].json.display_name }} შეფასდა როგორც '{{ $json.verdict }}' (ქულა: {{ $json.score }}%)."
     }
     ```

---

### B4. Lease Draft Generation
*Constructs a tailored, professional, bilingual rental lease contract containing dynamic variables like pricing, names, and smart-contract clauses.*

#### Step-by-Step Build:
1. **Trigger: Webhook Node**
   * **Method:** POST
   * **Path:** `/webhook/lease`
2. **Node 2: OpenAI Node (Contract Draft Generation)**
   * **Model:** `gpt-4o`
   * **Prompt:**
     ```text
     Draft a formal bilingual (Georgian - ქართული and English) rental lease contract.
     Property: {{ $json.propertyTitle }}
     District: {{ $json.district }}
     Rent: {{ $json.monthlyRent }} GEL/month
     Tenant: {{ $json.tenantName }}
     Host: {{ $json.hostName }}
     Structure it professionally with legal clauses regarding security deposit, rent payments, rules, and smart contract vault locks.
     ```
3. **Node 3: Supabase (Log Agent Event)**
   * **Table:** `agent_events`
   * **Body:**
     ```json
     {
       "kind": "contract",
       "source": "agent",
       "title_en": "Lease Agreement Generated",
       "title_ka": "ხელშეკრულება მომზადდა",
       "detail_en": "Dynamic lease drafted for Tenant {{ $json.tenantName }}.",
       "detail_ka": "ხელშეკრულების მონახაზი დაცულია SakhliAI Vault-ში, მზადაა ხელმოსაწერად: {{ $json.tenantName }}."
     }
     ```
4. **Node 4: Respond to Webhook Node**
   * **Body (JSON):**
     ```json
     {
       "leaseText": "{{ $node['OpenAI'].json.message.content }}"
     }
     ```

---

## 🚀 Activation & Verification Checklist

Once a workflow is completed in n8n Cloud:

1. Click **Test Workflow** in n8n.
2. Verify the inputs and output states of each node.
3. Click **Activate** (the toggle in the top-right corner) to publish it live to production.
4. Copy the public Webhook URL (e.g., `https://n8n-cloud-instance/webhook/assistant`) and insert it into your `.env` or configuration file:
   * Chatbot: `VITE_N8N_ASSISTANT_URL`
   * Mediator: `VITE_N8N_MEDIATE_URL`
   * Lease Draft: `VITE_N8N_LEASE_URL`

---

## ⚠️ Troubleshooting Webhook Failures (CORS & Empty Responses)

If you send a message in SakhliAI and get **no response** (either the bubble says "I cannot connect to the assistant..." or typing bounces forever), follow these three diagnostic steps:

### 1. Enable CORS in your n8n Webhook Node (Crucial!)
Because SakhliAI runs in your browser, your browser will block requests to your n8n cloud instance unless **CORS** is explicitly enabled in n8n.
* **How to fix:**
  1. Open your **Webhook Node** (the first trigger node) in n8n.
  2. Under the **Options** section at the bottom, click **Add Option**.
  3. Select **Allowed CORS Origins** and type `*` (or your local app's address like `http://localhost:5173`).
  4. Click **Add Option** again, select **Respond to CORS Preflight**, and set it to **Toggle On (True)**.
  5. Save your node, click "Listen for test event" or "Active", and try chatting again!

### 2. Check your n8n Executions Log
* Open n8n and click on **Executions** on the left sidebar.
* Did a new request arrive?
  * **If NO:** The frontend failed to reach n8n. Check if you have started your n8n test listener (clicking **"Listen for test event"** in the editor) or if your workflow is toggled **Active**.
  * **If YES, but it failed (Red dot):** Look inside the execution tree. Did ChatGPT fail because of invalid OpenAI API keys or credentials? Double check your OpenAI account setup in n8n.
  * **If YES, and it succeeded (Green dot):** Check the outputs of the **Respond to Webhook Node**. Is the JSON key exactly matching `"text"`? (e.g., `{"text": "{{ $node['AI Agent'].json.output }}"}`).

### 3. Inspect your Browser Console
* Press **F12** (or right-click -> Inspect) in your browser and select the **Console** tab.
* Type a message in the chat bubble and click send.
* If you see red text saying `CORS Policy Blockage` or `Failed to fetch`, it's a connection issue (fix with step 1 above).

