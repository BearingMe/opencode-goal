get`/api/info`Get server info

Return the server identity, connection URLs, paths, and readiness status.

Operation ID`server.info`

### Responses

`200`ServerInfo

`application/json`[ServerInfo](#schema-ServerInfo)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

post`/api/pair`Create pairing code

Create a short-lived, single-use code for a /auth/connect/:code pairing link.

Operation ID`server.pair`

### Responses

`200`PairingCode

`application/json`[PairingCode](#schema-PairingCode)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

get`/auth/connect/{code}`Redeem pairing code

Redeem a pairing code. Browsers receive a session cookie and a redirect to the web app; requests that accept JSON receive a session token to use as the password.

Operation ID`server.connect`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `code`required | path | `string` | No description |

### Responses

`200`PairingSession

`application/json`[PairingSession](#schema-PairingSession)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

get`/api/location`Get location

Resolve the requested location or the server default location.

Operation ID`location.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Location.PublicInfo

`application/json`[Location.PublicInfo](#schema-Location.PublicInfo)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/location/reload`Reload configuration

Shut down and rebuild every loaded location. Pending permissions and forms are cancelled; running sessions continue with fresh services at the next step boundary. Emits location.shutdown for client recovery and responds once all replacement builds settle.

Operation ID`location.reload`

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/agent`List agents

Retrieve currently registered agents.

Operation ID`agent.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Agent.Info[]`required

Items [Agent.Info](#schema-Agent.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/agent/{agentID}`Get agent

Retrieve a single currently registered agent.

Operation ID`agent.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `agentID`required | path | [Agent.ID](#schema-Agent.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

get`/api/plugin`List plugins

Retrieve enabled server plugins and their current status.

Operation ID`plugin.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Plugin.Info[]`required

Items [Plugin.Info](#schema-Plugin.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/plugin/gui`Read plugin GUI bundle

Read an active plugin's prebuilt CommonJS \`./gui-experimental\` bundle. Desktop app windows run its default export; the desktop app's main process runs its \`main\` export. Fails with not found when no active plugin has the id or the plugin exports no \`./gui-experimental\`.

Operation ID`plugin.gui`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `id`required | query | [Plugin.ID](#schema-Plugin.ID) | No description |

post`/api/plugin/check`Check plugin updates

Check one or all package plugins for available updates.

Operation ID`plugin.check`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`target`

`string | null`

`string`

or

`null`

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Plugin.Info[]`required

Items [Plugin.Info](#schema-Plugin.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/plugin/update`Update plugins

Update package plugins concurrently and notify active locations to reload them. Responds once every update has finished; fails when any update fails.

Operation ID`plugin.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`targets`

`string[]`required

Items

`string`

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/session`List sessions

Retrieve sessions in the requested order. Items keep that order across pages; use cursor.next or cursor.previous to move through the ordered list.

Operation ID`session.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `limit` | query | `string \| null`  Maximum number of sessions to return. Defaults to the newest 50 sessions.  `string`  or  `null` | No description |
| `order` | query | `"asc" \| "desc" \| null`  Session order for the first page. Use desc for newest first or asc for oldest first.  `"asc" \| "desc"`  Values`"asc" \| "desc"`  or  `null` | No description |
| `search` | query | `string \| null`  `string`  or  `null` | No description |
| `parentID` | query | `Session.ID \| "null" \| null`  `Session.ID \| "null"`  Filter by parent session. Use null to return only root sessions.  [Session.ID](#schema-Session.ID)  or  `"null"`  Values`"null"`  or  `null` | No description |
| `archived` | query | `"true" \| "false" \| null`  `"true" \| "false"`  Values`"true" \| "false"`  or  `null` | No description |
| `directory` | query | `AbsolutePath \| null`  [AbsolutePath](#schema-AbsolutePath)  or  `null` | No description |
| `project` | query | `Project.ID \| null`  [Project.ID](#schema-Project.ID)  or  `null` | No description |
| `subpath` | query | `RelativePath \| null`  [RelativePath](#schema-RelativePath)  or  `null` | No description |
| `cursor` | query | `SessionsCursor \| null`  [SessionsCursor](#schema-SessionsCursor)  or  `null` | No description |

post`/api/session`Create session

Create a session at the requested location. A parentID creates a linked child session at its parent's location.

Operation ID`session.create`

### Request body required

`application/json`

`object`

`id`

`Session.ID | null`

[Session.ID](#schema-Session.ID)

or

`null`

`parentID`

`Session.ID | null`

[Session.ID](#schema-Session.ID)

or

`null`

`title`

`string | null`

`string`

or

`null`

`agent`

`Agent.ID | null`

[Agent.ID](#schema-Agent.ID)

or

`null`

`model`

`Model.Ref | null`

[Model.Ref](#schema-Model.Ref)

or

`null`

`location`

`Location.PublicRef | null`

[Location.PublicRef](#schema-Location.PublicRef)

or

`null`

`metadata`

`Session.Metadata | null`

[Session.Metadata](#schema-Session.Metadata)

or

`null`

`permissions`

`Permission.Ruleset | null`

[Permission.Ruleset](#schema-Permission.Ruleset)

or

`null`

### Responses

`200`Success

`application/json`

`object`

`data`[Session.Info](#schema-Session.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

get`/api/experimental/session/stats`Get session statistics

Aggregate local session activity, usage, and tool reliability for a time range.

Operation ID`experimental.session.stats`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `from` | query | `string \| null`  `string`  or  `null` | No description |
| `to` | query | `string \| null`  `string`  or  `null` | No description |
| `project` | query | `Project.ID \| null`  [Project.ID](#schema-Project.ID)  or  `null` | No description |
| `timezone` | query | `string \| null`  `string`  or  `null` | No description |
| `tools` | query | `"none" \| "summary" \| "detail" \| null`  `"none" \| "summary" \| "detail"`  Values`"none" \| "summary" \| "detail"`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`data`[SessionStats.Info](#schema-SessionStats.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

post`/api/experimental/session/import`Import session

Import a projected session transcript at the requested location. Accepts transcripts exported by earlier releases. If parentID is supplied, the parent session must already exist; import parents before children.

Operation ID`experimental.session.import`

### Request body required

### Responses

`200`Success

`application/json`

`object`

`data`[Session.Info](#schema-Session.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

`409`ConflictError

`application/json`[ConflictErrorEncoded](#schema-ConflictErrorEncoded)

get`/api/experimental/session/{sessionID}/export`Export session

Export a complete projected session transcript.

Operation ID`experimental.session.export`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `sanitize` | query | `"true" \| "false" \| null`  `"true" \| "false"`  Values`"true" \| "false"`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`data`[SessionTransfer.Data](#schema-SessionTransfer.Data)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

`500`UnknownError

`application/json`[UnknownErrorEncoded](#schema-UnknownErrorEncoded)

get`/api/session/active`List active sessions

Retrieve foreground Session drains currently owned by this OpenCode process. Sessions absent from the result are inactive.

Operation ID`session.active`

### Responses

`200`Success

`application/json`

`object`

`data`

`object`required

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

get`/api/session/{sessionID}`Get session

Retrieve a session by ID.

Operation ID`session.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`200`Success

`application/json`

`object`

`data`[Session.Info](#schema-Session.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

patch`/api/session/{sessionID}`Update session

Update mutable session properties.

Operation ID`session.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`title`

`string | null`

`string`

or

`null`

`metadata`

`Session.Metadata | null`

[Session.Metadata](#schema-Session.Metadata)

or

`null`

`permissions`

`Permission.Ruleset | null`

[Permission.Ruleset](#schema-Permission.Ruleset)

or

`null`

`archived`

`boolean | null`

Archive the session with true or restore it with false. Repeating the current state is a no-op.

`boolean`

or

`null`

delete`/api/session/{sessionID}`Delete session

Delete a session and its child sessions.

Operation ID`session.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

post`/api/session/{sessionID}/fork`Fork session

Create a child session by copying projected history before a message. Omit before to copy the full history.

Operation ID`session.fork`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`before`

`Session.Message.ID | null`

[Session.Message.ID](#schema-Session.Message.ID)

or

`null`

post`/api/session/{sessionID}/agent`Switch session agent

Switch the agent used by subsequent provider turns.

Operation ID`session.switchAgent`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`agent`[Agent.ID](#schema-Agent.ID)

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

post`/api/session/{sessionID}/model`Switch session model

Switch the model used by subsequent provider turns.

Operation ID`session.switchModel`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`model`[Model.Ref](#schema-Model.Ref)

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

post`/api/session/{sessionID}/move`Move session

Move a session to another project directory at the requested delivery boundary.

Operation ID`session.move`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

post`/api/session/{sessionID}/prompt`Send message

Durably admit one session input and schedule agent-loop execution unless resume is false.

Operation ID`session.prompt`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

post`/api/session/{sessionID}/command`Run command

Execute a slash command callback immediately.

Operation ID`session.command`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

post`/api/experimental/session/{sessionID}/skill`Activate skill

Activate a skill for a session by appending a skill message and resuming execution.

Operation ID`experimental.session.skill`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`id`[Skill.ID](#schema-Skill.ID)

`resume`

`boolean | null`

`boolean`

or

`null`

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError | SkillNotFoundError | LocationNotFoundError

post`/api/session/{sessionID}/synthetic`Add synthetic message

Durably admit synthetic session input and schedule execution unless resume is false.

Operation ID`session.synthetic`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`id`

`Session.Message.ID | null`

[Session.Message.ID](#schema-Session.Message.ID)

or

`null`

`text`

`string`required

`description`

`string | null`

`string`

or

`null`

`metadata`

`object`

`delivery`

`Session.Inbox.Delivery | null`

[Session.Inbox.Delivery](#schema-Session.Inbox.Delivery)

or

`null`

`resume`

`boolean | null`

`boolean`

or

`null`

post`/api/session/{sessionID}/shell`Run shell command

Execute one shell command in the session's working directory. Emits a shell.started event before execution and a shell.ended event with the merged output after.

Operation ID`session.shell`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`id`

`Session.Message.ID | null`

[Session.Message.ID](#schema-Session.Message.ID)

or

`null`

`command`

`string`required

post`/api/session/{sessionID}/compact`Compact session

Durably admit a session compaction request. Steers by default: it runs at the next step boundary instead of waiting behind queued prompts.

Operation ID`session.compact`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`id`

`Session.Message.ID | null`

[Session.Message.ID](#schema-Session.Message.ID)

or

`null`

`delivery`

`Session.Inbox.Delivery | null`

[Session.Inbox.Delivery](#schema-Session.Inbox.Delivery)

or

`null`

post`/api/experimental/session/{sessionID}/wait`Wait for session

Wait for a session agent loop to become idle.

Operation ID`experimental.session.wait`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

post`/api/session/{sessionID}/revert/stage`Stage session revert

Stage or move a reversible session boundary and optionally apply its file changes.

Operation ID`session.revert.stage`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`messageID`[Session.Message.ID](#schema-Session.Message.ID)

`files`

`boolean | null`

`boolean`

or

`null`

delete`/api/session/{sessionID}/revert`Clear staged revert

Operation ID`session.revert.clear`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

post`/api/session/{sessionID}/revert/commit`Commit staged revert

Operation ID`session.revert.commit`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

`409`SessionBusyError

`application/json`[SessionBusyErrorEncoded](#schema-SessionBusyErrorEncoded)

get`/api/session/{sessionID}/context`Get session context

Retrieve the active context messages for a session (all messages after the last compaction).

Operation ID`session.context`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`200`Success

`application/json`

`object`

`data`

`Session.Message.Info[]`required

Items [Session.Message.Info](#schema-Session.Message.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

`500`UnknownError

`application/json`[UnknownErrorEncoded](#schema-UnknownErrorEncoded)

get`/api/session/{sessionID}/diff`Diff session turns

Structured per-file diffs of the files a turn changed. A turn runs from the first prompt after the session was last idle until its next idle marker, so prompts steered in while it was busy belong to the same turn; \`to\` extends the range through a later turn. Compares the range's first recorded snapshot with its last; a step still running in the active session compares against the working copy. Ranges that span a location change are rejected. In sessions without any idle marker, a prompt's turn spans until the next user message.

Operation ID`session.diff`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `from` | query | `Session.Message.ID \| null`  User message whose turn to diff. Defaults to the turn of the newest user message.  [Session.Message.ID](#schema-Session.Message.ID)  or  `null` | No description |
| `to` | query | `Session.Message.ID \| null`  Later user message whose turn ends the range. Defaults to the turn of \`from\` alone.  [Session.Message.ID](#schema-Session.Message.ID)  or  `null` | No description |
| `context` | query | `string \| null`  Unchanged lines around each hunk. Omit for full-file patches.  `string`  or  `null` | No description |

get`/api/session/{sessionID}/inbox`List session inbox

List durable enqueued session work not yet delivered, ordered by enqueue sequence. Includes user, synthetic, compaction, and move items.

Operation ID`session.inbox.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`200`Success

`application/json`

`object`

`data`

`Session.Inbox.Info[]`required

Items [Session.Inbox.Info](#schema-Session.Inbox.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

patch`/api/session/{sessionID}/inbox/{inboxID}`Update inbox item

Change a pending inbox item's delivery mode. Steering wakes session execution.

Operation ID`session.inbox.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `inboxID`required | path | [Session.Message.ID](#schema-Session.Message.ID) | No description |

### Request body required

`application/json`

`object`

`delivery`[Session.Inbox.Delivery](#schema-Session.Inbox.Delivery)

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

`409`ConflictError

`application/json`[ConflictErrorEncoded](#schema-ConflictErrorEncoded)

delete`/api/session/{sessionID}/inbox/{inboxID}`Cancel inbox input

Cancel an inbox item that has not yet been delivered. Unavailable items are a no-op.

Operation ID`session.inbox.cancel`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `inboxID`required | path | [Session.Message.ID](#schema-Session.Message.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

get`/api/experimental/session/{sessionID}/instructions/entries`List instruction entries

List API-managed instruction entries attached to the session.

Operation ID`experimental.session.instructions.entry.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`200`Success

`application/json`

`object`

`data`

`InstructionEntry.Info[]`required

Items [InstructionEntry.Info](#schema-InstructionEntry.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

put`/api/experimental/session/{sessionID}/instructions/entries/{key}`Put instruction entry

Attach or replace one durable instruction entry. Changes announce as updates at the next step boundary.

Operation ID`experimental.session.instructions.entry.put`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `key`required | path | [InstructionEntry.Key](#schema-InstructionEntry.Key) | No description |

### Request body required

`application/json`

`object`

`value`

`object`required

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

`413`InstructionEntryValueTooLargeError

`application/json`[InstructionEntryValueTooLargeErrorEncoded](#schema-InstructionEntryValueTooLargeErrorEncoded)

delete`/api/experimental/session/{sessionID}/instructions/entries/{key}`Remove instruction entry

Remove one instruction entry; the removal is announced to the model at the next step boundary.

Operation ID`experimental.session.instructions.entry.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `key`required | path | [InstructionEntry.Key](#schema-InstructionEntry.Key) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

post`/api/session/{sessionID}/generate`Generate text from session context

Generate transient text from the current session context without mutating session history.

Operation ID`session.generate`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`prompt`

`string`required

get`/api/experimental/session/{sessionID}/log`Read the session log

Experimental durable session event log. Reads events after an exclusive aggregate sequence and continues with live events when follow=true.

Operation ID`session.log`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `after` | query | `Event.SeqEncoded \| null`  [Event.SeqEncoded](#schema-Event.SeqEncoded)  or  `null` | No description |
| `follow` | query | `"true" \| "false" \| null`  `"true" \| "false"`  Values`"true" \| "false"`  or  `null` | No description |

post`/api/session/{sessionID}/interrupt`Interrupt session execution

Interrupt active execution owned by this OpenCode process. Returns interrupted=true when an active execution was interrupted and false for the idle no-op. When resume=true, execution resumes pending steering input and next-in-line control items (manual compaction, moves) while queued prompts remain parked.

Operation ID`session.interrupt`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `resume` | query | `"true" \| "false" \| null`  `"true" \| "false"`  Values`"true" \| "false"`  or  `null` | No description |

### Responses

`200`SessionInterruptResponse

`application/json`[SessionInterruptResponse](#schema-SessionInterruptResponse)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

post`/api/session/{sessionID}/background`Background blocking session tools

Move active foreground backgroundable tools for this session into background observation. Idle requests are a no-op.

Operation ID`session.background`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

get`/api/session/{sessionID}/message/{messageID}`Get session message

Retrieve one projected message owned by the Session.

Operation ID`session.message.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `messageID`required | path | [Session.Message.ID](#schema-Session.Message.ID) | No description |

get`/api/session/{sessionID}/form`List session forms

Retrieve pending forms for a session.

Operation ID`session.form.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | `string` | No description |

post`/api/session/{sessionID}/form`Create session form

Create a form for a session.

Operation ID`session.form.create`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | `string` | No description |

### Request body required

`application/json`[Form.CreatePayload](#schema-Form.CreatePayload)

get`/api/session/{sessionID}/form/{formID}`Get session form

Retrieve a form and its current state for a session.

Operation ID`session.form.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | `string` | No description |
| `formID`required | path | [Form.ID](#schema-Form.ID) | No description |

delete`/api/session/{sessionID}/form/{formID}`Cancel form

Cancel a pending form, optionally telling the asker why it was not answered.

Operation ID`session.form.cancel`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | `string` | No description |
| `formID`required | path | [Form.ID](#schema-Form.ID) | No description |
| `message` | query | `string \| null`  `string`  or  `null` | No description |

post`/api/session/{sessionID}/form/{formID}/reply`Reply to form

Submit an answer to a pending form.

Operation ID`session.form.reply`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | `string` | No description |
| `formID`required | path | [Form.ID](#schema-Form.ID) | No description |

### Request body required

`application/json`[Form.Reply](#schema-Form.Reply)

### Responses

`204`\<No Content>

`400`FormInvalidAnswerError | InvalidRequestError

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError | FormNotFoundError | LocationNotFoundError

`409`FormAlreadySettledError

`application/json`[FormAlreadySettledErrorEncoded](#schema-FormAlreadySettledErrorEncoded)

put`/api/session/{sessionID}/environment`Set session environment

Replace the process environment used by local shell commands for this session.

Operation ID`session.environment`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`variables`

`object`required

Additional properties

`string`

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

post`/api/session/{sessionID}/view`View session

Mark the idle transition observed by the viewer as viewed.

Operation ID`session.view`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`

`object`

`idle`

`number`required

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError

`application/json`[SessionNotFoundErrorEncoded](#schema-SessionNotFoundErrorEncoded)

get`/api/session/{sessionID}/message`Get session messages

Retrieve projected messages for a session, optionally filtered by type. Items keep the requested order across pages; use cursor.next or cursor.previous to move through the ordered timeline, passing the same type filter on each page.

Operation ID`session.message.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `limit` | query | `string \| null`  Maximum number of messages to return. When omitted, the endpoint returns its default page size.  `string`  or  `null` | No description |
| `order` | query | `"asc" \| "desc" \| null`  Message order for the first page. Use desc for newest first or asc for oldest first.  `"asc" \| "desc"`  Values`"asc" \| "desc"`  or  `null` | No description |
| `cursor` | query | `string \| null`  `string`  Opaque pagination cursor returned as cursor.previous or cursor.next in the previous response. Do not combine with order.  or  `null` | No description |
| `type` | query | `"agent-switched" \| "model-switched" \| "location-switched" \| "user" \| "synthetic" \| "system" \| "skill" \| "shell" \| "assistant" \| "compaction" \| "idle" \| null`  Filter by message type before pagination. When omitted, all message types are returned. Pass the same type when following cursors.  `"agent-switched" \| "model-switched" \| "location-switched" \| "user" \| "synthetic" \| "system" \| "skill" \| "shell" \| "assistant" \| "compaction" \| "idle"`  Values`"agent-switched" \| "model-switched" \| "location-switched" \| "user" \| "synthetic" \| "system" \| "skill" \| "shell" \| "assistant" \| "compaction" \| "idle"`  or  `null` | No description |

get`/api/model`List models

Retrieve the current snapshot of available models of the requested types, chat by default, ordered by release date within each type. The snapshot may precede initial plugin settlement.

Operation ID`model.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `types` | query | `Model.Type \| Model.Type[] \| null`  Only list models of these types. Defaults to chat, the only type offered for sessions.  `Model.Type \| Model.Type[]`  [Model.Type](#schema-Model.Type)  or  `Model.Type[]`  Items [Model.Type](#schema-Model.Type)  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Model.Info[]`required

Items [Model.Info](#schema-Model.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/model/default`Get default model

Retrieve the model used when a session has no explicit model selection.

Operation ID`model.default`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

post`/api/experimental/generate/text`Generate text

Run one stateless model generation using the server's base configuration and return the assistant text. Uses the base configuration's default model when none is specified.

Operation ID`experimental.generate.text`

### Request body required

`application/json`

`object`

`prompt`

`string`required

`model`

`Model.Ref | null`

[Model.Ref](#schema-Model.Ref)

or

`null`

post`/api/experimental/generate`Generate text (deprecated path) post`/api/experimental/generate/image`Generate images

Generate or edit images with an image model using the server's base configuration and return them as base64. Stateless: nothing is stored.

Operation ID`experimental.generate.image`

### Request body required

`application/json`[Generate.ImageRequest](#schema-Generate.ImageRequest)

post`/api/experimental/generate/decisions`Generate decisions

Ask a decision model typed predicate, choice and score questions about the input and return one probability-bearing answer per question, in question order. Stateless: nothing is stored.

Operation ID`experimental.generate.decisions`

### Request body required

`application/json`[Generate.DecisionRequest](#schema-Generate.DecisionRequest)

get`/api/experimental/voice/models`List voice models

List supported voice models, their transports, and whether the server has a usable API key for each provider.

Operation ID`experimental.voice.models`

### Responses

`200`VoiceModelsResponse

`application/json`[VoiceModelsResponse](#schema-VoiceModelsResponse)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

post`/api/experimental/voice/session`Create voice session

Create a server-brokered voice session using the server's configured provider credentials and return the WebRTC SDP answer or WebSocket ephemeral token.

Operation ID`experimental.voice.session`

### Request body required

`application/json`

`object`

`model`

`string`required

`session`

`object | null`

`object`

or

`null`

`transport`[VoiceTransportInput](#schema-VoiceTransportInput)

### Responses

`200`VoiceSessionResponse

`application/json`[VoiceSessionResponse](#schema-VoiceSessionResponse)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/provider`List providers

Retrieve active AI providers so clients can show provider availability and configuration.

Operation ID`provider.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Provider.Info[]`required

Items [Provider.Info](#schema-Provider.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/provider/{providerID}`Get provider

Retrieve a single AI provider so clients can inspect its availability and endpoint settings.

Operation ID`provider.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `providerID`required | path | [Provider.ID](#schema-Provider.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

get`/api/integration`List integrations

Retrieve available integrations and their authentication methods.

Operation ID`integration.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Integration.Info[]`required

Items [Integration.Info](#schema-Integration.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/integration/{integrationID}`Get integration

Retrieve one integration and its authentication methods.

Operation ID`integration.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

post`/api/experimental/integration/wellknown`Add wellknown integration

Discover and persist an experimental wellknown integration source.

Operation ID`experimental.integration.wellknown.add`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`url`

`string`required

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/integration/{integrationID}/connect/key`Connect with key

Run a key authentication method and store the resulting credential.

Operation ID`integration.connect.key`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`key`

`string`required

`answer`

`Form.Answer | null`

[Form.Answer](#schema-Form.Answer)

or

`null`

`label`

`string | null`

`string`

or

`null`

post`/api/integration/{integrationID}/connect/external`Connect with external credentials

Run an external authentication method and store a reference to its credential source.

Operation ID`integration.connect.external`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`methodID`[Integration.MethodID](#schema-Integration.MethodID)

`answer`

`Form.Answer | null`

[Form.Answer](#schema-Form.Answer)

or

`null`

`label`

`string | null`

`string`

or

`null`

post`/api/integration/{integrationID}/connect/oauth`Begin OAuth connection

Start an OAuth attempt and return the authorization details.

Operation ID`integration.oauth.connect`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`methodID`[Integration.MethodID](#schema-Integration.MethodID)

`answer`

`Form.Answer | null`

[Form.Answer](#schema-Form.Answer)

or

`null`

`label`

`string | null`

`string`

or

`null`

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[Integration.AttemptEncoded](#schema-Integration.AttemptEncoded)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/integration/{integrationID}/connect/oauth/{attemptID}`Get OAuth attempt status

Poll the current status of an OAuth attempt.

Operation ID`integration.oauth.status`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `attemptID`required | path | [Integration.AttemptID](#schema-Integration.AttemptID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

delete`/api/integration/{integrationID}/connect/oauth/{attemptID}`Cancel OAuth connection

Cancel an OAuth attempt and release its resources.

Operation ID`integration.oauth.cancel`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `attemptID`required | path | [Integration.AttemptID](#schema-Integration.AttemptID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/integration/{integrationID}/connect/oauth/{attemptID}/complete`Complete OAuth connection

Complete a code-based OAuth attempt and store the resulting credential.

Operation ID`integration.oauth.complete`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `attemptID`required | path | [Integration.AttemptID](#schema-Integration.AttemptID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`code`

`string | null`

`string`

or

`null`

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`IntegrationNotFoundError | IntegrationAttemptNotFoundError | LocationNotFoundError

post`/api/integration/{integrationID}/connect/command`Begin command connection

Start a command authentication attempt.

Operation ID`integration.command.connect`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`methodID`[Integration.MethodID](#schema-Integration.MethodID)

`label`

`string | null`

`string`

or

`null`

get`/api/integration/{integrationID}/connect/command/{attemptID}`Get command attempt status

Poll the current status and output of a command authentication attempt.

Operation ID`integration.command.status`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `attemptID`required | path | [Integration.AttemptID](#schema-Integration.AttemptID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

delete`/api/integration/{integrationID}/connect/command/{attemptID}`Cancel command connection

Cancel a command authentication attempt and terminate its process.

Operation ID`integration.command.cancel`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `integrationID`required | path | [Integration.ID](#schema-Integration.ID) | No description |
| `attemptID`required | path | [Integration.AttemptID](#schema-Integration.AttemptID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/mcp`List MCP servers

Retrieve configured MCP servers and their connection status.

Operation ID`mcp.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Mcp.Server[]`required

Items [Mcp.Server](#schema-Mcp.Server)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

put`/api/experimental/mcp/{server}`Add MCP server

Add an MCP server at runtime or replace an existing one, connecting it immediately.

Operation ID`experimental.mcp.add`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `server`required | path | `string` | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

delete`/api/experimental/mcp/{server}`Remove MCP server

Stop an MCP server and remove it from the runtime set until restart.

Operation ID`experimental.mcp.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `server`required | path | `string` | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

post`/api/experimental/mcp/{server}/connect`Connect MCP server

Connect an MCP server at runtime, overriding a disabled configuration until restart.

Operation ID`experimental.mcp.connect`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `server`required | path | `string` | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

post`/api/experimental/mcp/{server}/disconnect`Disconnect MCP server

Disconnect an MCP server at runtime, removing its tools until reconnected.

Operation ID`experimental.mcp.disconnect`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `server`required | path | `string` | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

get`/api/mcp/resource`List MCP resources

Retrieve resources and resource templates from connected MCP servers.

Operation ID`mcp.resource.catalog`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[Mcp.ResourceCatalog](#schema-Mcp.ResourceCatalog)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/experimental/client-mcp/token`Create client MCP WebSocket token

Create a short-lived single-use ticket for opening a client MCP WebSocket connection from a browser.

Operation ID`experimental.mcp.client.token`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `x-opencode-ticket` | header | `string \| null`  `string`  or  `null` | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `name`required | query | `string` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[PtyTicket.ConnectToken](#schema-PtyTicket.ConnectToken)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`403`ForbiddenError

`application/json`[ForbiddenErrorEncoded](#schema-ForbiddenErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/experimental/client-mcp`Attach client MCP server

Upgrade to a WebSocket over which the client hosts an MCP server named after \`name\`; its tools stay available while the socket is open. One JSON-RPC message per text frame. Experimental: may change without compatibility guarantees.

Operation ID`experimental.mcp.client`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `name`required | query | `string` | No description |
| `ticket` | query | `string \| null`  `string`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`boolean`

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`403`ForbiddenError

`application/json`[ForbiddenErrorEncoded](#schema-ForbiddenErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/credential`List credentials

List every stored integration credential, including its secret value.

Operation ID`credential.list`

### Responses

`200`Success

`application/json`

`object`

`data`

`Credential.Entry[]`required

Items [Credential.Entry](#schema-Credential.Entry)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

post`/api/credential`Create credential

Store an integration credential. It becomes the integration's active credential unless activate is false and the integration already has one. Fails with a conflict when the requested ID already exists.

Operation ID`credential.create`

### Request body required

`application/json`[Credential.CreateInput](#schema-Credential.CreateInput)

### Responses

`200`Success

`application/json`

`object`

`data`[Credential.Entry](#schema-Credential.Entry)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`409`ConflictError

`application/json`[ConflictErrorEncoded](#schema-ConflictErrorEncoded)

patch`/api/credential/{credentialID}`Update credential

Update a stored credential label.

Operation ID`credential.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `credentialID`required | path | [Credential.ID](#schema-Credential.ID) | No description |

### Request body required

`application/json`

`object`

`label`

`string`required

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

delete`/api/credential/{credentialID}`Remove credential

Remove a stored integration credential.

Operation ID`credential.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `credentialID`required | path | [Credential.ID](#schema-Credential.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

post`/api/credential/{credentialID}/activate`Activate credential

Activate a stored integration credential.

Operation ID`credential.activate`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `credentialID`required | path | [Credential.ID](#schema-Credential.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

get`/api/project`List projects

List known projects. Archived projects are excluded unless archived=true.

Operation ID`project.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `archived` | query | `"true" \| "false" \| null`  `"true" \| "false"`  Values`"true" \| "false"`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`Project[]`

Items [Project](#schema-Project)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

patch`/api/project/{projectID}`Update project

Update the project canonical directory, display metadata, and workspace commands.

Operation ID`project.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `projectID`required | path | [Project.ID](#schema-Project.ID) | No description |

### Responses

`200`Project

`application/json`[Project](#schema-Project)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`ProjectNotFoundError

`application/json`[ProjectNotFoundErrorEncoded](#schema-ProjectNotFoundErrorEncoded)

get`/api/form`List pending forms

Retrieve pending forms for a location.

Operation ID`form.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Form.Info[]`required

Items [Form.Info](#schema-Form.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/permission/request`List pending permission requests

Retrieve pending permission requests for a location.

Operation ID`permission.request.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Permission.Request[]`required

Items [Permission.Request](#schema-Permission.Request)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/permission/saved`List saved permissions

Retrieve saved permissions, optionally filtered by project.

Operation ID`permission.saved.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `projectID` | query | `Project.ID \| null`  [Project.ID](#schema-Project.ID)  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`data`

`PermissionSaved.Info[]`required

Items [PermissionSaved.Info](#schema-PermissionSaved.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

patch`/api/permission/saved/{id}`Update saved permission

Change the action or resource of a saved permission. Fails with a conflict when the project already has a saved permission with the same action and resource.

Operation ID`permission.saved.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `id`required | path | [PermissionSaved.ID](#schema-PermissionSaved.ID) | No description |

### Request body required

`application/json`

`object`

`action`

`string | null`

`string`

or

`null`

`resource`

`string | null`

`string`

or

`null`

### Responses

`200`Success

`application/json`

`object`

`data`[PermissionSaved.Info](#schema-PermissionSaved.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`PermissionSavedNotFoundError

`application/json`[PermissionSavedNotFoundErrorEncoded](#schema-PermissionSavedNotFoundErrorEncoded)

`409`ConflictError

`application/json`[ConflictErrorEncoded](#schema-ConflictErrorEncoded)

delete`/api/permission/saved/{id}`Remove saved permission

Remove a saved permission by ID.

Operation ID`permission.saved.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `id`required | path | [PermissionSaved.ID](#schema-PermissionSaved.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

get`/api/session/{sessionID}/permission`List session permission requests

Retrieve pending permission requests owned by a session.

Operation ID`session.permission.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

post`/api/session/{sessionID}/permission`Create permission request

Evaluate and, when approval is required, create a permission request for a session.

Operation ID`session.permission.create`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

get`/api/session/{sessionID}/permission/{requestID}`Get permission request

Retrieve a pending permission request owned by a session.

Operation ID`session.permission.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `requestID`required | path | [Permission.ID](#schema-Permission.ID) | No description |

post`/api/session/{sessionID}/permission/{requestID}/reply`Reply to pending permission request

Respond to a pending permission request owned by a session.

Operation ID`session.permission.reply`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `requestID`required | path | [Permission.ID](#schema-Permission.ID) | No description |

### Request body required

`application/json`

`object`

`decision`[Permission.Reply](#schema-Permission.Reply)

`message`

`string | null`

`string`

or

`null`

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`SessionNotFoundError | PermissionNotFoundError | LocationNotFoundError

get`/api/fs/read/*`Read file

Stream one file relative to the requested location with ETag, Last-Modified, and single-range HTTP Range support (206 Partial Content, 416 Range Not Satisfiable, and 304 Not Modified; multi-range and malformed Range headers fall back to 200).

Operation ID`fs.read`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

get`/api/fs/list`List directory

List direct children using an absolute path or a path relative to the requested location, including parents and siblings outside its directory. Entry paths remain relative to the requested location; listing does not switch locations.

Operation ID`fs.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `path` | query | `string \| null`  An absolute path or a path relative to the requested location. Defaults to the location directory.  `string`  or  `null` | No description |

get`/api/fs/find`Find files

Find recursively ranked filesystem entries relative to the requested location.

Operation ID`fs.find`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `query`required | query | `string` | No description |
| `type` | query | `"file" \| "directory"`  Values`"file" \| "directory"` | No description |
| `limit` | query | `string \| null`  `string`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`FileSystem.Entry[]`required

Items [FileSystem.Entry](#schema-FileSystem.Entry)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/experimental/fs/write`Write file

Write the raw request body to an absolute path or a path relative to the requested location, creating parent directories, and return the resolved absolute path. Unlike read, the target is not confined to the location. Experimental: may change without compatibility guarantees.

Operation ID`experimental.fs.write`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `path`required | query | `string`  An absolute path or a path relative to the requested location. Missing parent directories are created. | No description |

### Request body required

`application/octet-stream`

`string<binary>`

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[FileSystem.Write](#schema-FileSystem.Write)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/experimental/fs/watch`Watch file

Watch one file relative to the requested location for 24 hours, publishing filesystem.changed on that location when it changes. Watching an already watched file resets its expiry. Paths follow read confinement. Experimental: may change without compatibility guarantees.

Operation ID`experimental.fs.watch`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`path`

`string`required

A file path relative to the requested location.

delete`/api/experimental/fs/watch`Unwatch file

Stop watching one file relative to the requested location. Experimental: may change without compatibility guarantees.

Operation ID`experimental.fs.unwatch`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`path`

`string`required

A file path relative to the requested location.

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/command`List commands

Retrieve currently registered commands.

Operation ID`command.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Command.Info[]`required

Items [Command.Info](#schema-Command.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/skill`List skills

Retrieve currently registered skills.

Operation ID`skill.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Skill.Info[]`required

Items [Skill.Info](#schema-Skill.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/rpc/{rpcID}/{method}`Call a plugin RPC

Dispatch a method to the currently registered RPC at the requested location.

Operation ID`rpc.call`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `rpcID`required | path | `string` | No description |
| `method`required | path | `string` | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`[Rpc.Input](#schema-Rpc.Input)

get`/api/event`Subscribe to events

Subscribe to native events and plugin RPC events across all server locations. Volatile by contract: a slow consumer overflows and fails the stream, and events during disconnection are missed.

Operation ID`event.subscribe`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `types` | query | `"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed" \| string \| "location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed" \| string[] \| null`  Only send events of these types, plus the initial server.connected event. When omitted, all events are sent.  `"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed" \| string \| "location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed" \| string[]`  `"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed" \| string`  `"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed"`  Values`"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed"`  or  `string`  pattern ^rpc\\.\[\\s\\S\]\*?$  or  `"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed" \| string[]`  Items  `"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed" \| string`  `"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed"`  Values`"location.shutdown" \| "models-dev.refreshed" \| "credential.updated" \| "credential.switched" \| "integration.updated" \| "provider.updated" \| "model.updated" \| "agent.updated" \| "session.created" \| "session.agent.selected" \| "session.model.selected" \| "session.moved" \| "session.renamed" \| "session.metadata.updated" \| "session.permissions" \| "session.viewed" \| "session.archived" \| "session.unarchived" \| "session.usage.updated" \| "session.deleted" \| "session.forked" \| "session.inbox.delivered" \| "session.inbox.enqueued" \| "session.inbox.cancelled" \| "session.inbox.delivery.changed" \| "session.execution.started" \| "session.execution.succeeded" \| "session.execution.failed" \| "session.execution.interrupted" \| "session.instructions.updated" \| "session.synthetic" \| "session.skill.activated" \| "session.shell.started" \| "session.shell.ended" \| "session.step.started" \| "session.step.streamed" \| "session.step.ended" \| "session.step.failed" \| "session.text.started" \| "session.text.delta" \| "session.text.ended" \| "session.reasoning.started" \| "session.reasoning.delta" \| "session.reasoning.ended" \| "session.tool.input.started" \| "session.tool.input.delta" \| "session.tool.input.ended" \| "session.tool.called" \| "session.tool.progress" \| "session.tool.success" \| "session.tool.failed" \| "session.retry.scheduled" \| "session.compaction.started" \| "session.compaction.delta" \| "session.compaction.ended" \| "session.compaction.failed" \| "session.revert.staged" \| "session.revert.cleared" \| "session.revert.committed" \| "filesystem.changed" \| "reference.updated" \| "permission.asked" \| "permission.replied" \| "plugin.updated" \| "project.updated" \| "worktree.updated" \| "worktree.resolved" \| "command.updated" \| "config.updated" \| "skill.updated" \| "pty.created" \| "pty.updated" \| "pty.exited" \| "pty.deleted" \| "persistent-pty.added" \| "persistent-pty.removed" \| "shell.created" \| "shell.exited" \| "shell.deleted" \| "form.created" \| "form.replied" \| "form.cancelled" \| "websearch.updated" \| "session.status" \| "session.idle" \| "tui.prompt.append" \| "tui.command.execute" \| "tui.toast.show" \| "tui.session.select" \| "installation.updated" \| "installation.update-available" \| "vcs.branch.updated" \| "mcp.status.changed" \| "mcp.resources.changed"`  or  `string`  pattern ^rpc\\.\[\\s\\S\]\*?$  or  `null` | No description |

get`/api/pty`List PTY sessions

List PTY sessions for a location, including exited sessions retained until removal.

Operation ID`pty.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Pty[]`required

Items [Pty](#schema-Pty)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/pty`Create PTY session

Create a pseudo-terminal session for a location.

Operation ID`pty.create`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`command`

`string`

`args`

`string[]`

Items

`string`

`cwd`

`string`

`title`

`string`

`env`

`object`

Additional properties

`string`

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[Pty](#schema-Pty)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/pty/{ptyID}`Get PTY session

Get one PTY session, including its exit code once exited.

Operation ID`pty.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

put`/api/pty/{ptyID}`Update PTY session

Update the title or viewport size of one PTY session.

Operation ID`pty.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`title`

`string`

`size`

`object`

`rows`

`integer`required

\> 0

`cols`

`integer`required

\> 0

delete`/api/pty/{ptyID}`Remove PTY session

Terminate and remove one PTY session.

Operation ID`pty.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

post`/api/pty/{ptyID}/connect-token`Create PTY WebSocket token

Create a short-lived single-use ticket for opening a PTY WebSocket connection.

Operation ID`pty.connect.token`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |
| `x-opencode-ticket` | header | `string \| null`  `string`  or  `null` | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

get`/api/pty/{ptyID}/connect`Connect to PTY session

Establish a WebSocket connection streaming PTY output and accepting terminal input.

Operation ID`pty.connect`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |
| `location[directory]` | query | `string` | No description |
| `cursor` | query | `string` | No description |
| `ticket` | query | `string` | No description |

get`/api/experimental/session/{sessionID}/terminal/read`Read the session's most recently controlled terminal

Read the last physical rows without changing selection or taking control. Omitted lines uses the live terminal height; larger counts include retained history. Blank rows are preserved. Screen dimensions and cursor remain relative to the live screen. Returns null when no current terminal exists. Selection is server-local and resets on restart. Experimental: may change without compatibility guarantees.

Operation ID`server.experimental.persistentPty.read`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |
| `lines` | query | `PersistentPty.ReadLinesEncoded \| null`  [PersistentPty.ReadLinesEncoded](#schema-PersistentPty.ReadLinesEncoded)  or  `null` | No description |

get`/api/experimental/session/{sessionID}/terminal`

Operation ID`server.experimental.persistentPty.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Responses

`200`Success

`application/json`

`object`

`data`

`PersistentPty.Info[]`required

Items [PersistentPty.Info](#schema-PersistentPty.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

post`/api/experimental/session/{sessionID}/terminal`

Operation ID`server.experimental.persistentPty.create`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `sessionID`required | path | [Session.ID](#schema-Session.ID) | No description |

### Request body required

`application/json`[PersistentPty.CreateInput](#schema-PersistentPty.CreateInput)

### Responses

`200`Success

`application/json`

`object`

`data`[PersistentPty.Info](#schema-PersistentPty.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

post`/api/experimental/persistent-pty/shutdown` post`/api/experimental/persistent-pty/handoff` get`/api/experimental/persistent-pty/{ptyID}`

Operation ID`server.experimental.persistentPty.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |

### Responses

`200`Success

`application/json`

`object`

`data`[PersistentPty.Info](#schema-PersistentPty.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`PtyNotFoundError

`application/json`[PtyNotFoundErrorEncoded](#schema-PtyNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

put`/api/experimental/persistent-pty/{ptyID}`

Operation ID`server.experimental.persistentPty.update`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |

### Request body required

`application/json`[PersistentPty.UpdateInput](#schema-PersistentPty.UpdateInput)

### Responses

`200`Success

`application/json`

`object`

`data`[PersistentPty.Info](#schema-PersistentPty.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`PtyNotFoundError

`application/json`[PtyNotFoundErrorEncoded](#schema-PtyNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

delete`/api/experimental/persistent-pty/{ptyID}`

Operation ID`server.experimental.persistentPty.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`PtyNotFoundError

`application/json`[PtyNotFoundErrorEncoded](#schema-PtyNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/experimental/persistent-pty/{ptyID}/snapshot`

Operation ID`server.experimental.persistentPty.snapshot`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |

### Responses

`200`Success

`application/json`

`object`

`data`[PersistentPty.Snapshot](#schema-PersistentPty.Snapshot)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`PtyNotFoundError

`application/json`[PtyNotFoundErrorEncoded](#schema-PtyNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

post`/api/experimental/persistent-pty/{ptyID}/connect-token`

Operation ID`server.experimental.persistentPty.connectToken`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |
| `x-opencode-ticket` | header | `string \| null`  `string`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`data`[PtyTicket.ConnectToken](#schema-PtyTicket.ConnectToken)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`403`ForbiddenError

`application/json`[ForbiddenErrorEncoded](#schema-ForbiddenErrorEncoded)

`404`PtyNotFoundError

`application/json`[PtyNotFoundErrorEncoded](#schema-PtyNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/experimental/persistent-pty/{ptyID}/connect`Connect to a persistent PTY

Stream persistent PTY output through the OpenCode server.

Operation ID`persistentPty.connect`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `ptyID`required | path | [Pty.ID](#schema-Pty.ID) | No description |
| `cursor` | query | `string` | No description |
| `role` | query | `string` | No description |
| `attachment_id` | query | `string` | No description |
| `takeover` | query | `string` | No description |
| `input_protocol` | query | `string` | No description |
| `ticket` | query | `string` | No description |

### Responses

`200`Success

`application/json`

`boolean`

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`403`ForbiddenError

`application/json`[ForbiddenErrorEncoded](#schema-ForbiddenErrorEncoded)

`404`PtyNotFoundError

`application/json`[PtyNotFoundErrorEncoded](#schema-PtyNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/experimental/media/{hash}`Read media blob

Read a content-addressed media blob by SHA-256 hash with immutable Cache-Control, ETag, and 304 Not Modified support. Only blobs a stored message or inbox item still references are served. Experimental: may change without compatibility guarantees.

Operation ID`experimental.media.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `hash`required | path | [MediaHash](#schema-MediaHash) | No description |

### Responses

`200`Success

`application/octet-stream`

`string<binary>`

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`FileNotFoundError

`application/json`[FileNotFoundErrorEncoded](#schema-FileNotFoundErrorEncoded)

get`/api/shell`List running shell commands

List currently running shell commands for a location. Exited commands are not included.

Operation ID`shell.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Shell.Info[]`required

Items [Shell.Info](#schema-Shell.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

post`/api/shell`Run shell command

Spawn one non-interactive shell command for a location. Combined stdout/stderr is captured to a file pageable via output.

Operation ID`shell.create`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`command`

`string`required

`cwd`

`string`

`timeout`

`integer`

min 0

`metadata`

`object`

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[Shell.Info](#schema-Shell.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/shell/{id}`Get shell command

Get one shell command, including its status and exit code once exited.

Operation ID`shell.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `id`required | path | [Shell.ID](#schema-Shell.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

delete`/api/shell/{id}`Remove shell command

Terminate and remove one shell command and its retained output.

Operation ID`shell.remove`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `id`required | path | [Shell.ID](#schema-Shell.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/shell/{id}/output`Read shell output

Page through captured combined output by absolute byte cursor.

Operation ID`shell.output`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `id`required | path | [Shell.ID](#schema-Shell.ID) | No description |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `cursor` | query | `string`  pattern ^\[+-\]?\\d\*\\.?\\d+(?:\[Ee\]\[+-\]?\\d+)?$ | No description |
| `limit` | query | `string`  pattern ^\[+-\]?\\d\*\\.?\\d+(?:\[Ee\]\[+-\]?\\d+)?$ | No description |

get`/api/reference`List references

List references available in the requested location.

Operation ID`reference.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Reference.Info[]`required

Items [Reference.Info](#schema-Reference.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/worktree`List worktrees

Return the project's saved worktree inventory without loading configuration or running discovery.

Operation ID`worktree.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `projectID`required | query | [Project.ID](#schema-Project.ID) | No description |

### Responses

`200`Worktree.List

`application/json`[Worktree.List](#schema-Worktree.List)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`ProjectNotFoundError

`application/json`[ProjectNotFoundErrorEncoded](#schema-ProjectNotFoundErrorEncoded)

post`/api/worktree`Create worktree

Load the project's canonical configuration, create a local worktree using its selected strategy, then run the project's setup script.

Operation ID`worktree.create`

### Request body required

`application/json`[Worktree.CreateInput](#schema-Worktree.CreateInput)

delete`/api/worktree`Remove worktree

Load the project's canonical configuration and remove a saved worktree using its recorded strategy.

Operation ID`worktree.remove`

### Request body required

`application/json`[Worktree.RemoveInput](#schema-Worktree.RemoveInput)

post`/api/worktree/refresh`Refresh worktrees

Load the project's canonical configuration, discover worktrees across known checkout roots using all available strategies, and reconcile saved state.

Operation ID`worktree.refresh`

### Request body required

`application/json`

`object`

`projectID`[Project.ID](#schema-Project.ID)

post`/api/vcs/init`Initialize VCS repository

Initialize a repository using the selected VCS provider in a markerless project's directory and refresh its location services. Omitting provider defaults to git; built-in git and hg providers support initialization. An unknown provider returns 400; a registered provider without init returns 501.

Operation ID`vcs.init`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `provider` | query | `string \| null`  `string`  or  `null` | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`409`ConflictError

`application/json`[ConflictErrorEncoded](#schema-ConflictErrorEncoded)

`501`VcsInitNotSupportedError

`application/json`[VcsInitNotSupportedErrorEncoded](#schema-VcsInitNotSupportedErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/vcs`VCS info

Get current and default branch information for the requested location.

Operation ID`vcs.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[Vcs.Info](#schema-Vcs.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/vcs/base`VCS review base

Infer a local review base from named branch creation history, or the repository default only when currently on that branch. Returns null before the first commit or when the provider lacks base metadata; ambiguous Git history requires an explicit base on diff requests.

Operation ID`vcs.base`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

get`/api/vcs/status`VCS status

List uncommitted working-copy changes relative to the requested location.

Operation ID`vcs.status`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`Vcs.FileStatus[]`required

Items [Vcs.FileStatus](#schema-Vcs.FileStatus)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/vcs/branch`VCS branches

List local and remote branches available at the requested location.

Operation ID`vcs.branch.list`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `search` | query | `string \| null`  `string`  or  `null` | No description |
| `limit` | query | `string \| null`  `string`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[Vcs.BranchList](#schema-Vcs.BranchList)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/vcs/diff`VCS diff

Diff HEAD to the working copy (working), the base merge-base to the working copy (branch), or the base merge-base to HEAD (committed). Omitting base preserves repository-default comparison; supplying it overrides the comparison without saving it.

Operation ID`vcs.diff`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |
| `mode`required | query | [Vcs.Mode](#schema-Vcs.Mode) | No description |
| `base` | query | `string` | No description |
| `context` | query | `string \| null`  `string`  or  `null` | No description |
| `untracked` | query | [Vcs.Untracked](#schema-Vcs.Untracked) | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`FileDiff.Info[]`required

Items [FileDiff.Info](#schema-FileDiff.Info)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

post`/api/debug/heap-dump`Write a heap snapshot

Write a JavaScript heap snapshot of the server process into its log directory, or the requested directory, and return the server-local path once the file is complete. Pauses the server while the heap serializes and can temporarily increase its memory use. The snapshot can contain credentials, prompts, and file contents.

Operation ID`debug.heapDump`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `directory` | query | `string \| null`  Absolute server-local directory to write the snapshot into, created when missing. Defaults to the server's log directory.  `string`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`path`

`string`required

`pid`

`integer`required

`memory`

`object`required

The server process's memory in bytes, read just before the snapshot (Node's process.memoryUsage()). rss covers native memory the snapshot cannot show.

`rss`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`heapTotal`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`heapUsed`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`external`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`arrayBuffers`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`500`UnknownError

`application/json`[UnknownErrorEncoded](#schema-UnknownErrorEncoded)

get`/api/debug/location`List loaded locations

List locations currently loaded by the server.

Operation ID`debug.location.list`

### Responses

`200`Success

`application/json`

`Location.PublicRef[]`

Items [Location.PublicRef](#schema-Location.PublicRef)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

delete`/api/debug/location`Evict a loaded location

Dispose the requested location's cached services so its next use boots them fresh.

Operation ID`debug.location.evict`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

get`/api/experimental/migration/v1`Get V1 migration status

Return the progress of the V1 to V2 session history migration.

Operation ID`experimental.migration.v1.status`

### Responses

`200`Success

`application/json`

`object | object | object`

`object`

`status`

`"required" | "completed"`required

Values`"required" | "completed"`

or

`object`

`status`

`"running"`required

Values`"running"`

`progress`

`object`required

`label`

`string`required

`numerator`

`integer | null`

`integer`

min 0

or

`null`

`denominator`

`integer | null`

`integer`

min 0

or

`null`

or

`object`

`status`

`"error"`required

Values`"error"`

`error`

`string`required

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

get`/api/websearch/provider`List web search providers

Return the registered web search providers.

Operation ID`websearch.providers`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`

`WebSearch.Provider[]`required

Items [WebSearch.Provider](#schema-WebSearch.Provider)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

post`/api/websearch`Search the web

Run one web search through the selected provider. Specify a provider to override the configured default.

Operation ID`websearch.query`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Request body required

`application/json`

`object`

`query`

`string`required

`providerID`[WebSearch.ID](#schema-WebSearch.ID)

### Responses

`200`Success

`application/json`

`object`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`data`[WebSearch.ResponseEncoded](#schema-WebSearch.ResponseEncoded)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`503`ServiceUnavailableError

`application/json`[ServiceUnavailableErrorEncoded](#schema-ServiceUnavailableErrorEncoded)

get`/api/experimental/usage/limits`Get usage limits

Return the OpenCode Go allowance and Console budgets of the OpenCode Console workspace the location is signed in to, or null when it isn't signed in.

Operation ID`experimental.usage.limits`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

get`/api/config`Get configuration

Return configuration documents and discovery sources for the requested location, from lowest to highest priority.

Operation ID`config.get`

### Parameters

| Name | Location | Type | Description |
| --- | --- | --- | --- |
| `location` | query | `object \| null`  `object`  `directory`  `string \| null`  `string`  or  `null`  or  `null` | No description |

### Responses

`200`Success

`application/json`

`Config.Entry[]`

Items [Config.Entry](#schema-Config.Entry)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

get`/api/config/shell`List available shells

Return shells available to terminal and agent execution.

Operation ID`config.shells`

### Responses

`200`Success

`application/json`

`ConfigShell.Option[]`

Items [ConfigShell.Option](#schema-ConfigShell.Option)

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

patch`/api/experimental/config`Update global configuration

Patch supported fields in the highest-precedence global configuration document.

Operation ID`experimental.config.update`

### Request body required

`application/json`[Config.Patch](#schema-Config.Patch)

### Responses

`204`\<No Content>

`400`InvalidRequestError

`application/json`[InvalidRequestErrorEncoded](#schema-InvalidRequestErrorEncoded)

`401`UnauthorizedError

`application/json`[UnauthorizedErrorEncoded](#schema-UnauthorizedErrorEncoded)

`404`LocationNotFoundError

`application/json`[LocationNotFoundErrorEncoded](#schema-LocationNotFoundErrorEncoded)

`AbsolutePath`string

`string`

`Agent.Color`string

`string`

`Agent.ID`string

`string`

`Agent.Info`object

`object`

`id`[Agent.ID](#schema-Agent.ID)

`name`

`string`required

`model`[Model.Ref](#schema-Model.Ref)

`request`[Provider.Request](#schema-Provider.Request)

`system`

`string`

`description`

`string`

`mode`

`"subagent" | "primary" | "all"`required

Values`"subagent" | "primary" | "all"`

`hidden`

`boolean`required

`color`[Agent.Color](#schema-Agent.Color)

`steps`

`integer`

\> 0

`permissions`[Permission.Ruleset](#schema-Permission.Ruleset)

`AgentNotFoundErrorEncoded`object

`object`

`_tag`

`"AgentNotFoundError"`required

Values`"AgentNotFoundError"`

`agentID`

`string`required

`message`

`string`required

`Command.Info`object

`object`

`name`

`string`required

`description`

`string`

`CommandExecutionErrorEncoded`object

`object`

`_tag`

`"CommandExecutionError"`required

Values`"CommandExecutionError"`

`command`

`string`required

`message`

`string`required

`CommandNotFoundErrorEncoded`object

`object`

`_tag`

`"CommandNotFoundError"`required

Values`"CommandNotFoundError"`

`command`

`string`required

`message`

`string`required

`Config.AgentEncoded`object

`object`

`model`

`string | object`

`string`

pattern ^\[^/#\]+\\/\[^#\]+(?:#\[^#\]+)?$

or

`object`

`providerID`

`string`required

pattern ^\[^/#\]+$

`model`

`string`required

pattern ^\[^#\]+$

`variant`

`string`

pattern ^\[^#\]+$

`request`

`object`

`headers`

`object`

Additional properties

`string`

`body`

`object`

`system`

`string`

`description`

`string`

`mode`

`"subagent" | "primary" | "all"`

Values`"subagent" | "primary" | "all"`

`hidden`

`boolean`

`color`

`string`

pattern ^#\[0-9a-fA-F\]{6}$

`steps`

`integer`

\> 0

`disabled`

`boolean`

`permissions`[Permission.Ruleset](#schema-Permission.Ruleset)

`Config.CommandEncoded`object

`object`

`template`

`string`required

`description`

`string`

`agent`

`string`

`model`

`string | object`

`string`

pattern ^\[^/#\]+\\/\[^#\]+(?:#\[^#\]+)?$

or

`object`

`providerID`

`string`required

pattern ^\[^/#\]+$

`model`

`string`required

pattern ^\[^#\]+$

`variant`

`string`

pattern ^\[^#\]+$

`subagent`

`boolean`

`subtask`

`boolean`

Deprecated alias for subagent.

`Config.DirectoryEncoded`object

`object`

`type`

`"directory"`required

Values`"directory"`

`path`[AbsolutePath](#schema-AbsolutePath)

`Config.DocumentEncoded`object

`object`

`type`

`"document"`required

Values`"document"`

`path`[AbsolutePath](#schema-AbsolutePath)

`info`[Config.InfoEncoded](#schema-Config.InfoEncoded)

`Config.Entry`Config.DocumentEncoded | Config.DirectoryEncoded `Config.Formatter.EntryEncoded`object

`object`

`disabled`

`boolean`

`command`

`string[]`

Items

`string`

`environment`

`object`

Additional properties

`string`

`extensions`

`string[]`

Items

`string`

`Config.InfoEncoded`object `Config.LSP.ServerEncoded`object

`object`

`command`

`string[]`required

Items

`string`

`extensions`

`string[]`

Items

`string`

`disabled`

`boolean`

`env`

`object`

Additional properties

`string`

`initialization`

`object`

`Config.Model.Capabilities`object

`object`

`tools`

`boolean`

`input`

`string[]`

Items

`string`

`output`

`string[]`

Items

`string`

`temperature`

`boolean`

`reasoning`[Config.Model.Reasoning](#schema-Config.Model.Reasoning)

`Config.Model.CostEncoded`object

`object`

`tier`

`object`

`type`

`"context"`required

Values`"context"`

`size`

`integer`required

`input`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`output`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`cache`

`object`

`read`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`write`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`Config.Model.Reasoning`object | object

`object | object`

`object`

`supported`

`false`required

Values`false`

or

`object`

`supported`

`true`required

Values`true`

`toggle`

`boolean`

`effort`

`string[]`

Items

`string`

`budget`

`object`

`min`

`integer`

`max`

`integer`

`Config.Model.Settings`object `Config.Model.VariantSettings`object

`object`

`object`

Additional properties

`object | null`

`object`

or

`null`

`compaction`[Provider.Compaction](#schema-Provider.Compaction)

`encoding`[Provider.Encoding](#schema-Provider.Encoding)

`Config.ModelEncoded`object `Config.Patch`object

`object`

`shell`

`string | null`required

`string`

or

`null`

`Config.Plugin.EntryEncoded`object

`object`

`package`

`string`required

`options`

`object`

`Config.Provider.Settings`object

`object`

`object`

Additional properties

`object | null`

`object`

or

`null`

`Config.ProviderEncoded`object `Config.Reference.GitEncoded`object

`object`

`repository`

`string`required

`branch`

`string`

`description`

`string`

`hidden`

`boolean`

`Config.Reference.LocalEncoded`object

`object`

`path`

`string`required

`description`

`string`

`hidden`

`boolean`

`Config.WarmingEncoded`object

`object`

`prompt`

`string`

`interval`

`string`

`duration`

`string`

`Config.Worktree`object

`object`

`directory`

`string`required

`ConfigShell.Option`object

`object`

`path`

`string`required

`name`

`string`required

`acceptable`

`boolean`required

`ConfigWebSearch.InfoEncoded`object

`object`

`provider`

`"random" | WebSearch.ID`required

`"random"`

Reuse a randomly selected provider until it is rate limited, then switch to another available provider.

Values`"random"`

or [WebSearch.ID](#schema-WebSearch.ID)

`ConflictErrorEncoded`object

`object`

`_tag`

`"ConflictError"`required

Values`"ConflictError"`

`message`

`string`required

`resource`

`string | null`

`string`

or

`null`

`Connection.CredentialInfo`object

`object`

`type`

`"credential"`required

Values`"credential"`

`id`[Credential.ID](#schema-Credential.ID)

`label`

`string`required

`method`

`"key" | "oauth" | "external"`required

Values`"key" | "oauth" | "external"`

`status`[Connection.Status](#schema-Connection.Status)

`Connection.EnvInfo`object

`object`

`type`

`"env"`required

Values`"env"`

`name`

`string`required

`status`[Connection.Status](#schema-Connection.Status)

`Connection.Info`Connection.CredentialInfo | Connection.EnvInfo `Connection.Status`object

`object`

`status`

`"needs_auth"`required

`"needs_auth"`

Values`"needs_auth"`

`message`

`string`required

`url`

`string`

`Credential.CreateInput`object

`object`

`id`[Credential.ID](#schema-Credential.ID)

`integrationID`[Integration.ID](#schema-Integration.ID)

`label`

`string`

`value`[Credential.Value](#schema-Credential.Value)

`activate`

`boolean`

`Credential.Entry`object

`object`

`id`[Credential.ID](#schema-Credential.ID)

`integrationID`[Integration.ID](#schema-Integration.ID)

`label`

`string`required

`active`

`boolean`required

`value`[Credential.Value](#schema-Credential.Value)

`Credential.External`object

`object`

`type`

`"external"`required

Values`"external"`

`methodID`[Integration.MethodID](#schema-Integration.MethodID)

`metadata`

`object`

`Credential.ID`string

`string`

`Credential.Key`object

`object`

`type`

`"key"`required

Values`"key"`

`key`

`string`required

`metadata`

`object`

`Credential.OAuth`object

`object`

`type`

`"oauth"`required

Values`"oauth"`

`methodID`[Integration.MethodID](#schema-Integration.MethodID)

`refresh`

`string`required

`access`

`string`required

`expires`

`integer`required

min 0

`metadata`

`object`

`Credential.Value`Credential.OAuth | Credential.Key | Credential.External `Event.SeqEncoded`string

`string`

`FileNotFoundErrorEncoded`object

`object`

`_tag`

`"FileNotFoundError"`required

Values`"FileNotFoundError"`

`path`

`string`required

`message`

`string`required

`FileSystem.Entry`object

`object`

`path`[RelativePath](#schema-RelativePath)

`type`

`"file" | "directory"`required

Values`"file" | "directory"`

`FileSystem.Write`object

`object`

`path`[AbsolutePath](#schema-AbsolutePath)

`ForbiddenErrorEncoded`object

`object`

`_tag`

`"ForbiddenError"`required

Values`"ForbiddenError"`

`message`

`string`required

`Form.Answer`object

`object`

Additional properties [Form.Value](#schema-Form.Value)

`Form.BooleanField`object

`object`

`key`

`string`required

`title`

`string`

`description`

`string`

`required`

`boolean`

`hidden`

`boolean`

`when`

`Form.When[]`

Items [Form.When](#schema-Form.When)

`type`

`"boolean"`required

Values`"boolean"`

`default`

`boolean`

`Form.CreatePayload`object `Form.Detail`object

`object`

`id`[Form.ID](#schema-Form.ID)

`sessionID`

`string`required

`title`

`string`required

`metadata`[Form.Metadata](#schema-Form.Metadata)

`fields`[Form.Fields](#schema-Form.Fields)

`state`[Form.State](#schema-Form.State)

`Form.ExternalField`object

`object`

`key`

`string`required

`type`

`"external"`required

Values`"external"`

`url`

`string`required

`title`

`string`

`description`

`string`

`Form.Field`Form.StringField | Form.NumberField | Form.IntegerField | Form.BooleanField | Form.MultiselectField | Form.ExternalField `Form.Fields`Form.Field\[\]

`Form.Field[]`

min items 1

Items [Form.Field](#schema-Form.Field)

`Form.Fields_1`Form.Field\[\]

`Form.Field[]`

min items 1

Items [Form.Field](#schema-Form.Field)

`Form.Fields_2`Form.Field\[\]

`Form.Field[]`

min items 1

Items [Form.Field](#schema-Form.Field)

`Form.Fields_3`Form.Field\[\]

`Form.Field[]`

min items 1

Items [Form.Field](#schema-Form.Field)

`Form.ID`string

`string`

pattern ^frm\_

`Form.Info`object

`object`

`id`[Form.ID](#schema-Form.ID)

`sessionID`

`string`required

`title`

`string`required

`metadata`[Form.Metadata](#schema-Form.Metadata)

`fields`[Form.Fields](#schema-Form.Fields)

`Form.IntegerField`object

`object`

`key`

`string`required

`title`

`string`

`description`

`string`

`required`

`boolean`

`hidden`

`boolean`

`when`

`Form.When[]`

Items [Form.When](#schema-Form.When)

`type`

`"integer"`required

Values`"integer"`

`minimum`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`maximum`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`default`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`Form.MultiselectField`object `Form.NumberField`object

`object`

`key`

`string`required

`title`

`string`

`description`

`string`

`required`

`boolean`

`hidden`

`boolean`

`when`

`Form.When[]`

Items [Form.When](#schema-Form.When)

`type`

`"number"`required

Values`"number"`

`minimum`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`maximum`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`default`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`Form.Option`object

`object`

`value`

`string`required

`label`

`string`required

`description`

`string`

`Form.Reply`object

`object`

`answer`[Form.Answer](#schema-Form.Answer)

`Form.State`object | object | object

`object | object | object`

`object`

`status`

`"pending"`required

Values`"pending"`

or

`object`

`status`

`"answered"`required

Values`"answered"`

`answer`[Form.Answer](#schema-Form.Answer)

or

`object`

`status`

`"cancelled"`required

Values`"cancelled"`

`message`

`string`

`Form.StringField`object

`object`

`key`

`string`required

`title`

`string`

`description`

`string`

`required`

`boolean`

`hidden`

`boolean`

`when`

`Form.When[]`

Items [Form.When](#schema-Form.When)

`type`

`"string"`required

Values`"string"`

`format`

`"email" | "uri" | "date" | "date-time"`

Values`"email" | "uri" | "date" | "date-time"`

`minLength`

`integer`

min 0

`maxLength`

`integer`

min 0

`pattern`

`string`

`placeholder`

`string`

`default`

`string`

`options`

`Form.Option[]`

Items [Form.Option](#schema-Form.Option)

`custom`

`boolean`

`Form.Value`string | number | "Infinity" | "-Infinity" | "NaN" | boolean | string\[\]

`string | number | "Infinity" | "-Infinity" | "NaN" | boolean | string[]`

`string`

or

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`boolean`

or

`string[]`

Items

`string`

`Form.When`object

`object`

`key`

`string`required

`op`

`"eq" | "neq"`required

Values`"eq" | "neq"`

`value`

`string | number | "Infinity" | "-Infinity" | "NaN" | boolean`required

`string`

or

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`boolean`

`FormAlreadySettledErrorEncoded`object

`object`

`_tag`

`"FormAlreadySettledError"`required

Values`"FormAlreadySettledError"`

`id`

`string`required

`message`

`string`required

`FormInvalidAnswerErrorEncoded`object

`object`

`_tag`

`"FormInvalidAnswerError"`required

Values`"FormInvalidAnswerError"`

`id`

`string`required

`message`

`string`required

`FormNotFoundErrorEncoded`object

`object`

`_tag`

`"FormNotFoundError"`required

Values`"FormNotFoundError"`

`id`

`string`required

`message`

`string`required

`Generate.ChoiceAnswer`object

`object`

`type`

`"choice"`required

Values`"choice"`

`name`

`string`required

`choice`[Generate.ChoiceValue](#schema-Generate.ChoiceValue)

`probabilities`

`object[]`required

Items

`object`

`value`[Generate.ChoiceValue](#schema-Generate.ChoiceValue)

`probability`

`number`required

min 0, max 1

`confidence`

`number`required

min 0, max 1

`Generate.ChoiceQuestion`object

`object`

Pick one value from a fixed set

`type`

`"choice"`required

Values`"choice"`

`name`

`string`required

Unique within the request; echoed on the matching answer

`instructions`

`string`required

`choices`

`object[]`required

min items 1

Items

`object`

`value`[Generate.ChoiceValue](#schema-Generate.ChoiceValue)

`description`

`string`

`Generate.ChoiceValue`string | boolean

`string | boolean`

Choice values are typed: true and "true" are different values

`string`

or

`boolean`

`Generate.DecisionAnswer`Generate.PredicateAnswer | Generate.ChoiceAnswer | Generate.ScoreAnswer | Generate.ErrorAnswer `Generate.DecisionFilePart`object

`object`

`type`

`"file"`required

Values`"file"`

`data`[Prompt.Base64](#schema-Prompt.Base64)

`mime`

`string`required

`name`

`string`

`Generate.DecisionJsonPart`object

`object`

`type`

`"json"`required

Values`"json"`

`value`

`object`required

`Generate.DecisionPart`Generate.DecisionTextPart | Generate.DecisionJsonPart | Generate.DecisionFilePart `Generate.DecisionQuestion`Generate.PredicateQuestion | Generate.ChoiceQuestion | Generate.ScoreQuestion `Generate.DecisionRequest`object

`object`

`model`[Model.Ref](#schema-Model.Ref)

`input`

`Generate.DecisionPart[]`required

The evidence every question is asked about, in order

Items [Generate.DecisionPart](#schema-Generate.DecisionPart)

`questions`

`Generate.DecisionQuestion[]`required

Question names must be unique; duplicates fail with InvalidRequestError

min items 1

Items [Generate.DecisionQuestion](#schema-Generate.DecisionQuestion)

`Generate.DecisionResult`object `Generate.DecisionTextPart`object

`object`

`type`

`"text"`required

Values`"text"`

`text`

`string`required

`Generate.ErrorAnswer`object

`object`

This one question has no answer; the other answers still came back

`type`

`"error"`required

Values`"error"`

`name`

`string`required

`reason`

`string`required

Why the question has no answer, for example refusal

`message`

`string`

`Generate.File`object

`object`

`data`[Prompt.Base64](#schema-Prompt.Base64)

`mime`

`string`required

`name`

`string`

`Generate.ImageAspect`string

`string`

Aspect ratio as width:height, for example 16:9

pattern ^\[+-\]?\\d\*\\.?\\d+(?:\[Ee\]\[+-\]?\\d+)?:\[+-\]?\\d\*\\.?\\d+(?:\[Ee\]\[+-\]?\\d+)?$

`Generate.ImageOutput`object

`object`

`type`

`"image"`required

Values`"image"`

`data`[Prompt.Base64](#schema-Prompt.Base64)

`mime`

`string`required

`name`

`string`

`Generate.ImageRequest`object

`object`

`model`[Model.Ref](#schema-Model.Ref)

`prompt`

`string`required

`images`

`Generate.File[]`

Items [Generate.File](#schema-Generate.File)

`n`

`integer`

\> 0

`aspect`[Generate.ImageAspect](#schema-Generate.ImageAspect)

`resolution`[Generate.ImageResolution](#schema-Generate.ImageResolution)

`Generate.ImageResolution`"1K" | "2K" | "4K" | string

`"1K" | "2K" | "4K" | string`

Size tier such as 1K, 2K or 4K; 1K is about as many pixels as 1024x1024 at the requested aspect

`"1K" | "2K" | "4K"`

Values`"1K" | "2K" | "4K"`

or

`string`

`Generate.ImageResult`object

`object`

`images`

`Generate.ImageOutput[]`required

Items [Generate.ImageOutput](#schema-Generate.ImageOutput)

`cost`[Money.USD](#schema-Money.USD)

`tokens`[Generate.Usage](#schema-Generate.Usage)

`native`[Generate.Native](#schema-Generate.Native)

`Generate.Native`object

`object`

Provider-specific data the shared fields do not cover

`Generate.Native_1`object

`object`

Provider-specific data the shared fields do not cover

`Generate.PredicateAnswer`object

`object`

`type`

`"predicate"`required

Values`"predicate"`

`name`

`string`required

`probability`

`number`required

min 0, max 1

`Generate.PredicateQuestion`object

`object`

The probability that a statement is true

`type`

`"predicate"`required

Values`"predicate"`

`name`

`string`required

Unique within the request; echoed on the matching answer

`instructions`

`string`required

`Generate.ScoreAnswer`object

`object`

`type`

`"score"`required

Values`"score"`

`name`

`string`required

`score`

`number`required

Probability-weighted level index, so it can fall between levels

`probabilities`

`object[]`required

Items

`object`

`value`

`integer`required

`label`

`string`required

`probability`

`number`required

min 0, max 1

`confidence`

`number`required

min 0, max 1

`Generate.ScoreQuestion`object

`object`

Place the input on ordered levels, lowest first

`type`

`"score"`required

Values`"score"`

`name`

`string`required

Unique within the request; echoed on the matching answer

`instructions`

`string`required

`levels`

`object[]`required

min items 1

Items

`object`

`label`

`string`required

`description`

`string`

`Generate.Usage`object

`object`

Token counts, when the provider reports them

`input`

`number`

`output`

`number`

`GenerateDecisionsResponse`object

`object`

`data`[Generate.DecisionResult](#schema-Generate.DecisionResult)

`GenerateImageResponse`object

`object`

`data`[Generate.ImageResult](#schema-Generate.ImageResult)

`GenerateTextResponse`object

`object`

`data`

`object`required

`text`

`string`required

`InstructionEntry.Info`object

`object`

`key`[InstructionEntry.Key](#schema-InstructionEntry.Key)

`value`

`object`required

JSON value attached to the session's instructions

`InstructionEntry.Key`string

`string`

Instruction entry key (lowercase alphanumerics plus. \_ -)

pattern ^\[a-z0-9\]\[a-z0-9.\_-\]\*$

`InstructionEntryValueTooLargeErrorEncoded`object

`object`

`_tag`

`"InstructionEntryValueTooLargeError"`required

Values`"InstructionEntryValueTooLargeError"`

`actualBytes`

`integer`required

`maxBytes`

`integer`required

`message`

`string`required

`Integration.AttemptEncoded`object

`object`

`attemptID`[Integration.AttemptID](#schema-Integration.AttemptID)

`url`

`string`required

`instructions`

`string`required

`mode`

`"auto" | "code"`required

Values`"auto" | "code"`

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`Integration.AttemptID`string

`string`

`Integration.AttemptStatus`object | object | object | object

`object | object | object | object`

`object`

`status`

`"pending"`required

Values`"pending"`

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`object`

`status`

`"complete"`required

Values`"complete"`

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`object`

`status`

`"failed"`required

Values`"failed"`

`message`

`string`required

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`object`

`status`

`"expired"`required

Values`"expired"`

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`Integration.CommandAttempt`object

`object`

`attemptID`[Integration.AttemptID](#schema-Integration.AttemptID)

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`Integration.CommandAttemptStatus`object | object | object | object

`object | object | object | object`

`object`

`status`

`"pending"`required

Values`"pending"`

`message`

`string`

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`object`

`status`

`"complete"`required

Values`"complete"`

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`object`

`status`

`"failed"`required

Values`"failed"`

`message`

`string`required

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`object`

`status`

`"expired"`required

Values`"expired"`

`time`

`object`required

`created`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`expires`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`Integration.CommandMethod`object

`object`

`id`[Integration.MethodID](#schema-Integration.MethodID)

`type`

`"command"`required

Values`"command"`

`label`

`string`required

`command`

`string[]`required

Items

`string`

`Integration.EnvMethod`object

`object`

`type`

`"env"`required

Values`"env"`

`names`

`string[]`required

Items

`string`

`Integration.ExternalMethod`object

`object`

`id`[Integration.MethodID](#schema-Integration.MethodID)

`type`

`"external"`required

Values`"external"`

`label`

`string`required

`form`[Form.Fields\_3](#schema-Form.Fields_3)

`Integration.ID`string

`string`

`Integration.Info`object

`object`

`id`[Integration.ID](#schema-Integration.ID)

`name`

`string`required

`metadata`

`object`

`methods`

`Integration.Method[]`required

Items [Integration.Method](#schema-Integration.Method)

`connections`

`Connection.Info[]`required

Items [Connection.Info](#schema-Connection.Info)

`Integration.KeyMethod`object

`object`

`type`

`"key"`required

Values`"key"`

`label`

`string`

`form`[Form.Fields\_2](#schema-Form.Fields_2)

`Integration.Method`Integration.OAuthMethod | Integration.CommandMethod | Integration.KeyMethod | Integration.ExternalMethod | Integration.EnvMethod `Integration.MethodID`string

`string`

`Integration.OAuthMethod`object

`object`

`id`[Integration.MethodID](#schema-Integration.MethodID)

`type`

`"oauth"`required

Values`"oauth"`

`label`

`string`required

`form`[Form.Fields\_1](#schema-Form.Fields_1)

`IntegrationAttemptNotFoundErrorEncoded`object

`object`

`_tag`

`"IntegrationAttemptNotFoundError"`required

Values`"IntegrationAttemptNotFoundError"`

`integrationID`

`string`required

`attemptID`

`string`required

`message`

`string`required

`IntegrationMethodNotFoundErrorEncoded`object

`object`

`_tag`

`"IntegrationMethodNotFoundError"`required

Values`"IntegrationMethodNotFoundError"`

`integrationID`

`string`required

`methodID`

`string`required

`message`

`string`required

`IntegrationNotFoundErrorEncoded`object

`object`

`_tag`

`"IntegrationNotFoundError"`required

Values`"IntegrationNotFoundError"`

`integrationID`

`string`required

`message`

`string`required

`InvalidCursorErrorEncoded`object

`object`

`_tag`

`"InvalidCursorError"`required

Values`"InvalidCursorError"`

`message`

`string`required

`InvalidRequestErrorEncoded`object

`object`

`_tag`

`"InvalidRequestError"`required

Values`"InvalidRequestError"`

`message`

`string`required

`kind`

`string | null`

`string`

or

`null`

`field`

`string | null`

`string`

or

`null`

`Location.PublicInfo`object

`object`

`directory`[AbsolutePath](#schema-AbsolutePath)

`project`

`object`required

`id`[Project.ID](#schema-Project.ID)

`directory`[AbsolutePath](#schema-AbsolutePath)

`canonical`[AbsolutePath](#schema-AbsolutePath)

`Location.PublicRef`object

`object`

`directory`[AbsolutePath](#schema-AbsolutePath)

`LocationNotFoundErrorEncoded`object

`object`

`_tag`

`"LocationNotFoundError"`required

Values`"LocationNotFoundError"`

`location`[Location.PublicRef](#schema-Location.PublicRef)

`message`

`string`required

`Mcp.LocalConfigEncoded`object

`object`

`type`

`"local"`required

Values`"local"`

`command`

`string[]`required

Items

`string`

`cwd`

`string`

`environment`

`object`

Additional properties

`string`

`disabled`

`boolean`

`codemode`

`boolean`

`timeout`

`object`

`startup`

`integer`

\> 0

`catalog`

`integer`

\> 0

`execution`

`integer`

\> 0

`protocol`[Mcp.Protocol](#schema-Mcp.Protocol)

`Mcp.OAuthConfigEncoded`object

`object`

`client_id`

`string`

`client_secret`

`string`

`scope`

`string`

`callback_port`

`integer`

min 1, max 65535

`redirect_uri`

`string`

`auth_server_metadata_url`

`string`

`Mcp.Protocol`"legacy" | "auto" | "2026-07-28"

`"legacy" | "auto" | "2026-07-28"`

MCP protocol negotiation. "legacy" (default) opens with the initialize handshake and speaks protocol revisions up to 2025-11-25. "auto" probes for the 2026-07-28 revision and falls back to legacy when the server does not support it. "2026-07-28" requires that revision and fails otherwise.

Values`"legacy" | "auto" | "2026-07-28"`

`Mcp.RemoteConfigEncoded`object

`object`

`type`

`"remote"`required

Values`"remote"`

`url`

`string`required

`headers`

`object`

Additional properties

`string`

`oauth`

`Mcp.OAuthConfigEncoded | false`

[Mcp.OAuthConfigEncoded](#schema-Mcp.OAuthConfigEncoded)

or

`false`

Values`false`

`disabled`

`boolean`

`codemode`

`boolean`

`timeout`

`object`

`startup`

`integer`

\> 0

`catalog`

`integer`

\> 0

`execution`

`integer`

\> 0

`protocol`[Mcp.Protocol](#schema-Mcp.Protocol)

`Mcp.Resource`object

`object`

`server`

`string`required

`name`

`string`required

`uri`

`string`required

`description`

`string`

`mimeType`

`string`

`Mcp.ResourceCatalog`object

`object`

`resources`

`Mcp.Resource[]`required

Items [Mcp.Resource](#schema-Mcp.Resource)

`templates`

`Mcp.ResourceTemplate[]`required

Items [Mcp.ResourceTemplate](#schema-Mcp.ResourceTemplate)

`Mcp.ResourceTemplate`object

`object`

`server`

`string`required

`name`

`string`required

`uriTemplate`

`string`required

`description`

`string`

`mimeType`

`string`

`Mcp.Server`object `Mcp.Status.Connected`object

`object`

`status`

`"connected"`required

Values`"connected"`

`Mcp.Status.Disabled`object

`object`

`status`

`"disabled"`required

Values`"disabled"`

`Mcp.Status.Failed`object

`object`

`status`

`"failed"`required

Values`"failed"`

`error`

`string`required

`Mcp.Status.NeedsAuth`object

`object`

`status`

`"needs_auth"`required

Values`"needs_auth"`

`error`

`string`required

`Mcp.Status.Pending`object

`object`

`status`

`"pending"`required

Values`"pending"`

`McpServerNotFoundErrorEncoded`object

`object`

`_tag`

`"McpServerNotFoundError"`required

Values`"McpServerNotFoundError"`

`server`

`string`required

`message`

`string`required

`MediaHash`string

`string`

pattern ^\[0-9a-f\]{64}$

`MessageNotFoundErrorEncoded`object

`object`

`_tag`

`"MessageNotFoundError"`required

Values`"MessageNotFoundError"`

`sessionID`

`string`required

`messageID`

`string`required

`message`

`string`required

`Model.CacheFormat`"anthropic" | "alibaba"

`"anthropic" | "alibaba"`

Values`"anthropic" | "alibaba"`

`Model.Capabilities`object

`object`

`tools`

`boolean`required

`input`

`string[]`required

Items

`string`

`output`

`string[]`required

Items

`string`

`temperature`

`boolean`

`Model.Compatibility`object

`object`

`reasoningField`[Model.ReasoningField](#schema-Model.ReasoningField)

`requireReasoning`

`boolean`

`maxTokensField`[Model.MaxTokensField](#schema-Model.MaxTokensField)

`requireFinishReason`

`boolean`

`requireAssistantAfterTool`

`boolean`

`supportsPromptCacheKey`

`boolean`

`streamUsage`

`boolean`

`cacheFormat`[Model.CacheFormat](#schema-Model.CacheFormat)

`supportsThinkingBlockBinding`

`boolean`

`supportsEffortUpdates`

`boolean`

`mediaInput`[Model.MediaInput](#schema-Model.MediaInput)

`Model.Cost`object

`object`

`tier`

`object`

`type`

`"context"`required

Values`"context"`

`size`

`integer`required

`input`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`output`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`cache`

`object`required

`read`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`write`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`Model.Info`object `Model.MaxTokensField`"max\_completion\_tokens" | "max\_tokens"

`"max_completion_tokens" | "max_tokens"`

Values`"max_completion_tokens" | "max_tokens"`

`Model.MediaInput`"assets" | "state" | "root"

`"assets" | "state" | "root"`

Values`"assets" | "state" | "root"`

`Model.ReasoningField`"reasoning" | "reasoning\_content" | "reasoning\_text" | string

`"reasoning" | "reasoning_content" | "reasoning_text" | string`

`"reasoning" | "reasoning_content" | "reasoning_text"`

Values`"reasoning" | "reasoning_content" | "reasoning_text"`

or

`string`

`Model.Ref`object

`object`

`id`

`string`required

`providerID`[Provider.ID](#schema-Provider.ID)

`variant`

`string`

`Model.Settings`object

`object`

`object`

Additional properties

`object`

`compaction`[Provider.Compaction](#schema-Provider.Compaction)

`cache`[Provider.Cache](#schema-Provider.Cache)

`encoding`[Provider.Encoding](#schema-Provider.Encoding)

`Model.Type`"chat" | "decision" | "image" | string

`"chat" | "decision" | "image" | string`

`"chat" | "decision" | "image"`

Values`"chat" | "decision" | "image"`

or

`string`

`Model.Variant`object

`object`

`id`

`string`required

`settings`[Model.VariantSettings](#schema-Model.VariantSettings)

`headers`

`object`

Additional properties

`string`

`body`

`object`

`Model.VariantSettings`object

`object`

`object`

Additional properties

`object`

`compaction`[Provider.Compaction](#schema-Provider.Compaction)

`encoding`[Provider.Encoding](#schema-Provider.Encoding)

`ModelNotFoundErrorEncoded`object

`object`

`_tag`

`"ModelNotFoundError"`required

Values`"ModelNotFoundError"`

`providerID`

`string`required

`modelID`

`string`required

`message`

`string`required

`Money.USD`number

`number`

`Money.USDPerMillionTokens`number

`number`

`PairingCode`object

`object`

`code`

`string`required

`expires_in`

`integer`required

`PairingSession`object

`object`

`token`

`string`required

`Permission.Effect`"allow" | "deny" | "ask"

`"allow" | "deny" | "ask"`

Values`"allow" | "deny" | "ask"`

`Permission.ID`string

`string`

pattern ^per

`Permission.Reply`"once" | "always" | "reject"

`"once" | "always" | "reject"`

Values`"once" | "always" | "reject"`

`Permission.Request`object

`object`

`id`[Permission.ID](#schema-Permission.ID)

`sessionID`[Session.ID](#schema-Session.ID)

`action`

`string`required

`resources`

`string[]`required

Items

`string`

`save`

`string[]`

Items

`string`

`metadata`

`object`

`source`[Permission.Source](#schema-Permission.Source)

`message`

`string`

`Permission.Rule`object

`object`

`action`

`string`required

`resource`

`string`required

`effect`[Permission.Effect](#schema-Permission.Effect)

`Permission.Ruleset`Permission.Rule\[\]

`Permission.Rule[]`

Items [Permission.Rule](#schema-Permission.Rule)

`Permission.Source`object

`object`

`object`

`type`

`"tool"`required

Values`"tool"`

`messageID`

`string`required

`id`

`string`required

`PermissionNotFoundErrorEncoded`object

`object`

`_tag`

`"PermissionNotFoundError"`required

Values`"PermissionNotFoundError"`

`requestID`

`string`required

`message`

`string`required

`PermissionSaved.ID`string

`string`

`PermissionSaved.Info`object

`object`

`id`[PermissionSaved.ID](#schema-PermissionSaved.ID)

`projectID`[Project.ID](#schema-Project.ID)

`action`

`string`required

`resource`

`string`required

`time`

`object`required

`created`

`number`required

`updated`

`number`required

`PermissionSavedNotFoundErrorEncoded`object

`object`

`_tag`

`"PermissionSavedNotFoundError"`required

Values`"PermissionSavedNotFoundError"`

`id`

`string`required

`message`

`string`required

`PersistentPty.CreateInput`object

`object`

`command`

`string`

`args`

`string[]`required

Items

`string`

`cwd`

`string`

`title`

`string`required

`env`

`object`required

Additional properties

`string`

`size`

`object`

`cols`

`integer`required

\> 0

`rows`

`integer`required

\> 0

`PersistentPty.Handoff`object

`object`

`directory`

`string`required

`instanceID`

`string`required

`ticket`

`string`required

`expiresAt`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`PersistentPty.Info`object

`object`

`id`[Pty.ID](#schema-Pty.ID)

`title`

`string`required

`command`

`string`required

`args`

`string[]`required

Items

`string`

`cwd`

`string`required

`status`

`"running" | "exited"`required

Values`"running" | "exited"`

`pid`

`integer`required

min 0

`exitCode`

`integer`

min 0

`sessionID`[Session.ID](#schema-Session.ID)

`foregroundProcess`

`string | null`required

`string`

or

`null`

`size`

`object`required

`cols`

`integer`required

\> 0

`rows`

`integer`required

\> 0

`output`

`object`required

`head`

`integer`required

min 0

`tail`

`integer`required

min 0

`PersistentPty.ReadLinesEncoded`string

`string`

`PersistentPty.ReadResult`object

`object`

`ptyID`[Pty.ID](#schema-Pty.ID)

`title`

`string`required

`cwd`

`string`required

`foregroundProcess`

`string | null`required

`string`

or

`null`

`screen`

`object`required

`text`

`string`required

`cols`

`integer`required

\> 0

`rows`

`integer`required

\> 0

`cursor`

`object`required

`x`

`integer`required

min 0

`y`

`integer`required

min 0

`PersistentPty.Snapshot`object

`object`

`info`[PersistentPty.Info](#schema-PersistentPty.Info)

`text`

`string`required

`checkpoint`

`string<byte>`required

`cursor`

`object`required

`x`

`integer`required

min 0

`y`

`integer`required

min 0

`PersistentPty.UpdateInput`object

`object`

`attachmentID`

`string`

`size`

`object`required

`cols`

`integer`required

\> 0

`rows`

`integer`required

\> 0

`Plugin.Features`object

`object`

`server`

`true`

Values`true`

`tui`

`true`

Values`true`

`rpc`

`true`

Values`true`

`gui`

`true`

Values`true`

`Plugin.GuiBundle`object

`object`

`code`

`string`required

`revision`

`string`required

`options`

`object`required

`Plugin.ID`string

`string`

`Plugin.Info`object

`object`

`id`[Plugin.ID](#schema-Plugin.ID)

`source`[Plugin.Source](#schema-Plugin.Source)

`features`[Plugin.Features](#schema-Plugin.Features)

`state`[Plugin.State](#schema-Plugin.State)

`Plugin.Source`object | object | object | object

`object | object | object | object`

`object`

`type`

`"builtin"`required

Values`"builtin"`

or

`object`

`type`

`"package"`required

Values`"package"`

`target`

`string`required

`version`

`string`

`outdated`

`true`

Values`true`

`updating`

`true`

Values`true`

or

`object`

`type`

`"local"`required

Values`"local"`

`path`

`string`required

or

`object`

`type`

`"sdk"`required

Values`"sdk"`

`Plugin.State`object | object

`object | object`

`object`

`status`

`"active"`required

Values`"active"`

or

`object`

`status`

`"failed"`required

Values`"failed"`

`error`

`string`required

`ref`

`string`

`PluginNotFoundErrorEncoded`object

`object`

`_tag`

`"PluginNotFoundError"`required

Values`"PluginNotFoundError"`

`pluginID`

`string`required

`message`

`string`required

`Project`object

`object`

`id`[Project.ID](#schema-Project.ID)

`canonical`[AbsolutePath](#schema-AbsolutePath)

`vcs`[Project.Vcs](#schema-Project.Vcs)

`name`

`string`

`icon`[Project.Icon](#schema-Project.Icon)

`commands`[Project.Commands](#schema-Project.Commands)

`time`[Project.Time](#schema-Project.Time)

`sandboxes`

`string[]`required

Items

`string`

`Project.Commands`object

`object`

`start`

`string`

Startup script to run when creating a new workspace (worktree)

`Project.ID`string

`string`

`Project.Icon`object

`object`

`url`

`string`

`override`

`string`

`color`

`string`

`Project.Time`object

`object`

`created`

`integer`required

min 0

`updated`

`integer`required

min 0

`active`

`integer`required

min 0

`archived`

`integer`

min 0

`Project.Vcs`string

`string`

pattern ^\[a-z\]\[a-z0-9.\_-\]\*$

`ProjectNotFoundErrorEncoded`object

`object`

`_tag`

`"ProjectNotFoundError"`required

Values`"ProjectNotFoundError"`

`projectID`

`string`required

`message`

`string`required

`Prompt.AgentAttachment`object

`object`

`name`

`string`required

`mention`[Prompt.Mention](#schema-Prompt.Mention)

`Prompt.Base64`string

`string`

pattern ^(?:\[A-Za-z0-9+/\]{4})\*(?:\[A-Za-z0-9+/\]{2}==|\[A-Za-z0-9+/\]{3}=)?$

`Prompt.FileAttachment`object

`object`

`data`[Prompt.Base64](#schema-Prompt.Base64)

`mime`

`string`required

`source`[Prompt.FileSource](#schema-Prompt.FileSource)

`name`

`string`

`description`

`string`

`mention`[Prompt.Mention](#schema-Prompt.Mention)

`Prompt.FileSource`object | object

`object | object`

`object`

`type`

`"inline"`required

Values`"inline"`

or

`object`

`type`

`"uri"`required

Values`"uri"`

`uri`

`string`required

`Prompt.Mention`object

`object`

`start`

`number`required

`end`

`number`required

`text`

`string`required

`Prompt.SkillAttachment`object

`object`

`id`[Skill.ID](#schema-Skill.ID)

`name`[Skill.Name](#schema-Skill.Name)

`text`

`string`

`mention`[Prompt.Mention](#schema-Prompt.Mention)

`PromptInput.FileAttachment`object

`object`

`uri`

`string`required

`name`

`string`

`description`

`string`

`mention`[Prompt.Mention](#schema-Prompt.Mention)

`PromptInput.SkillAttachment`object

`object`

`id`[Skill.ID](#schema-Skill.ID)

`mention`[Prompt.Mention](#schema-Prompt.Mention)

`Provider.Cache`object

`object`

`ttl`[Provider.CacheTTL](#schema-Provider.CacheTTL)

`Provider.CacheTTL`string

`string`

pattern ^\[+-\]?\\d\*\\.?\\d+(?:\[Ee\]\[+-\]?\\d+)?(?:ms|s|m|h|d)$

`Provider.Compaction`object | object

`object | object`

`object`

`type`

`"summary"`required

Values`"summary"`

or

`object`

`type`

`"native"`required

Values`"native"`

`Provider.Compatibility`object

`object`

`reasoningField`[Model.ReasoningField](#schema-Model.ReasoningField)

`requireReasoning`

`boolean`

`maxTokensField`[Model.MaxTokensField](#schema-Model.MaxTokensField)

`requireFinishReason`

`boolean`

`requireAssistantAfterTool`

`boolean`

`supportsPromptCacheKey`

`boolean`

`streamUsage`

`boolean`

`cacheFormat`[Model.CacheFormat](#schema-Model.CacheFormat)

`mediaInput`[Model.MediaInput](#schema-Model.MediaInput)

`Provider.Encoding`"zstd" | "gzip" | "none"

`"zstd" | "gzip" | "none"`

Values`"zstd" | "gzip" | "none"`

`Provider.ID`string

`string`

`Provider.Info`object

`object`

`id`[Provider.ID](#schema-Provider.ID)

`canonical`[Provider.ID](#schema-Provider.ID)

`integrationID`[Integration.ID](#schema-Integration.ID)

`name`

`string`required

`activation`

`"auto" | "enabled" | "disabled"`required

Values`"auto" | "enabled" | "disabled"`

`package`

`string`required

`compatibility`[Provider.Compatibility](#schema-Provider.Compatibility)

`settings`[Provider.Settings](#schema-Provider.Settings)

`headers`

`object`

Additional properties

`string`

`body`

`object`

`Provider.Request`object

`object`

`settings`[Provider.Settings](#schema-Provider.Settings)

`headers`

`object`required

Additional properties

`string`

`body`

`object`required

`Provider.Settings`object

`object`

`object`

Additional properties

`object`

`Provider.Transport`"http" | "websocket"

`"http" | "websocket"`

Values`"http" | "websocket"`

`ProviderNotFoundErrorEncoded`object

`object`

`_tag`

`"ProviderNotFoundError"`required

Values`"ProviderNotFoundError"`

`providerID`

`string`required

`message`

`string`required

`ProviderRequestErrorEncoded`object

`object`

`_tag`

`"ProviderRequestError"`required

Values`"ProviderRequestError"`

`providerID`

`string`required

`reason`

`"authentication" | "rate_limit" | "content_filter" | "invalid_request" | "overloaded" | "provider"`required

Values`"authentication" | "rate_limit" | "content_filter" | "invalid_request" | "overloaded" | "provider"`

`message`

`string`required

`status`

`integer | null`

`integer`

or

`null`

`retryAfterMs`

`integer | null`

`integer`

or

`null`

`Pty`object

`object`

`id`[Pty.ID](#schema-Pty.ID)

`title`

`string`required

`command`

`string`required

`args`

`string[]`required

Items

`string`

`cwd`

`string`required

`status`

`"running" | "exited"`required

Values`"running" | "exited"`

`pid`

`integer`required

min 0

`exitCode`

`integer`

min 0

`Pty.ID`string

`string`

pattern ^pty

`PtyNotFoundErrorEncoded`object

`object`

`_tag`

`"PtyNotFoundError"`required

Values`"PtyNotFoundError"`

`ptyID`

`string`required

`message`

`string`required

`PtyTicket.ConnectToken`object

`object`

`ticket`

`string`required

`expires_in`

`integer`required

\> 0

`Reference.GitSource`object

`object`

`type`

`"git"`required

Values`"git"`

`repository`

`string`required

`branch`

`string`

`Reference.Info`object

`object`

`name`

`string`required

`path`[AbsolutePath](#schema-AbsolutePath)

`description`

`string`

`hidden`

`boolean`

`source`[Reference.Source](#schema-Reference.Source)

`Reference.LocalSource`object

`object`

`type`

`"local"`required

Values`"local"`

`path`[AbsolutePath](#schema-AbsolutePath)

`Reference.Source`Reference.LocalSource | Reference.GitSource `RelativePath`string

`string`

`Rpc.Input`object

`object`

`input`

`object`

`Rpc.Output`object

`object`

`output`

`object`

`RpcErrorEncoded`object

`object`

`_tag`

`"RpcError"`required

Values`"RpcError"`

`type`

`string`required

`message`

`string`required

`data`

`object | null`

`object`

or

`null`

`RpcInternalErrorEncoded`object

`object`

`_tag`

`"RpcInternalError"`required

Values`"RpcInternalError"`

`type`

`"rpc.internal" | "rpc.invalid_output"`required

Values`"rpc.internal" | "rpc.invalid_output"`

`message`

`string`required

`data`

`object | null`

`object`

or

`null`

`ServerInfo`object

`object`

`version`

`string`required

`pid`

`integer`required

min 0

`hostname`

`string | null`

`string`

or

`null`

`urls`

`string[]`required

Items

`string`

`paths`

`object`required

`tmp`

`string`required

`capabilities`

`object | null`

`object`

`persistentPty`

`boolean | null`

`boolean`

or

`null`

or

`null`

`ServiceUnavailableErrorEncoded`object

`object`

`_tag`

`"ServiceUnavailableError"`required

Values`"ServiceUnavailableError"`

`message`

`string`required

`service`

`string | null`

`string`

or

`null`

`Session.ForkBoundary`object | object `Session.ID`string

`string`

pattern ^ses

`Session.Inbox.Compaction`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`sessionID`[Session.ID](#schema-Session.ID)

`time`

`object`required

`created`

`number`required

`type`

`"compaction"`required

Values`"compaction"`

`payload`[Session.Inbox.CompactionPayload](#schema-Session.Inbox.CompactionPayload)

`delivery`[Session.Inbox.Delivery](#schema-Session.Inbox.Delivery)

`Session.Inbox.CompactionPayload`object

`object`

`Session.Inbox.Delivery`"steer" | "queue"

`"steer" | "queue"`

Values`"steer" | "queue"`

`Session.Inbox.Info`Session.Inbox.User | Session.Inbox.Synthetic | Session.Inbox.Compaction | Session.Inbox.Move `Session.Inbox.Move`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`sessionID`[Session.ID](#schema-Session.ID)

`time`

`object`required

`created`

`number`required

`type`

`"move"`required

Values`"move"`

`delivery`[Session.Inbox.Delivery](#schema-Session.Inbox.Delivery)

`payload`[Session.Inbox.MovePayload](#schema-Session.Inbox.MovePayload)

`Session.Inbox.MovePayload`object

`object`

`projectID`[Project.ID](#schema-Project.ID)

`subpath`[RelativePath](#schema-RelativePath)

`location`[Location.PublicRef](#schema-Location.PublicRef)

`Session.Inbox.Synthetic`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`sessionID`[Session.ID](#schema-Session.ID)

`time`

`object`required

`created`

`number`required

`type`

`"synthetic"`required

Values`"synthetic"`

`payload`[Session.Inbox.SyntheticPayload](#schema-Session.Inbox.SyntheticPayload)

`delivery`[Session.Inbox.Delivery](#schema-Session.Inbox.Delivery)

`Session.Inbox.SyntheticPayload`object

`object`

`text`

`string`required

`description`

`string`

`metadata`

`object`

`Session.Inbox.User`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`sessionID`[Session.ID](#schema-Session.ID)

`time`

`object`required

`created`

`number`required

`type`

`"user"`required

Values`"user"`

`payload`[Session.Inbox.UserPayload](#schema-Session.Inbox.UserPayload)

`delivery`[Session.Inbox.Delivery](#schema-Session.Inbox.Delivery)

`Session.Inbox.UserPayload`object

`object`

`text`

`string`required

`files`

`Prompt.FileAttachment[]`

Items [Prompt.FileAttachment](#schema-Prompt.FileAttachment)

`agents`

`Prompt.AgentAttachment[]`

Items [Prompt.AgentAttachment](#schema-Prompt.AgentAttachment)

`skills`

`Prompt.SkillAttachment[]`

Items [Prompt.SkillAttachment](#schema-Prompt.SkillAttachment)

`metadata`

`object`

`Session.Info`object `Session.Message.AgentSelected`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`type`

`"agent-switched"`required

Values`"agent-switched"`

`agent`[Agent.ID](#schema-Agent.ID)

`previous`[Agent.ID](#schema-Agent.ID)

`Session.Message.Assistant`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`streamed`

`number`

`completed`

`number`

`type`

`"assistant"`required

Values`"assistant"`

`agent`[Agent.ID](#schema-Agent.ID)

`model`[Model.Ref](#schema-Model.Ref)

`content`

`Session.Message.Assistant.Text | Session.Message.Assistant.Reasoning | Session.Message.Assistant.Tool[]`required

`snapshot`

`object`

`start`[Snapshot.ID](#schema-Snapshot.ID)

`end`[Snapshot.ID](#schema-Snapshot.ID)

`files`

`RelativePath[]`

Items [RelativePath](#schema-RelativePath)

`finish`

`"stop" | "length" | "tool-calls" | "content-filter" | "error" | "unknown"`

Values`"stop" | "length" | "tool-calls" | "content-filter" | "error" | "unknown"`

`rawFinish`

`string`

`native`[Session.Message.Native\_3](#schema-Session.Message.Native_3)

`cost`[Money.USD](#schema-Money.USD)

`tokens`[TokenUsage.Info](#schema-TokenUsage.Info)

`error`[Session.StructuredError](#schema-Session.StructuredError)

`retry`[Session.Message.Assistant.Retry](#schema-Session.Message.Assistant.Retry)

`Session.Message.Assistant.Reasoning`object

`object`

`type`

`"reasoning"`required

Values`"reasoning"`

`text`

`string`required

`native`[Session.Message.Native\_1](#schema-Session.Message.Native_1)

`time`

`object`

`created`

`number`required

`completed`

`number`

`Session.Message.Assistant.Retry`object

`object`

`attempt`

`integer`required

\> 0

`at`

`number`required

`error`[Session.StructuredError](#schema-Session.StructuredError)

`Session.Message.Assistant.Text`object

`object`

`type`

`"text"`required

Values`"text"`

`text`

`string`required

`native`[Session.Message.Native](#schema-Session.Message.Native)

`Session.Message.Assistant.Tool`object `Session.Message.Compaction`Session.Message.Compaction.Running | Session.Message.Compaction.Completed | Session.Message.Compaction.Failed `Session.Message.Compaction.Completed`object `Session.Message.Compaction.Failed`object `Session.Message.Compaction.Running`object

`object`

`type`

`"compaction"`required

Values`"compaction"`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`status`

`"running"`required

Values`"running"`

`reason`

`"auto" | "manual"`required

Values`"auto" | "manual"`

`summary`

`string`required

`Session.Message.ID`string

`string`

pattern ^msg\_

`Session.Message.Idle`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`type`

`"idle"`required

Values`"idle"`

`outcome`

`"succeeded" | "failed" | "interrupted"`required

Values`"succeeded" | "failed" | "interrupted"`

`error`[Session.StructuredError](#schema-Session.StructuredError)

`Session.Message.Info`Session.Message.AgentSelected | Session.Message.ModelSelected | Session.Message.LocationSwitched | Session.Message.User | Session.Message.Synthetic | Session.Message.System | Session.Message.Skill | Session.Message.Shell | Session.Message.Assistant | Session.Message.Compaction | Session.Message.Idle `Session.Message.LocationSwitched`object `Session.Message.ModelSelected`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`type`

`"model-switched"`required

Values`"model-switched"`

`model`[Model.Ref](#schema-Model.Ref)

`previous`[Model.Ref](#schema-Model.Ref)

`Session.Message.Native`object

`object`

`Session.Message.Native_1`object

`object`

`Session.Message.Native_2`object

`object`

`Session.Message.Native_3`object

`object`

`Session.Message.Native_4`object

`object`

`Session.Message.Shell`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`completed`

`number`

`type`

`"shell"`required

Values`"shell"`

`shellID`[Shell.ID](#schema-Shell.ID)

`command`

`string`required

`status`

`"running" | "exited" | "timeout" | "killed"`required

Values`"running" | "exited" | "timeout" | "killed"`

`exit`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`output`

`object`

`output`

`string`required

`cursor`

`integer`required

min 0

`size`

`integer`required

min 0

`truncated`

`boolean`required

`Session.Message.Skill`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`type`

`"skill"`required

Values`"skill"`

`skill`[Skill.ID](#schema-Skill.ID)

`name`[Skill.Name](#schema-Skill.Name)

`text`

`string`required

`Session.Message.Synthetic`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`text`

`string`required

`description`

`string`

`type`

`"synthetic"`required

Values`"synthetic"`

`Session.Message.System`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`type`

`"system"`required

Values`"system"`

`text`

`string`required

`description`

`string`

`Session.Message.ToolState.Completed`object

`object`

`status`

`"completed"`required

Values`"completed"`

`input`

`object`required

`content`

`Tool.Content[]`required

min items 1

Items [Tool.Content](#schema-Tool.Content)

`metadata`

`object`

`Session.Message.ToolState.Error`object `Session.Message.ToolState.Running`object

`object`

`status`

`"running"`required

Values`"running"`

`input`

`object`required

`metadata`

`object`required

`Session.Message.ToolState.Streaming`object

`object`

`status`

`"streaming"`required

Values`"streaming"`

`input`

`string`required

`Session.Message.User`object

`object`

`id`[Session.Message.ID](#schema-Session.Message.ID)

`metadata`

`object`

`time`

`object`required

`created`

`number`required

`text`

`string`required

`files`

`Prompt.FileAttachment[]`

Items [Prompt.FileAttachment](#schema-Prompt.FileAttachment)

`agents`

`Prompt.AgentAttachment[]`

Items [Prompt.AgentAttachment](#schema-Prompt.AgentAttachment)

`skills`

`Prompt.SkillAttachment[]`

Items [Prompt.SkillAttachment](#schema-Prompt.SkillAttachment)

`type`

`"user"`required

Values`"user"`

`Session.Revert`object

`object`

`messageID`[Session.Message.ID](#schema-Session.Message.ID)

`partID`

`string`

`snapshot`[Snapshot.ID](#schema-Snapshot.ID)

`files`

`FileDiff.Info[]`

Items [FileDiff.Info](#schema-FileDiff.Info)

`Session.StructuredError`object

`object`

`type`

`string`required

`message`

`string`required

`status`

`integer`

min 100, max 599

`response`

`object`

`body`

`string`required

`retryAfterMs`

`integer`

min 0

`SessionActive`object

`object`

`type`

`"running"`required

Values`"running"`

`SessionBusyErrorEncoded`object

`object`

`_tag`

`"SessionBusyError"`required

Values`"SessionBusyError"`

`sessionID`

`string`required

`message`

`string`required

`SessionGenerateResponse`object

`object`

`data`

`object`required

`text`

`string`required

`SessionInterruptResponse`object

`object`

`interrupted`

`boolean`required

Whether an active execution owned by this OpenCode process was interrupted.

`SessionLogItemEncoded`string

`string`

`SessionMessagesResponse`object

`object`

`data`

`Session.Message.Info[]`required

Items [Session.Message.Info](#schema-Session.Message.Info)

`cursor`

`object`required

`previous`

`string | null`

`string`

or

`null`

`next`

`string | null`

`string`

or

`null`

`SessionNotFoundErrorEncoded`object

`object`

`_tag`

`"SessionNotFoundError"`required

Values`"SessionNotFoundError"`

`sessionID`

`string`required

`message`

`string`required

`SessionStats.Activity`object

`object`

`date`

`string`required

`steps`

`integer`required

min 0

`SessionStats.Info`object `SessionStats.ModelUsage`object

`object`

`model`[Model.Ref](#schema-Model.Ref)

`steps`

`integer`required

min 0

`tokens`[TokenUsage.Info](#schema-TokenUsage.Info)

`cost`[Money.USD](#schema-Money.USD)

`SessionStats.ToolTotals`object

`object`

`calls`

`integer`required

min 0

`succeeded`

`integer`required

min 0

`failed`

`integer`required

min 0

`unfinished`

`integer`required

min 0

`SessionStats.ToolUsage`object

`object`

`name`

`string`required

`calls`

`integer`required

min 0

`succeeded`

`integer`required

min 0

`failed`

`integer`required

min 0

`unfinished`

`integer`required

min 0

`durationP50`

`number`

`SessionStats.Tools`object | object | object `SessionTransfer.Data`object

`object`

`info`[Session.Info](#schema-Session.Info)

`messages`

`Session.Message.Info[]`required

Items [Session.Message.Info](#schema-Session.Message.Info)

`SessionsCursor`string

`string`

Opaque pagination cursor returned as cursor.previous or cursor.next in the previous response.

`SessionsResponse`object `Shell.ID`string

`string`

pattern ^sh\_

`Shell.Info`object

`object`

`id`[Shell.ID](#schema-Shell.ID)

`status`

`"running" | "exited" | "timeout" | "killed"`required

Values`"running" | "exited" | "timeout" | "killed"`

`command`

`string`required

`cwd`

`string`required

`shell`

`string`required

`file`

`string`required

`pid`

`integer`

min 0

`exit`

`number`

`signal`

`string`

`metadata`

`object`required

`time`

`object`required

`started`

`number`required

Start time in milliseconds since the Unix epoch

`completed`

`number`

`ShellNotFoundErrorEncoded`object

`object`

`_tag`

`"ShellNotFoundError"`required

Values`"ShellNotFoundError"`

`id`

`string`required

`message`

`string`required

`Skill.ID`string

`string`

`Skill.Info`object

`object`

`id`[Skill.ID](#schema-Skill.ID)

`name`[Skill.Name](#schema-Skill.Name)

`description`

`string`

`autoinvoke`

`boolean`

`path`[AbsolutePath](#schema-AbsolutePath)

`content`

`string`required

`Skill.Name`string

`string`

`SkillNotFoundErrorEncoded`object

`object`

`_tag`

`"SkillNotFoundError"`required

Values`"SkillNotFoundError"`

`skill`[Skill.ID](#schema-Skill.ID)

`message`

`string`required

`Snapshot.ID`string

`string`

`TokenUsage.Info`object

`object`

`input`

`number`required

`output`

`number`required

`reasoning`

`number`required

`cache`

`object`required

`read`

`number`required

`write`

`number`required

`Tool.Content`Tool.TextContent | Tool.FileContent `Tool.FileContent`object

`object`

`type`

`"file"`required

Values`"file"`

`uri`

`string`required

`mime`

`string`required

`name`

`string | null`

`string`

or

`null`

`Tool.TextContent`object

`object`

`type`

`"text"`required

Values`"text"`

`text`

`string`required

`UnauthorizedErrorEncoded`object

`object`

`_tag`

`"UnauthorizedError"`required

Values`"UnauthorizedError"`

`message`

`string`required

`UnknownErrorEncoded`object

`object`

`_tag`

`"UnknownError"`required

Values`"UnknownError"`

`message`

`string`required

`ref`

`string | null`

`string`

or

`null`

`UnsupportedModelErrorEncoded`object

`object`

`_tag`

`"UnsupportedModelError"`required

Values`"UnsupportedModelError"`

`providerID`

`string`required

`modelID`

`string`required

`capability`

`string`required

`message`

`string`required

`UsageLimits.Budget`object

`object`

`id`

`string`required

`limit`[Money.USD](#schema-Money.USD)

`spent`[Money.USD](#schema-Money.USD)

`scope`

`"each" | "combined"`required

Values`"each" | "combined"`

`per`

`"set" | "model"`required

Values`"set" | "model"`

`coverage`

`"all" | "models"`required

Values`"all" | "models"`

`models`

`UsageLimits.BudgetModel[]`required

Items [UsageLimits.BudgetModel](#schema-UsageLimits.BudgetModel)

`vendors`

`string[]`required

Items

`string`

`inputPriceAtLeast`[Money.USDPerMillionTokens](#schema-Money.USDPerMillionTokens)

`picked`

`boolean`required

`shared`

`boolean`required

`resetsAt`

`number`required

Milliseconds since the Unix epoch

`UsageLimits.BudgetModel`object

`object`

`providerID`[Provider.ID](#schema-Provider.ID)

`modelID`

`string`required

`name`

`string`required

`spent`[Money.USD](#schema-Money.USD)

`UsageLimits.Go`object

`object`

`rolling`[UsageLimits.Meter](#schema-UsageLimits.Meter)

`weekly`[UsageLimits.Meter](#schema-UsageLimits.Meter)

`monthly`[UsageLimits.Meter](#schema-UsageLimits.Meter)

`UsageLimits.Info`object

`object`

`workspace`

`object`required

`id`

`string`required

`name`

`string`

`usageURL`

`string`required

`go`[UsageLimits.Go](#schema-UsageLimits.Go)

`budgets`

`UsageLimits.Budget[]`required

Items [UsageLimits.Budget](#schema-UsageLimits.Budget)

`UsageLimits.Meter`object

`object`

`percent`

`number`required

min 0, max 100

`limited`

`boolean`required

`resetsAt`

`number`required

Milliseconds since the Unix epoch

`V2EventEncoded`string

`string`

`Vcs.Base`object

`object`

`name`

`string`required

`ref`

`string`required

`source`

`"reflog" | "default"`required

Values`"reflog" | "default"`

`Vcs.Branch`object

`object`

`current`

`string`

`default`

`string`

`Vcs.BranchList`string\[\]

`string[]`

Items

`string`

`Vcs.FileStatus`object

`object`

`file`

`string`required

`additions`

`integer`required

min 0

`deletions`

`integer`required

min 0

`status`

`"added" | "deleted" | "modified"`required

Values`"added" | "deleted" | "modified"`

`Vcs.Info`object

`object`

`provider`

`string`

`branch`[Vcs.Branch](#schema-Vcs.Branch)

`Vcs.Mode`"working" | "branch" | "committed"

`"working" | "branch" | "committed"`

Values`"working" | "branch" | "committed"`

`Vcs.Untracked`"files" | "folders"

`"files" | "folders"`

Values`"files" | "folders"`

`VcsInitNotSupportedErrorEncoded`object

`object`

`_tag`

`"VcsInitNotSupportedError"`required

Values`"VcsInitNotSupportedError"`

`providerID`

`string`required

`message`

`string`required

`VoiceModel`object

`object`

`model`

`string`required

`provider`

`string`required

`transports`

`VoiceTransportType[]`required

Items [VoiceTransportType](#schema-VoiceTransportType)

`available`

`boolean`required

`VoiceModelsResponse`object

`object`

`data`

`object`required

`models`

`VoiceModel[]`required

Items [VoiceModel](#schema-VoiceModel)

`default`

`string | null`

`string`

or

`null`

`VoiceSessionResponse`object

`object`

`data`

`object`required

`transport`[VoiceTransport](#schema-VoiceTransport)

`VoiceTransport`VoiceWebRTCTransport | VoiceWebSocketTransport `VoiceTransportInput`VoiceWebRTCTransportInput | VoiceWebSocketTransportInput `VoiceTransportType`"webrtc" | "websocket"

`"webrtc" | "websocket"`

Values`"webrtc" | "websocket"`

`VoiceWebRTCTransport`object

`object`

`type`

`"webrtc"`required

Values`"webrtc"`

`sdp`

`string`required

`VoiceWebRTCTransportInput`object

`object`

`type`

`"webrtc"`required

Values`"webrtc"`

`sdp`

`string`required

`dcid`

`number | "Infinity" | "-Infinity" | "NaN" | null`

`number | "Infinity" | "-Infinity" | "NaN"`

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

or

`null`

`VoiceWebSocketTransport`object

`object`

`type`

`"websocket"`required

Values`"websocket"`

`url`

`string`required

`token`

`string`required

`expiresAt`

`number | "Infinity" | "-Infinity" | "NaN"`required

`number`

or

`"Infinity" | "-Infinity" | "NaN"`

Values`"Infinity" | "-Infinity" | "NaN"`

`VoiceWebSocketTransportInput`object

`object`

`type`

`"websocket"`required

Values`"websocket"`

`WebSearch.ID`string

`string`

`WebSearch.Provider`object

`object`

`id`[WebSearch.ID](#schema-WebSearch.ID)

`name`

`string`required

`WebSearch.ResponseEncoded`object

`object`

`providerID`[WebSearch.ID](#schema-WebSearch.ID)

`results`

`WebSearch.Result[]`required

Items [WebSearch.Result](#schema-WebSearch.Result)

`WebSearch.Result`object

`object`

`url`

`string`required

`title`

`string`

`content`

`string`

`time`

`object`required

`published`

`number`

`Worktree.CreateInput`object

`object`

`projectID`[Project.ID](#schema-Project.ID)

`from`[AbsolutePath](#schema-AbsolutePath)

`branch`

`string`

`directory`[AbsolutePath](#schema-AbsolutePath)

`name`

`string`

`Worktree.Directory`object

`object`

`directory`[AbsolutePath](#schema-AbsolutePath)

`strategy`

`string`

`Worktree.Info`object

`object`

`directory`[AbsolutePath](#schema-AbsolutePath)

`Worktree.List`Worktree.Directory\[\]

`Worktree.Directory[]`

Items [Worktree.Directory](#schema-Worktree.Directory)

`Worktree.RemoveInput`object

`object`

`projectID`[Project.ID](#schema-Project.ID)

`directory`[AbsolutePath](#schema-AbsolutePath)

`force`

`boolean`required

`WorktreeErrorEncoded`object

`object`

`_tag`

`"WorktreeError"`required

Values`"WorktreeError"`

`name`

`"WorktreeError"`required

Values`"WorktreeError"`

`data`

`object`required

`message`

`string`required

`forceRequired`

`boolean | null`

`boolean`

or

`null`