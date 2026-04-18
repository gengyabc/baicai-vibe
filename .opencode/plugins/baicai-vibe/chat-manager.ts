import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

async function keepOnlyLastAssistant(client: any, sessionID: string, workspaceID?: string) {
  const params = {
    sessionID,
    ...(workspaceID ? { workspace: workspaceID } : {}),
  }

  await client.session.abort(params)

  const messagesResult = await client.session.messages(params)
  const messages = messagesResult.data ?? []
  const lastAssistant = [...messages].reverse().find((message) => message.info.role === "assistant")

  if (!lastAssistant) return

  const messagesToDelete = messages.filter((message) => message.info.id !== lastAssistant.info.id)

  for (const message of messagesToDelete) {
    await client.session.deleteMessage({
      ...params,
      messageID: message.info.id,
    })
  }
}

const tui: TuiPlugin = async (api) => {
  const unregister = api.command.register(() => [
    {
      title: "Keep last assistant message",
      value: "keep-last",
      description: "Delete all chat messages except the latest assistant reply",
      slash: {
        name: "keep-last",
      },
      enabled: api.route.current.name === "session",
      onSelect: async () => {
        if (api.route.current.name !== "session") return

        const sessionID = api.route.current.params?.sessionID

        if (!sessionID || typeof sessionID !== "string") return

        const workspaceID = api.workspace.current()
        const client = api.scopedClient(workspaceID)

        await keepOnlyLastAssistant(client, sessionID, workspaceID)
      },
    },
  ])

  api.lifecycle.onDispose(unregister)
}

const plugin: TuiPluginModule = {
  id: "chat-manager",
  tui,
}

export default plugin
