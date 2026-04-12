#!/usr/bin/env python3

import argparse
import re
import sys
from pathlib import Path
from typing import List, Optional


SKILL_TEMPLATE = """---
name: {name}
description: [TODO: Describe what this skill does and when to use it.]
---

# {title}

## Overview

[TODO: Explain what this skill enables.]

## Core Workflow

1. [TODO: Add the first step.]
2. [TODO: Add the second step.]

## Constraints

- [TODO: Add important constraints.]
"""


COMMAND_TEMPLATE = """---
description: [TODO: Describe what this command does.]
agent: build
---

## Purpose

[TODO: Explain the command's purpose.]

## Parameters

`$ARGUMENTS`

## Dispatch

1. [TODO: Read any required context.]
2. [TODO: Dispatch to the right workflow.]

## Constraints

- [TODO: Add command-specific constraints.]
"""


WORKFLOW_TEMPLATE = """# {title} Workflow

## Goal

[TODO: State the workflow goal.]

## Inputs

- [TODO: List required inputs.]

## Steps

1. [TODO: Add the first step.]
2. [TODO: Add the second step.]

## Outputs

- [TODO: List expected outputs.]

## Constraints

- [TODO: Add workflow constraints.]
"""


RULE_TEMPLATE = """# {title}

## Purpose

[TODO: State what this rule protects or standardizes.]

## Rules

- [TODO: Add the first rule.]
- [TODO: Add the second rule.]

## Notes

- [TODO: Add short clarifying notes if needed.]
"""


AGENTS_TEMPLATE = """# {title}

## Goal

[TODO: Describe the project goal.]

## Audience

- [TODO: Describe the primary audience.]

## System Structure

- `.opencode/commands/`: [TODO]
- `.opencode/skills/`: [TODO]
- `.opencode/workflows/`: [TODO]
- `.opencode/rules/`: [TODO]

## Product Rules

- [TODO: Add product-level rules.]

## Implementation Expectations

- [TODO: Add engineering expectations.]
"""


OPENAI_YAML_TEMPLATE = """interface:
  display_name: \"{display_name}\"
  short_description: \"{short_description}\"
  default_prompt: \"Use ${skill_name} to help with this task.\"
"""


def normalize_name(raw: str) -> str:
    cleaned = raw.strip().lower()
    cleaned = re.sub(r"[^a-z0-9]+", "-", cleaned)
    cleaned = re.sub(r"-{2,}", "-", cleaned).strip("-")
    return cleaned


def titleize(name: str) -> str:
    return " ".join(part.capitalize() for part in name.replace("_", "-").split("-") if part)


def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def create_skill(root: Path, name: str) -> List[str]:
    skill_name = normalize_name(name)
    if not skill_name:
        raise ValueError("skill name must contain at least one letter or digit")

    skill_dir = root / ".opencode" / "skills" / skill_name
    if skill_dir.exists():
        raise FileExistsError(f"skill already exists: {skill_dir}")

    write_file(skill_dir / "SKILL.md", SKILL_TEMPLATE.format(name=skill_name, title=titleize(skill_name)))
    write_file(
        skill_dir / "agents" / "openai.yaml",
        OPENAI_YAML_TEMPLATE.format(
            display_name=titleize(skill_name),
            short_description=f"Create or use {titleize(skill_name)}",
            skill_name=skill_name,
        ),
    )
    (skill_dir / "scripts").mkdir(parents=True, exist_ok=True)
    (skill_dir / "references").mkdir(parents=True, exist_ok=True)
    return [str(skill_dir / "SKILL.md"), str(skill_dir / "agents" / "openai.yaml")]


def create_markdown(root: Path, kind: str, name: str, description: Optional[str]) -> List[str]:
    if kind == "agents":
        path = root / "AGENTS.md"
        if path.exists():
            raise FileExistsError(f"file already exists: {path}")
        write_file(path, AGENTS_TEMPLATE.format(title=titleize(name or root.name)))
        return [str(path)]

    base = root / ".opencode" / f"{kind}s"
    path = base / f"{name}.md"
    if path.exists():
        raise FileExistsError(f"file already exists: {path}")

    title = titleize(name)
    if kind == "command":
        content = COMMAND_TEMPLATE.replace("[TODO: Describe what this command does.]", description or "[TODO: Describe what this command does.]")
    elif kind == "workflow":
        content = WORKFLOW_TEMPLATE.format(title=title)
    elif kind == "rule":
        content = RULE_TEMPLATE.format(title=title)
    else:
        raise ValueError(f"unsupported kind: {kind}")

    write_file(path, content)
    return [str(path)]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create OpenCode config scaffolds.")
    parser.add_argument("kind", choices=["skill", "command", "workflow", "rule", "agents"])
    parser.add_argument("name", nargs="?", default="")
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--description", default=None, help="Optional description for commands")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.root).resolve()
    name = args.name or "new-config"

    try:
        if args.kind == "skill":
            created = create_skill(root, name)
        else:
            created = create_markdown(root, args.kind, name, args.description)
    except Exception as exc:
        print(f"[ERROR] {exc}")
        return 1

    print("[OK] Created:")
    for item in created:
        print(f"- {item}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
