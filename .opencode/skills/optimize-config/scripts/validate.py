#!/usr/bin/env python3

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_frontmatter(text: str) -> Optional[Dict[str, str]]:
    match = re.match(r"^---\n(.*?)\n---\n?", text, re.DOTALL)
    if not match:
        return None
    data: Dict[str, str] = {}
    for raw_line in match.group(1).splitlines():
        if ":" not in raw_line:
            continue
        key, value = raw_line.split(":", 1)
        data[key.strip()] = value.strip().strip('"')
    return data


def validate_skill_dir(path: Path) -> List[str]:
    errors: List[str] = []
    skill_md = path / "SKILL.md"
    if not skill_md.exists():
        return [f"{path}: missing SKILL.md"]

    frontmatter = parse_frontmatter(read_text(skill_md))
    if frontmatter is None:
        errors.append(f"{skill_md}: missing frontmatter")
    else:
        name = frontmatter.get("name", "")
        description = frontmatter.get("description", "")
        if not name:
            errors.append(f"{skill_md}: missing name")
        elif not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
            errors.append(f"{skill_md}: invalid skill name '{name}'")
        if not description:
            errors.append(f"{skill_md}: missing description")
        elif len(description) > 1024:
            errors.append(f"{skill_md}: description too long")

    openai_yaml = path / "agents" / "openai.yaml"
    if not openai_yaml.exists():
        errors.append(f"{path}: missing agents/openai.yaml")
    return errors


def validate_command_file(path: Path) -> List[str]:
    frontmatter = parse_frontmatter(read_text(path))
    if frontmatter is None:
        return [f"{path}: missing frontmatter"]
    errors: List[str] = []
    if not frontmatter.get("description"):
        errors.append(f"{path}: missing description")
    if not frontmatter.get("agent"):
        errors.append(f"{path}: missing agent")
    return errors


def validate_generic_markdown(path: Path) -> List[str]:
    text = read_text(path)
    if not text.strip():
        return [f"{path}: file is empty"]
    return []


def collect_targets(path: Path) -> List[Path]:
    if path.is_file():
        return [path]
    if path.is_dir() and (path / "SKILL.md").exists():
        return [path]
    if path.is_dir():
        return sorted(item for item in path.rglob("*") if item.is_file() and item.suffix in {".md", ".yaml"})
    return []


def validate_one(path: Path) -> List[str]:
    if path.is_dir() and (path / "SKILL.md").exists():
        return validate_skill_dir(path)
    if path.name == "AGENTS.md":
        return validate_generic_markdown(path)
    if path.suffix == ".md" and "/commands/" in path.as_posix():
        return validate_command_file(path)
    if path.suffix == ".md":
        return validate_generic_markdown(path)
    return []


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate OpenCode config files.")
    parser.add_argument("path")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    args = parser.parse_args()

    target = Path(args.path).resolve()
    targets = collect_targets(target)
    if not targets:
        print(f"[ERROR] no files found for {target}")
        return 1

    results = []
    had_errors = False
    for item in targets:
        errors = validate_one(item)
        results.append({"path": str(item), "errors": errors})
        had_errors = had_errors or bool(errors)

    if args.format == "json":
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        for result in results:
            if result["errors"]:
                for error in result["errors"]:
                    print(f"[ERROR] {error}")
            else:
                print(f"[OK] {result['path']}")
    return 1 if had_errors else 0


if __name__ == "__main__":
    sys.exit(main())
