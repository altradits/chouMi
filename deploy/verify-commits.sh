#!/bin/sh
# Verify that main contains only commits signed by a trusted key, the way
# Bitcoin Core's contrib/verify-commits does. Every commit on the first-parent
# line after TRUST_ROOT (each merge, and anything committed directly) must carry
# a good SSH signature from a key in the trusted-signers file. Contributors'
# own commits (reached through a merge's second parent) may be unsigned: the
# signed merge is the maintainer vouching for them after review.
#
#   sh deploy/verify-commits.sh [ref] [allowed-signers-file]
#     ref                    default: HEAD
#     allowed-signers-file   default: .github/allowed_signers
#
# CI runs it on every push to main, so a stolen GitHub login can push code but
# the push is flagged unless every commit carries a trusted signature.
# Exit 0: all good. Exit 1: something is unsigned, signed by an unknown key, or
# the trust root isn't an ancestor (rewritten history).
set -u
# The public-ready snapshot: everything before it (the private single-commit
# history) was replaced. Set to the snapshot's hash in the commit after it.
# Never move this backwards.
TRUST_ROOT=df93fac30e04c6eef6d42461608fa95513d142ad
REF="${1:-HEAD}"
SIGNERS="${2:-.github/allowed_signers}"

[ -f "$SIGNERS" ] || { echo "verify-commits: trusted signers file not found: $SIGNERS"; exit 1; }
if ! git merge-base --is-ancestor "$TRUST_ROOT" "$REF" 2>/dev/null; then
  echo "verify-commits: the trust root $TRUST_ROOT is not an ancestor of $REF (history rewritten, or not fetched)."
  exit 1
fi
# Servers with OpenSSH older than 8.2 can't run git's SSH check (no
# `ssh-keygen -Y verify`); there the same signature is checked in Node
# (deploy/verify-sshsig.mjs). Either check alone must pass; neither weakens the other.
ROOT=$(git rev-parse --show-toplevel)
NODE_BIN=$(command -v node 2>/dev/null || ls -d "$HOME/nodevenv/${ROOT#$HOME/}"/*/bin/node 2>/dev/null | sort -V | tail -1 || true)
bad=0; n=0
for c in $(git rev-list --first-parent "$TRUST_ROOT..$REF"); do
  n=$((n + 1))
  if ! git -c gpg.format=ssh -c gpg.ssh.allowedSignersFile="$SIGNERS" verify-commit "$c" >/dev/null 2>&1 \
    && ! { [ -n "$NODE_BIN" ] && "$NODE_BIN" "$ROOT/deploy/verify-sshsig.mjs" "$c" "$SIGNERS" >/dev/null 2>&1; }; then
    echo "verify-commits: NOT trusted: $(git log -1 --format='%h %an: %s' "$c")"
    bad=$((bad + 1))
  fi
done
if [ "$bad" -gt 0 ]; then echo "verify-commits: $bad of $n commit(s) after the trust root are not signed by a trusted key."; exit 1; fi
echo "verify-commits: $n commit(s) after the trust root, all signed by trusted keys."
