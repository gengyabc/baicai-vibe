#!/usr/bin/env python3

import argparse
import shutil
import sys
from pathlib import Path
from typing import List, Tuple


def optimize_text(text: str) -> Tuple[str, List[str]]:
    changes: List[str] = []
    had_final_newline = text.endswith("\n")
    lines = [line.rstrip() for line in text.splitlines()]
    trimmed = "\n".join(lines)
    if trimmed != text.rstrip("\n"):
        changes.append("trimmed trailing whitespace")

    while "\n\n\n" in trimmed:
        trimmed = trimmed.replace("\n\n\n", "\n\n")
    if trimmed != "\n".join(lines):
        changes.append("collapsed long blank-line runs")

    if not had_final_newline:
        trimmed += "\n"
        changes.append("normalized final newline")
    elif text.endswith("\n"):
        trimmed += "\n"

    return trimmed, changes


def apply_to_file(path: Path, mode: str) -> int:
    original = path.read_text(encoding="utf-8")
    optimized, changes = optimize_text(original)
    if not changes:
        print(f"[OK] {path}: no safe mechanical changes")
        return 0

    print(f"{path}")
    for change in changes:
        print(f"- {change}")

    if mode == "report":
        return 0

    backup = path.with_suffix(path.suffix + ".bak")
    shutil.copy2(path, backup)
    path.write_text(optimized, encoding="utf-8")
    print(f"[OK] wrote optimized file and backup: {backup}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply safe mechanical OpenCode config optimizations.")
    parser.add_argument("path")
    parser.add_argument("--mode", choices=["report", "apply"], default="report")
    args = parser.parse_args()

    path = Path(args.path).resolve()
    if not path.is_file():
        print(f"[ERROR] expected a file: {path}")
        return 1
    return apply_to_file(path, args.mode)


if __name__ == "__main__":
    sys.exit(main())
