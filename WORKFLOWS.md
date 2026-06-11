# 🏃 User Workflows

This document maps out how a user journeys through **Chit-Chat**.

---

### 1. 👋 Onboarding (Authentication)

<div align="center">

### **✨ New User Journey**
---

**` 01 `**  
**Lands on `SignUpPage`**  
⬇️  
**` 02 `**  
**Enters Name, Email, Password**  
⬇️  
**` 03 `**  
**Gets a Welcome Email**  
⬇️  
**` 04 `**  
**Redirected to `ChatPage`**

<br/>

### **🔄 Returning User Journey**
---

**` 01 `**  
**Lands on `LoginPage`**  
⬇️  
**` 02 `**  
**Enters Credentials**  
⬇️  
**` 03 `**  
**Authenticated via JWT**  
⬇️  
**` 04 `**  
**Redirected to `ChatPage`**

</div>

---
---

### 2. 💬 Messaging (The Core)

<div align="center">

**` 01 `**  
**User views the sidebar**  
⬇️  
**` 02 `**  
**Clicks on a contact**  
⬇️  
**` 03 `**  
**History loads in `ChatWindow`**  
⬇️  
**` 04 `**  
**User types in `MessageInput`**  
⬇️  
**` 05 `**  
**Hits Enter**  
⬇️  
**` 06 `**  
**Instant UI Update**  
⬇️  
**` 07 `**  
**Saved to MongoDB**

</div>

---

### 3. 🖼️ Profile Management

<div align="center">

**` 01 `**  
**Clicks "Profile" in Header**  
⬇️  
**` 02 `**  
**Clicks Camera Icon**  
⬇️  
**` 03 `**  
**Selects a Local Image**  
⬇️  
**` 04 `**  
**Converted to Base64**  
⬇️  
**` 05 `**  
**Uploaded to Cloudinary**  
⬇️  
**` 06 `**  
**Profile Updated Globally**

</div>

---