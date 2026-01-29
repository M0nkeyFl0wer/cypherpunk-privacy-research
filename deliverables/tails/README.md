# Tails OS

## Description
Tails (The Amnesic Incognito Live System) is a portable operating system that protects against surveillance and censorship. It runs from a USB stick, leaves no trace on the host computer, and routes all internet traffic through Tor. Used by Edward Snowden during the NSA revelations. Merged into the Tor Project in September 2024.

## Links
- **Website**: https://tails.net
- **GitLab**: https://gitlab.tails.boum.org/tails/tails
- **Documentation**: https://tails.net/doc/

## Category
Online (Amnesic Live Operating System)

## Ecosystem
Non-blockchain (Traditional Privacy Technology)

## Key Features

### Amnesic Design
- Runs entirely in RAM, never writes to hard drive
- Overwrites RAM on shutdown (cold boot attack protection)
- Each boot starts from clean state
- Optional encrypted persistent storage

### Privacy Tools Included
- Tor Browser with NoScript, uBlock Origin
- Thunderbird with OpenPGP
- OnionShare for anonymous file sharing
- KeePassXC password manager
- Electrum Bitcoin wallet
- Metadata Cleaner

## Project Status
**Status**: Production (Part of Tor Project)

### Key Milestones
| Date | Event |
|------|-------|
| Jun 2009 | First release as "amnesia 0.2" |
| Sep 2011 | Renamed to "Tails" (v0.8) |
| Sep 2024 | Merged into Tor Project |
| Jan 2026 | Tails 7.x (based on Debian 13) |

## Team
See [TEAM.md](reports/TEAM.md) for detailed team information.

### Leadership
- **intrigeri** - Tails Team Lead (now at Tor Project)
- Developers traditionally use pseudonyms

## Technical Details
See [TECHNICAL.md](reports/TECHNICAL.md) for technical documentation.

## Security
See [SECURITY.md](reports/SECURITY.md) for security analysis.

## Code Review
See [CODE_REVIEW.md](reports/CODE_REVIEW.md) for repository analysis.

## System Requirements
- 2 GB RAM minimum
- 64-bit x86-64 processor
- 8 GB USB stick minimum

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
