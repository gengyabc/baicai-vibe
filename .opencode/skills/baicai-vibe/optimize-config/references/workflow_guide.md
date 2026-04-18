# Workflow Guide

## Purpose

Workflows hold multi-step logic that commands or agents should follow.

## Common Structure

- goal
- inputs
- process or steps
- outputs
- constraints

## Design Rules

- make steps action-oriented
- keep one workflow focused on one job
- reference rules for shared constraints rather than copying them
- let commands dispatch to workflows instead of embedding all logic

## Good Uses

- onboarding flow
- profile persistence
- parsing a target and branching to different actions
- deciding next learning steps

## Update Checklist

1. verify inputs and outputs are still accurate
2. check for repeated logic that could move to another workflow
3. ensure steps are ordered and executable
