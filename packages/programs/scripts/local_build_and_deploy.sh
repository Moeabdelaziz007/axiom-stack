#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOGDIR="$ROOT/logs"
mkdir -p "$LOGDIR"

printf "Project root: %s\n" "$ROOT"

# 1) Force stable toolchain for this project
printf "\n=== rustup override set stable ===\n"
rustup override set stable

# 2) Ensure sbf target (if supported)
printf "\n=== ensure sbf target (may fail on macOS native toolchain) ===\n"
if rustup target list --installed | grep -q "sbf-solana-solana"; then
  printf "sbf target already installed\n"
else
  printf "Attempting to add sbf-solana-solana target (may fail if toolchain doesn't support it)...\n"
  if rustup target add sbf-solana-solana; then
    printf "Added sbf target\n"
  else
    printf "Could not add sbf target for this toolchain. If this fails, Anchor will build using local BPF toolchain or expect Docker. Proceeding anyway.\n"
  fi
fi

# 3) Ensure Solana CLI is on PATH
if ! command -v solana >/dev/null 2>&1; then
  printf "Solana CLI not found. Installing stable solana CLI...\n"
  sh -c "$(curl -sSfL https://release.solana.com/stable/install)" || true
  export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

printf "solana -> %s\n" "$(command -v solana || echo 'not found')"
solana --version || true

# ensure anchor exists
if ! command -v anchor >/dev/null 2>&1; then
  printf "\nWARNING: 'anchor' CLI not found in PATH. Install anchor or use 'avm' to install a matching version.\n"
fi

# 4) Disable Docker builds for Anchor
export BUILD_WITH_DOCKER=0
printf "BUILD_WITH_DOCKER=%s\n" "$BUILD_WITH_DOCKER"

# 5) Build anchor program locally
BUILD_LOG="$LOGDIR/anchor_build_$(date +%Y%m%d_%H%M%S).log"
printf "\n=== Running: anchor build -v (logs -> %s) ===\n" "$BUILD_LOG"
anchor build -v 2>&1 | tee "$BUILD_LOG"

# 6) Show where artifacts are
printf "\n=== Artifacts (searching target & programs) ===\n"
# portable find: avoid -printf which is GNU-only on macOS
if [ -d target ]; then
  find target -maxdepth 4 -type f -print || true
fi
if [ -d programs ]; then
  find programs -maxdepth 5 -type f \( -name '*.so' -o -name '*.d' -o -name '*.dylib' -o -name '*.a' -o -name '*.o' \) -print || true
fi

# 7) Start solana-test-validator in background (if not running)
if ! pgrep -f solana-test-validator >/dev/null 2>&1; then
  if command -v solana-test-validator >/dev/null 2>&1; then
    printf "\n=== Starting solana-test-validator (background) ===\n"
    solana-test-validator --reset > "$LOGDIR/solana_validator_$(date +%Y%m%d_%H%M%S).log" 2>&1 &
    sleep 2
  else
    printf "\nNOTE: solana-test-validator not found. Skipping start. Install solana CLI to run local validator.\n"
  fi
else
  printf "solana-test-validator is already running\n"
fi

# 8) Try anchor deploy (localnet)
DEPLOY_LOG="$LOGDIR/anchor_deploy_$(date +%Y%m%d_%H%M%S).log"
printf "\n=== Running: anchor deploy (logs -> %s) ===\n" "$DEPLOY_LOG"
anchor deploy 2>&1 | tee "$DEPLOY_LOG"

# 9) Run tests
TEST_LOG="$LOGDIR/anchor_test_$(date +%Y%m%d_%H%M%S).log"
printf "\n=== Running: anchor test (logs -> %s) ===\n" "$TEST_LOG"
anchor test 2>&1 | tee "$TEST_LOG"

printf "\n=== Completed. Logs stored in %s ===\n" "$LOGDIR"
