#!/usr/bin/env python3
"""Fix corrupted requirements.txt"""

# Read current file
with open('requirements.txt', 'r') as f:
    lines = f.readlines()

# Keep only first 47 lines (before corruption)
good_lines = lines[:47]

# Add the new dependencies properly
good_lines.append('\n')
good_lines.append('# Web Scraping\n')
good_lines.append('requests==2.31.0\n')
good_lines.append('beautifulsoup4==4.12.2\n')

# Write back
with open('requirements.txt', 'w') as f:
    f.writelines(good_lines)

print('[+] Fixed requirements.txt')
