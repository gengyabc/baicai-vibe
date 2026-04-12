#!/usr/bin/env python3

import argparse
import json
import re
import sys
from pathlib import Path


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def analyze_text(path: Path) -> dict:
    text = read_text(path)
    lines = text.splitlines()
    blank_runs = len(re.findall(r"\n{3,}", text))
    todo_count = text.count("TODO") + text.count("[TODO")
    duplicate_headings = []
    seen = set()
    for line in lines:
        if line.startswith("#"):
            key = line.strip()
            if key in seen and key not in duplicate_headings:
                duplicate_headings.append(key)
            seen.add(key)

    notes = []
    if len(lines) > 300:
        notes.append("file is fairly long; consider moving detail to references or workflows")
    if blank_runs:
        notes.append("contains large blank-line runs")
    if todo_count:
        notes.append("contains unfinished TODO markers")
    if duplicate_headings:
        notes.append("contains duplicate headings")
    if "AGENTS.md" in path.name and len(lines) > 120:
        notes.append("AGENTS.md may be carrying detail better owned by rules or workflows")
    if path.name == "SKILL.md" and "description:" not in text:
        notes.append("skill frontmatter may be missing description")

    score = 100
    score -= min(blank_runs * 5, 20)
    score -= min(todo_count * 10, 40)
    score -= min(len(duplicate_headings) * 10, 20)
    if len(lines) > 300:
        score -= 10
    score = max(score, 0)

    return {
        "path": str(path),
        "line_count": len(lines),
        "todo_count": todo_count,
        "blank_run_count": blank_runs,
        "duplicate_headings": duplicate_headings,
        "score": score,
        "notes": notes,
    }


def iter_targets(path: Path):
    if path.is_file():
        yield path
        return
    for item in sorted(path.rglob("*.md")):
        yield item
    for item in sorted(path.rglob("*.yaml")):
        yield item


def main() -> int:
    parser = argparse.ArgumentParser(description="Analyze OpenCode config quality.")
    parser.add_argument("path")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    args = parser.parse_args()

    path = Path(args.path).resolve()
    reports = [analyze_text(item) for item in iter_targets(path)]
    if not reports:
        print(f"[ERROR] no analyzable files found for {path}")
        return 1

    if args.format == "json":
        print(json.dumps(reports, ensure_ascii=False, indent=2))
    else:
        for report in reports:
            print(f"{report['path']}")
            print(f"  score: {report['score']}")
            print(f"  lines: {report['line_count']}")
            if report["notes"]:
                for note in report["notes"]:
                    print(f"  note: {note}")
            else:
                print("  note: no obvious structural issues")
    return 0


if __name__ == "__main__":
    sys.exit(main())
