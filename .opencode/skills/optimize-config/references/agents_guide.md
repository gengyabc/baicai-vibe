# AGENTS Guide

## Purpose

`AGENTS.md` is the project's global operating model.

It should tell an agent:

- what the product is
- who the audience is
- what must always be true
- how the repository is organized

## Good Structure

Common sections:

- goal
- audience
- system structure
- product rules
- persistence rules
- implementation expectations

## Rewrite Strategy

A full rewrite is acceptable when it creates a clearer single source of truth.

When rewriting:

1. preserve core product constraints unless the user asked to change them
2. avoid moving detailed schemas into `AGENTS.md`
3. prefer high-signal statements over exhaustive detail

## What Not to Put Here

- long schemas better placed in rules
- long procedures better placed in workflows
- repeated examples already covered elsewhere

## Update Checklist

1. compare current product intent to actual repository structure
2. remove stale structure descriptions
3. keep global rules aligned with loaded rules and workflows
