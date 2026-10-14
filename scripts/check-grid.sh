#!/bin/sh
# Fails on spacing and sizes off the 8pt grid (see "8pt grid" in CLAUDE.md). Tailwind's
# numeric steps are 4px, so:
# - spacing (padding, margin, gap, insets, translate) takes `0`, `1` (the 4px half step)
#   or an even step (`2`, `4`, `6`, …)
# - sizes (`w`, `h`, `size`, `min-*`, `max-*`, `basis`) take an even step, or `1`, `3` or
#   `5` for small elements up to 24px (icons, dots, indicators)
# - icon sizes (`size={…}` props and `size = …` defaults) and px or rem lengths inside brackets are multiples of 4px
#   (icons) or 8px (lengths)
# - widths of 320px or more (`w`, `min-w`, `max-w`, `basis` at step 80 and up) use Tailwind's
#   named container scale (`max-w-xs`, `max-w-xl`, `basis-md`, …) instead of a number
set -eu

found=$(grep -rnE '[0-9]' src --include='*.ts' --include='*.tsx' --exclude='*.test.ts' --exclude='*.test.tsx' |
  perl -ne '
    my ($loc, $line) = /^([^:]+:\d+):(.*)$/ or next;
    my $space = qr/(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|start|end|translate-[xy]|scroll-[mp][xytblrse]?)/;
    my $size = qr/(?:(?:min-|max-)?[wh]|size|basis)/;
    while ($line =~ /(?<![\w-])-?($space|$size)-(\d+(?:\.\d+)?)(?![\w.\/-])/g) {
      my ($util, $step) = ($1, $2);
      my $ok = $util =~ /^$space$/
        ? ($step == 0 || $step == 1 || ($step == int($step) && $step % 2 == 0))
        : ($step == int($step) && ($step % 2 == 0 || $step <= 5));
      print "$loc: $util-$step\n" unless $ok;
      print "$loc: $util-$step (use the container scale: xs, sm, md, lg, xl, 2xl, …)\n"
        if $util =~ /^(?:(?:min-|max-)?w|basis)$/ && $step >= 80;
    }
    while ($line =~ /\bsize(?:=\{| = )(\d+(?:\.\d+)?)/g) {
      print "$loc: icon size $1\n" if $1 % 4;
    }
    while ($line =~ /\[[^\]\s]*\]/g) {
      my $value = $&;
      while ($value =~ /(\d+(?:\.\d+)?)(px|rem)/g) {
        my $px = $2 eq "rem" ? $1 * 16 : $1;
        print "$loc: $1$2\n" if $px % 8;
      }
    }
  ')

if [ -n "$found" ]; then
  echo "Values off the 8pt grid or the container scale (see \"8pt grid\" in CLAUDE.md):" >&2
  echo "$found" >&2
  exit 1
fi
