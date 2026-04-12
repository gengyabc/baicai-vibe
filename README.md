# baicai-vibe

Global OpenCode artifacts for reuse across projects.

This repo owns shared `agents`, `commands`, `rules`, `skills`, `plugins`, and `workflows` that must stay repo-agnostic.

## Layout

- Source: `~/programming/baicai-vibe/.opencode`
- Global install: `~/.config/opencode`
- Project usage: `.opencode/_vendor/baicai-vibe` in downstream repos

## Install

Run:

```bash
./scripts/install-global.sh
```

That creates:

```text
~/.config/opencode -> ~/programming/baicai-vibe/.opencode
```

## Project Use

Downstream repos should point their vendor link at `~/.config/opencode`:

```bash
ln -s ~/.config/opencode .opencode/_vendor/baicai-vibe
```

## Validate

```bash
./scripts/validate-repo-agnostic.sh
```

## Check

```bash
ls -la ~/.config/opencode
```
