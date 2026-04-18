import type { Plugin } from "@opencode-ai/plugin"

const MONITORED_COMMANDS = new Set([
  "implement-from-plan",
  "review-requirements",
  "review-quality",
])

const PAUSE_MESSAGE = "子智能体失败，已暂停。请在当前会话回复 继续。"

type NotificationState = {
  lastCommand?: string
  notifiedAt?: number
}

const sessions = new Map<string, NotificationState>()

function getSessionState(sessionID: string): NotificationState {
  const state = sessions.get(sessionID)

  if (state) return state

  const nextState: NotificationState = {}
  sessions.set(sessionID, nextState)

  return nextState
}

function shouldNotify(state: NotificationState) {
  const now = Date.now()

  if (state.notifiedAt && now - state.notifiedAt < 10_000) return false

  state.notifiedAt = now
  return true
}

function stringifyError(error: unknown) {
  if (!error || typeof error !== "object") return "unknown error"

  const record = error as Record<string, unknown>
  const data = record.data

  if (data && typeof data === "object") {
    const message = (data as Record<string, unknown>).message

    if (typeof message === "string" && message.trim()) return message
  }

  const message = record.message
  if (typeof message === "string" && message.trim()) return message

  const name = record.name
  if (typeof name === "string" && name.trim()) return name

  return "unknown error"
}

async function notify(title: string, message: string) {
  const mod = await import("node-notifier")
  const notifier = mod.default as { notify: (input: { title: string; message: string; wait?: boolean; timeout?: number }) => void }

  notifier.notify({
    title,
    message,
    wait: false,
    timeout: 5,
  })
}

export const WorkflowFailureNotify: Plugin = async ({ client }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "command.executed") {
        const state = getSessionState(event.properties.sessionID)

        if (!MONITORED_COMMANDS.has(event.properties.name)) return

        state.lastCommand = event.properties.name
        return
      }

      if (event.type === "session.idle") {
        sessions.delete(event.properties.sessionID)
        return
      }

      if (event.type === "session.status") {
        const state = sessions.get(event.properties.sessionID)
        if (!state || event.properties.status.type !== "retry") return
        if (!shouldNotify(state)) return

        const command = state.lastCommand ?? "工作流"
        const message = `${command} 正在重试: ${event.properties.status.message}\n${PAUSE_MESSAGE}`

        try {
          await notify(`OpenCode ${command} 暂停`, message)
        } catch (error) {
          await client.app.log({
            body: {
              service: "workflow-failure-notify",
              level: "warn",
              message: "failed to send retry notification",
              extra: { error: stringifyError(error) },
            },
          })
        }

        return
      }

      if (event.type !== "session.error") return

      const sessionID = event.properties.sessionID
      if (!sessionID) return

      const state = sessions.get(sessionID)
      if (!state || !state.lastCommand || !shouldNotify(state)) return

      const message = `${state.lastCommand} 失败: ${stringifyError(event.properties.error)}\n${PAUSE_MESSAGE}`

      try {
        await notify(`OpenCode ${state.lastCommand} 暂停`, message)
      } catch (error) {
        await client.app.log({
          body: {
            service: "workflow-failure-notify",
            level: "warn",
            message: "failed to send error notification",
            extra: { error: stringifyError(error) },
          },
        })
      }
    },
  }
}
