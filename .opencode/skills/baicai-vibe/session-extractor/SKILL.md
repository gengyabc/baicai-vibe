---
name: session-extractor
description: Extract session information from OpenCode database by session ID, tauri link, or share URL. Use when user provides an OpenCode link (tauri://localhost/... or https://opncd.ai/share/...) to get session details.
---

## Purpose

Extract session information from OpenCode's SQLite database when given a session ID or tauri://localhost link.

## Inputs

- `session_id`: direct session ID (e.g., `ses_2794xxx`)
- `tauri_link`: tauri://localhost URL with base64-encoded path
- `share_url`: OpenCode share URL (e.g., `https://opncd.ai/share/xxx`)

## Database Location

OpenCode stores session data in SQLite database. Location varies by platform:

- **macOS**: `~/.local/share/opencode/opencode.db`
- **Linux**: `~/.local/share/opencode/opencode.db`
- **Windows**: `%APPDATA%\opencode\opencode.db` (typically `C:\Users\<user>\AppData\Roaming\opencode\opencode.db`)

Determine platform and construct path accordingly:

```bash
# macOS/Linux
~/.local/share/opencode/opencode.db

# Windows (PowerShell)
$env:APPDATA\opencode\opencode.db

# Windows (Command Prompt)
%APPDATA%\opencode\opencode.db
```

## Relevant Tables

- `session`: session metadata (id, title, directory, share_url, timestamps)
- `message`: conversation messages (id, session_id, data, timestamps)
- `project`: project information

## Extraction Process

### Step 1: Resolve Input to session_id

If input is a tauri link:
1. Extract base64 portion after `tauri://localhost/`
2. Decode base64 to get the full path
3. The session_id is the filename after `session/` or `ses_`

If input is a share_url:
1. Query the session table by `share_url` field

If input is already a session_id:
1. Use directly

### Step 2: Query Session Metadata

```sql
SELECT id, title, directory, share_url, 
       time_created, time_updated
FROM session 
WHERE id = '<session_id>'
```

### Step 3: Query Messages (Optional)

```sql
SELECT id, time_created 
FROM message 
WHERE session_id = '<session_id>' 
ORDER BY time_created
```

To get message content, query the `data` field (JSON format).

### Step 4: Summarize

Return:
- Session metadata
- Message count
- First and last message timestamps
- Share link if available

## Output Format

```json
{
  "session_id": "xxx",
  "title": "xxx",
  "directory": "xxx",
  "share_url": "xxx",
  "time_created": 1776081205044,
  "time_updated": 1776082920938,
  "message_count": 28,
  "first_message_time": 1776081215275,
  "last_message_time": 1776082920938
}
```

## Constraints

- Database path is fixed per platform
- Message `data` field contains JSON, may be large
- Do not expose sensitive authentication data
- Respect user privacy when sharing session info

## Example Usage

### macOS/Linux

```bash
# List recent sessions
sqlite3 ~/.local/share/opencode/opencode.db \
  "SELECT id, title FROM session ORDER BY time_created DESC LIMIT 5"

# Get session by share URL
sqlite3 ~/.local/share/opencode/opencode.db \
  "SELECT * FROM session WHERE share_url LIKE '%6avQPUse'"

# Count messages
sqlite3 ~/.local/share/opencode/opencode.db \
  "SELECT COUNT(*) FROM message WHERE session_id = 'ses_xxx'"
```

### Windows (PowerShell)

```powershell
# List recent sessions
sqlite3 "$env:APPDATA\opencode\opencode.db" "SELECT id, title FROM session ORDER BY time_created DESC LIMIT 5"

# Get session by share URL
sqlite3 "$env:APPDATA\opencode\opencode.db" "SELECT * FROM session WHERE share_url LIKE '%6avQPUse'"

# Count messages
sqlite3 "$env:APPDATA\opencode\opencode.db" "SELECT COUNT(*) FROM message WHERE session_id = 'ses_xxx'"
```

Note: On Windows, ensure `sqlite3` is installed and available in PATH.

## Related

- This skill is useful for debugging and understanding past conversations
- Can help trace learning session history
- Useful for cross-referencing student profiles with OpenCode sessions
