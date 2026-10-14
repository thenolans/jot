#!/bin/sh
# Fails on bracketed Tailwind values that should come from tokens in src/styles/tokens.css:
# a length anywhere in the brackets (`mt-[13px]`, `w-[calc(100%-2.5rem)]`; names inside
# `var(…)` don't count) or any bracketed value on a token-backed utility (`rounded-[…]`,
# `border-[…]`, `ease-[…]`, …). Layout-only values are allowed.
set -eu

# Utilities whose values always come from tokens
token_utilities='rounded|border|ease|shadow|text|font|tracking|leading|duration|delay|bg|fill|stroke|ring|outline'

# Layout-only values, allowed even when they hold lengths
allowed='^(grid-cols|grid-rows|col-span|row-span)-\\[|^max-w-\\[[0-9.]+ch\\]$'

# Each `utility-[value]` in src, as `file:line:utility-[value]` (`[&…]` selectors aren't
# utilities, but a utility inside one, like `[&>li]:rounded-[4px]`, is still checked)
found=$(grep -rnoE '[a-z][a-z0-9-]*-\[[^] ]*\]' src --include='*.ts' --include='*.tsx' |
  awk -F: -v tokens="^($token_utilities)(-[a-z]+)*-\\\\[" -v allowed="$allowed" '{
    class = $0
    sub(/^[^:]*:[^:]*:/, "", class)
    if (class ~ allowed) next
    value = class
    sub(/^[^[]*\[/, "", value)
    gsub(/var\([^)]*\)/, "var()", value)
    if (class ~ tokens || value ~ /[0-9](px|r?em)([^a-z]|$)/) print
  }')

if [ -n "$found" ]; then
  echo "Arbitrary Tailwind values found; use or add a token in src/styles/tokens.css:" >&2
  echo "$found" >&2
  exit 1
fi
