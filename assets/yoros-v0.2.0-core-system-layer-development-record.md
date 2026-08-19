# YorOS v0.2.0 — Core System Layer

**Version:** 0.2  
**Codename:** Genesis  
**Base:** Debian GNU/Linux 13 (Trixie)  
**Architecture:** AMD64 / x86_64  
**Status:** ISO successfully built; final runtime verification pending  
**Development environment:** Debian 13.5 under WSL2  
**Test target:** VirtualBox

---

## 1. Objective

YorOS v0.1 proved that the project could generate an independently bootable Linux operating-system image.

Version 0.2 moves the project to the next stage:

> Introduce a software and service layer owned by YorOS itself.

The distinction is:

```text
v0.1
Linux
└── Debian
    └── YorOS identity

v0.2
Linux
└── Debian
    └── YorOS system layer
        ├── configuration
        ├── core service
        ├── commands
        └── logging
```

This is the beginning of functionality implemented specifically for YorOS rather than functionality inherited directly from Debian.

---

## 2. Architecture

The intended system architecture for v0.2 is:

```text
Linux Kernel
      ↓
Debian 13 Base
      ↓
systemd
      ↓
YorOS Core
      ↓
Future YorShield Services
      ↓
Future Local AI
      ↓
Future YorOS Interface
```

YorOS Core is intended to become the foundation upon which higher-level YorOS components can later depend.

---

## 3. Source Architecture Improvement

Version 0.2 introduced a maintained root filesystem source tree.

Instead of placing YorOS files directly into live-build's generated workspace, system files are maintained under:

```text
rootfs/
```

Current structure:

```text
rootfs/
├── etc/
│   ├── motd
│   ├── yoros-release
│   ├── yoros/
│   │   └── yoros.conf
│   └── systemd/system/
│       └── yoros-core.service
│
├── opt/
│   └── yoros/
│       └── bin/
│           ├── yoros-core
│           └── yoros-status
│
└── usr/local/bin/
    └── yoros-status
```

This separates maintained YorOS source from temporary live-build output.

---

## 4. YorOS Configuration

A dedicated configuration namespace was introduced:

```text
/etc/yoros/
```

Initial configuration:

```text
/etc/yoros/yoros.conf
```

Contents:

```bash
YOROS_VERSION="0.2"
YOROS_CODENAME="Genesis"
YOROS_PLATFORM="amd64"
YOROS_CORE="/opt/yoros"
```

This begins establishing `/etc/yoros` as the location for system-wide YorOS configuration.

---

## 5. YorOS Application Namespace

YorOS-owned software was placed under:

```text
/opt/yoros/
```

Current binary location:

```text
/opt/yoros/bin/
```

This separates YorOS application software from the Debian base.

---

## 6. YorOS Core

The first YorOS-owned background service was introduced:

```text
/opt/yoros/bin/yoros-core
```

Initial implementation:

```bash
#!/usr/bin/env bash

LOG="/var/log/yoros/core.log"

mkdir -p /var/log/yoros

echo "$(date -Is) YorOS Core starting" >> "$LOG"

while true; do
    sleep 60
done
```

This first implementation is intentionally minimal.

Its purpose is not yet to perform cybersecurity analysis.

Its purpose is to establish and test:

- YorOS-owned daemon execution;
- systemd integration;
- automatic startup;
- restart behavior;
- YorOS logging;
- future service architecture.

---

## 7. systemd Integration

A systemd unit was created:

```text
/etc/systemd/system/yoros-core.service
```

Configuration:

```ini
[Unit]
Description=YorOS Core System Service
After=network.target

[Service]
Type=simple
ExecStart=/opt/yoros/bin/yoros-core
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

This allows YorOS Core to participate in the normal Linux service lifecycle.

The intended boot sequence becomes:

```text
Kernel
  ↓
systemd
  ↓
network.target
  ↓
yoros-core.service
  ↓
YorOS Core
```

---

## 8. Automatic Service Enablement

A live-build chroot hook was introduced:

```text
config/hooks/live/010-enable-yoros-core.hook.chroot
```

The hook executes:

```bash
systemctl enable yoros-core.service
```

during image construction.

This is intended to ensure that a freshly booted YorOS image automatically starts YorOS Core without requiring manual service configuration.

---

## 9. YorOS Status Command

The first user-facing YorOS command was created:

```text
/opt/yoros/bin/yoros-status
```

It reports information including:

```text
YorOS Status

Version
Hostname
Kernel
Yor Core state
Network state
AI Engine state
YorShield state
```

The intended output resembles:

```text
======================================
             YorOS Status
======================================

Version:       0.2
Hostname:      yoros
Kernel:        6.12.x
Yor Core:      Running
Network:       Connected
AI Engine:     Not installed
YorShield:     Not installed

======================================
```

Because `/opt/yoros/bin` is not necessarily part of the standard shell PATH, a link was added:

```text
/usr/local/bin/yoros-status
    ↓
/opt/yoros/bin/yoros-status
```

This allows:

```bash
yoros-status
```

rather than requiring:

```bash
/opt/yoros/bin/yoros-status
```

---

## 10. YorOS Logging

The first dedicated YorOS logging namespace was introduced:

```text
/var/log/yoros/
```

YorOS Core writes startup information to:

```text
/var/log/yoros/core.log
```

Example intended record:

```text
2026-08-19T... YorOS Core starting
```

This is currently basic file logging.

A more structured logging architecture can be introduced in later releases.

---

## 11. Root Filesystem Synchronization

A dedicated script was introduced:

```text
build/sync-rootfs.sh
```

Its purpose is to synchronize:

```text
yoros/rootfs/
```

into:

```text
live-build/config/includes.chroot/
```

before building.

Conceptually:

```text
Maintained source

rootfs/
   │
   │ sync-rootfs.sh
   ▼
config/includes.chroot/
   │
   │ live-build
   ▼
YorOS ISO
   │
   ▼
Running /
```

For example:

```text
SOURCE:
rootfs/etc/yoros/yoros.conf

        ↓ BUILD ↓

RUNNING YOROS:
/etc/yoros/yoros.conf
```

This significantly improves reproducibility.

---

## 12. Build Workspace Mistake

During the transition from v0.1 to v0.2, an attempt was initially made to copy:

```bash
cp -a build/yoros-0.1 build/yoros-0.2
```

This produced numerous permission errors.

Examples included:

```text
Permission denied
Operation not permitted
```

for files under:

```text
chroot/
cache/bootstrap/
dev/
etc/shadow
etc/sudoers
```

### Cause

A completed live-build workspace contains:

- a generated Linux root filesystem;
- root-owned security files;
- package caches;
- device nodes;
- temporary build state.

These are not source code and should not be copied to create another YorOS version.

### Corrected approach

The incomplete v0.2 workspace was removed.

A new clean workspace was created and initialized with `lb config`.

Only maintained configuration was carried forward.

This established another important engineering rule:

> Every YorOS build environment should be reconstructable from maintained source rather than cloned from generated build output.

---

## 13. Source vs Generated Architecture

The resulting architecture is:

```text
MAINTAINED SOURCE

yoros/
├── rootfs/
├── config/
├── services/
├── build scripts/
└── documentation

          ↓

BUILD WORKSPACE

build/yoros-0.2/
├── config/
├── chroot/
├── cache/
├── binary/
└── temporary state

          ↓

ARTIFACT

YorOS ISO
```

The generated workspace is disposable.

The maintained source is authoritative.

This is important for eventually moving development from WSL to bare-metal Debian or another build server.

---

## 14. Build

YorOS v0.2 successfully completed the live-build pipeline.

Terminal result:

```text
P: Binary stage completed
P: Source stage disabled, skipping
P: Build completed successfully
```

Generated ISO:

```text
live-image-amd64.hybrid.iso
```

Size:

```text
850 MB
```

SHA-256:

```text
941a2f48c0870394bf2564a5893ed04cacc7536bd2adad86e049891bfa82e341
```

Windows test copy:

```text
YorOS-0.2-Genesis-amd64.iso
```

---

## 15. Planned Runtime Verification

At the time this document was created, the ISO had successfully built but the complete v0.2 runtime verification had **not yet been performed**.

The following tests therefore remain mandatory before v0.2 can be marked verified.

### Release identity

```bash
cat /etc/yoros-release
```

Expected:

```text
VERSION="0.2"
VERSION_ID="0.2"
```

### YorOS Core service

```bash
systemctl status yoros-core --no-pager
```

Expected:

```text
Active: active (running)
```

### Service enablement

```bash
systemctl is-enabled yoros-core
```

Expected:

```text
enabled
```

### Service runtime state

```bash
systemctl is-active yoros-core
```

Expected:

```text
active
```

### YorOS command

```bash
yoros-status
```

Expected to report:

```text
Yor Core: Running
```

### YorOS configuration

```bash
cat /etc/yoros/yoros.conf
```

### Logging

```bash
cat /var/log/yoros/core.log
```

A YorOS Core startup event should be present.

### Reboot persistence

After:

```bash
sudo reboot
```

the following must still return:

```bash
systemctl is-active yoros-core
```

Expected:

```text
active
```

This verifies that YorOS Core starts automatically during system initialization rather than merely working when manually launched.

---

## 16. Current Verification Status

| Component | Status |
|---|---|
| Source architecture | Implemented |
| `/etc/yoros` | Implemented in build source |
| `/opt/yoros` | Implemented in build source |
| YorOS Core | Implemented |
| systemd unit | Implemented |
| Build-time enable hook | Implemented |
| `yoros-status` | Implemented |
| YorOS logging | Implemented |
| ISO generation | **Passed** |
| ISO checksum | **Recorded** |
| VM boot | Pending for v0.2 |
| YorOS Core runtime | Pending |
| Automatic service startup | Pending |
| Reboot persistence | Pending |

Until those runtime tests pass, v0.2 should **not** be represented as a fully verified release.

---

## 17. Concepts Introduced

Version 0.2 added practical experience with:

- Linux filesystem hierarchy
- `/etc` configuration
- `/opt` application layout
- `/usr/local/bin`
- symbolic links
- systemd unit files
- Linux daemons
- service dependencies
- service restart policies
- system boot targets
- persistent system services
- logging
- live-build chroot hooks
- root filesystem overlays
- reproducible filesystem synchronization
- build/source separation
- generated filesystem permissions
- Linux device nodes
- release versioning

---

## 18. Difference from v0.1

The key evolution is:

```text
YorOS 0.1
"Can we build and independently boot our Linux image?"

                    ↓

                 PROVEN

                    ↓

YorOS 0.2
"Can our own YorOS software become part of the
operating system and start during boot?"
```

Version 0.2 therefore represents the transition from a customized bootable Linux foundation toward an operating system with a dedicated YorOS software layer.

---

## 19. Known Limitations

The current YorOS Core daemon does not yet perform meaningful system management.

It currently establishes infrastructure for future capabilities.

Still absent:

- YorShield security engine
- network discovery engine
- security telemetry
- detection engine
- endpoint monitoring
- local LLM
- AI orchestration
- graphical interface
- dedicated installer
- update system
- recovery environment
- production hardening
- physical hardware testing

These are intentionally deferred.

---

## 20. Next Step

The immediate next step is **runtime verification of v0.2 in VirtualBox**.

Only after all v0.2 tests pass should the release be tagged as a known-good baseline.

Future development can then begin adding meaningful system capabilities on top of YorOS Core.