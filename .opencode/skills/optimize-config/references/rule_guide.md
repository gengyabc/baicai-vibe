# Rule Guide

## Purpose

Rules define reusable constraints, schemas, or behavioral guidance that can apply across commands and workflows.

## Design Rules

- prefer reusable language
- avoid command-specific dispatch steps
- include examples only when they remove ambiguity
- keep the rule focused on one concern

## Good Rule Types

- language constraints
- safety constraints
- persistence schema
- file protection policy

## Bad Rule Types

- a long one-off procedure for a single command
- duplicated workflow steps
- product overview text that belongs in `AGENTS.md`

## Update Checklist

1. check whether the rule overlaps another rule
2. remove repeated text if another file already owns it
3. keep examples short
