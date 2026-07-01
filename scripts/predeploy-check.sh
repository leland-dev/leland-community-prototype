#!/usr/bin/env bash
#
# Pre-deploy safety check for the shared prototype.
#
# Cloudflare deploys from your LOCAL files, and a deploy REPLACES whatever is
# live — it does not merge. So if your local `main` is behind `origin/main`,
# deploying would wipe out a teammate's work that's already on GitHub.
#
# This blocks a deploy when you're behind, and warns (without blocking) if you
# have local work that hasn't been pushed yet.

set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "🔎 Pre-deploy check (branch: $BRANCH)…"
git fetch origin "$BRANCH" --quiet

# How many commits origin has that we don't (= we're behind).
BEHIND="$(git rev-list --count "HEAD..origin/$BRANCH" 2>/dev/null || echo 0)"
# How many commits we have that origin doesn't (= unpushed).
AHEAD="$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null || echo 0)"

if [ "$BEHIND" -gt 0 ]; then
  echo ""
  echo "🛑 BLOCKED: your '$BRANCH' is $BEHIND commit(s) BEHIND origin/$BRANCH."
  echo "   Deploying now would overwrite the live site with STALE code and"
  echo "   erase a teammate's changes that are already on GitHub."
  echo ""
  echo "   Fix it first:"
  echo "     git pull --rebase origin $BRANCH   (or: git sync)"
  echo "     npm run deploy"
  echo ""
  exit 1
fi

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "⚠️  Note: you have uncommitted changes — they'll deploy, but teammates"
  echo "   won't see them on GitHub until you commit + push."
fi

if [ "$AHEAD" -gt 0 ]; then
  echo "⚠️  Note: you have $AHEAD commit(s) not yet pushed. Remember to 'git push'"
  echo "   so teammates get them on GitHub."
fi

echo "✅ Up to date with origin/$BRANCH — safe to deploy."
