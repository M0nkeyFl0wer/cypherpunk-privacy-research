# Tails OS - Technical Report

## Base System
- **Base**: Debian 13 (Trixie)
- **Desktop**: GNOME
- **Kernel**: 64-bit PAE-enabled with NX-bit and SMP support
- **License**: GNU GPL v3+

## System Requirements
| Requirement | Specification |
|-------------|---------------|
| RAM | 2 GB minimum |
| Processor | 64-bit x86-64 |
| Storage | 8 GB USB minimum |
| Architecture | x86-64 only (no ARM/PowerPC) |

## Included Software

### Privacy & Security
| Software | Purpose |
|----------|---------|
| Tor Browser | Anonymous web browsing |
| Thunderbird | Email with OpenPGP |
| OnionShare | Anonymous file sharing |
| KeePassXC | Password manager |
| Electrum | Bitcoin wallet |
| GnuPG/Kleopatra | Encryption/signing |
| Metadata Cleaner | Remove file metadata |
| LUKS/VeraCrypt | Volume encryption |

### Productivity
| Software | Purpose |
|----------|---------|
| LibreOffice | Office suite |
| GIMP | Image editing |
| Inkscape | Vector graphics |
| Audacity | Audio editing |

## Network Features

### Tor Integration
- All traffic routed through Tor
- Stream isolation per application
- Onion Circuits frontend

### Censorship Circumvention
| Transport | Method |
|-----------|--------|
| obfs4 | Traffic obfuscation |
| meek | Domain fronting |
| snowflake | WebRTC-based |

## Persistent Storage
- **Encryption**: LUKS2 with Argon2id
- **Optional**: Disabled by default
- **Stores**: Files, applications, settings between sessions
- **Warning**: Encrypted but forensically detectable

## Version History

| Version | Date | Base |
|---------|------|------|
| amnesia 0.2 | Jun 2009 | - |
| Tails 0.8 | Sep 2011 | First as "Tails" |
| Tails 6.0 | Feb 2024 | Debian 12 |
| Tails 6.11 | Jan 2025 | Security fixes |
| Tails 7.x | 2025 | Debian 13 |

## Boot Process
1. BIOS/UEFI loads from USB
2. Bootloader (syslinux/GRUB)
3. Linux kernel loads
4. System runs entirely in RAM
5. No trace left on host machine

## Sources
- https://tails.net/doc/
- https://tails.net/contribute/design/

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
