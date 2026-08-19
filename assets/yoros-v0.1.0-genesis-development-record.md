# YorOS v0.1.0 — Genesis

**Release:** v0.1.0  
**Codename:** Genesis  
**Base:** Debian GNU/Linux 13 (Trixie)  
**Architecture:** AMD64 / x86_64  
**Status:** Built and verified  
**Development environment:** Debian 13.5 under WSL2 on Windows 10  
**Test environment:** VirtualBox

---

## 1. Objective

YorOS v0.1.0 was the first engineering milestone of the YorOS project.

The objective was deliberately limited:

> Produce an independently bootable Debian-based Linux image from a reproducible development environment and verify that the resulting operating system can boot independently of WSL.

This version was not intended to contain the final YorShield platform, local AI system, graphical interface, or installer.

The purpose was to establish a working operating-system foundation before higher-level functionality was introduced.

---

## 2. Development Architecture

The initial development workflow was:

```text
Windows 10
    │
    └── WSL2
         │
         └── Debian 13.5
              │
              └── YorOS source
                    │
                    └── Debian live-build
                           │
                           ▼
                    Bootable ISO
                           │
                           ▼
                       VirtualBox
                           │
                           ▼
                    Running YorOS
```

A major architectural principle established during this version was that the WSL environment is only the **development/build environment**.

YorOS itself is generated as an independent Linux image containing its own kernel and userspace.

---

## 3. Development Environment

The Debian WSL environment was verified before development began.

### Debian

```bash
cat /etc/os-release
```

Result:

```text
Debian GNU/Linux 13 (trixie)
Debian version: 13.5
```

### WSL kernel

```bash
uname -a
```

Development environment kernel:

```text
6.18.33.2-microsoft-standard-WSL2
```

### Architecture

```text
x86_64
```

### Development user

```text
roychid
```

### Development home directory

```text
/home/roychid
```

---

## 4. Repository Initialization

The YorOS engineering repository was created at:

```text
/home/roychid/projects/yoros
```

Initial repository creation:

```bash
mkdir -p ~/projects/yoros
cd ~/projects/yoros
git init
git branch -M main
```

Initial project structure:

```text
yoros/
├── ai/
├── branding/
├── build/
├── config/
├── docs/
├── installer/
├── rootfs/
├── services/
├── ui/
├── .gitignore
└── README.md
```

This structure was designed so that future YorOS components could remain separated by responsibility.

---

## 5. Build Toolchain

The primary operating-system image construction tool selected was Debian **live-build**.

Packages installed included:

```bash
sudo apt install -y \
    live-build \
    debootstrap \
    squashfs-tools \
    xorriso \
    isolinux \
    syslinux-common
```

Installed live-build version:

```text
20250505+deb13u1
```

### Key concepts

**live-build**  
Debian's framework for constructing customized live Linux systems.

**debootstrap**  
Creates a minimal Debian filesystem from Debian repositories.

**SquashFS**  
Compressed read-only filesystem commonly used to package live Linux root filesystems.

**ISO hybrid**  
An ISO image capable of being used as optical-media-style boot media and written to USB-compatible media.

**chroot**  
A filesystem environment in which build operations can be performed as though the generated filesystem were the root of a running Linux installation.

---

## 6. Initial Live-Build Configuration

The first build workspace was created under:

```text
build/yoros-0.1/
```

The live system was configured using:

```bash
lb config \
  --distribution trixie \
  --architectures amd64 \
  --binary-images iso-hybrid \
  --archive-areas "main contrib non-free-firmware" \
  --debian-installer none \
  --bootappend-live "boot=live components hostname=yoros username=yor"
```

Important configuration decisions:

- Debian 13 Trixie base
- AMD64 architecture
- Hybrid ISO output
- Live system rather than installed system
- Hostname: `yoros`
- Live user: `yor`
- Debian installer intentionally excluded from the first milestone

---

## 7. Initial Package Set

A live-build package list was introduced:

```text
config/package-lists/yoros.list.chroot
```

Packages included:

```text
linux-image-amd64
live-boot
live-config
systemd
sudo
network-manager
iproute2
iputils-ping
curl
nano
less
ca-certificates
```

This provided the minimum practical environment required for booting, system initialization, networking, diagnostics, and further testing.

---

## 8. YorOS Identity

The first YorOS-specific filesystem identity was introduced through:

```text
/etc/yoros-release
```

with:

```text
NAME="YorOS"
VERSION="0.1"
VERSION_ID="0.1"
CODENAME="Genesis"
DEBIAN_BASE="13"
ARCHITECTURE="amd64"
```

A custom `/etc/motd` was also introduced.

On successful boot the system displayed:

```text
==================================================
                    YorOS 0.1
                     Genesis
==================================================

Debian-based resilient computing platform.

YorOS development build.
YorShield components are not yet installed.

==================================================
```

This established the first visible YorOS system identity.

---

## 9. Reproducible Build Script

Rather than relying on manually remembered build commands, a build script was introduced:

```text
build/build-yoros.sh
```

The intended build pipeline became:

```text
Clean previous build
        ↓
Configure live-build
        ↓
Construct Debian filesystem
        ↓
Install kernel/packages
        ↓
Construct live filesystem
        ↓
Configure bootloader
        ↓
Generate hybrid ISO
```

This was an early step toward making YorOS reproducible on another Debian development machine.

---

## 10. First Build Failure

The first build did not complete.

Bootstrap successfully finished:

```text
P: Bootstrap stage completed
```

but live-build subsequently reported:

```text
E: the following stage is required to be done first: config
```

### Cause

The build script performed:

```text
lb clean
    ↓
lb build
```

Cleaning removed build configuration state required by later stages.

### Fix

The workflow was corrected to:

```text
lb clean
    ↓
lb config
    ↓
lb build
```

This established an important engineering principle for the project:

> The build must recreate required state rather than depending on state left behind by previous builds.

---

## 11. Git and Generated Files Problem

During development, Git attempted to index generated live-build directories.

This produced errors involving files such as:

```text
chroot/etc/credstore/
cache/bootstrap/etc/.pwd.lock
```

### Cause

`live-build` creates root-owned files and complete generated Linux filesystems.

These are build artifacts rather than YorOS source.

### Resolution

Generated directories were excluded from Git, including:

```text
.build/
cache/
chroot/
binary/
*.iso
*.img
```

This established a critical separation:

```text
SOURCE
├── configuration
├── scripts
├── YorOS files
└── documentation

GENERATED
├── chroot
├── cache
├── binary filesystem
└── ISO
```

Only source required to reconstruct YorOS should be version controlled.

---

## 12. Successful Build

After correcting the build workflow, live-build completed:

```text
P: Binary stage completed
P: Build completed successfully
```

Generated image:

```text
live-image-amd64.hybrid.iso
```

Size:

```text
850 MB
```

SHA-256:

```text
c21c50c4b720387139425f598db53978248d8045a0df10ee8bd94d8d546dabc9
```

The image was preserved as the first YorOS release artifact.

---

## 13. Virtual Machine Testing

The ISO was tested using VirtualBox.

Initial boot failed with:

```text
No bootable medium found!
```

This was not a YorOS failure.

### Cause

The generated ISO had not been mounted to the VM's virtual optical drive.

After mounting the correct ISO, the VM booted successfully.

---

## 14. Successful YorOS Boot

YorOS reached:

```text
Debian GNU/Linux 13 yoros tty1

yoros login: yor (automatic login)
```

The custom YorOS MOTD was displayed.

The running system used a Debian Linux kernel similar to:

```text
Linux yoros 6.12.101+deb13-amd64
```

This was important because the development environment itself used:

```text
6.18.33.2-microsoft-standard-WSL2
```

The difference demonstrated that YorOS was **not running using the WSL kernel**.

The generated ISO contained and booted its own Linux kernel.

---

## 15. Verification Tests

The following areas were tested successfully:

### Hostname

```bash
hostname
```

Expected and verified:

```text
yoros
```

### YorOS identity

```bash
cat /etc/yoros-release
```

Verified the custom YorOS release metadata.

### Debian foundation

```bash
cat /etc/os-release
```

Confirmed Debian 13 as the underlying distribution.

### Kernel

```bash
uname -a
```

Confirmed that the independently booted environment was running its own Debian kernel.

### Networking

```bash
ip addr
ping -c 3 deb.debian.org
```

Networking was functional.

### System initialization

```bash
systemctl is-system-running
```

System initialization was checked after boot.

All primary v0.1 validation tests passed.

---

## 16. What v0.1 Proved

YorOS v0.1 demonstrated that the project could:

- maintain Linux distribution source/configuration under Git;
- build from Debian inside WSL2;
- construct a Debian root filesystem;
- include a Linux kernel;
- produce a hybrid ISO;
- boot independently in a virtual machine;
- initialize systemd;
- create the intended live user;
- apply a custom hostname;
- provide working networking;
- include YorOS-specific filesystem content;
- maintain a reproducible development workflow.

The primary milestone was therefore achieved:

> YorOS became an independently bootable Linux distribution image rather than only a project concept.

---

## 17. Known Limitations

YorOS v0.1 did **not** yet contain:

- YorOS Core services
- YorShield security services
- local AI runtime
- local language model
- graphical environment
- YorOS dashboard
- installer
- update mechanism
- recovery system
- hardware-specific validation
- production security hardening

It remained deliberately minimal.

---

## 18. Concepts Learned

Development of v0.1 introduced practical experience with:

- Linux distribution architecture
- WSL2 versus independently booted Linux
- Debian live-build
- debootstrap
- root filesystems
- chroot environments
- Linux boot processes
- Linux kernels
- systemd
- live Linux systems
- hybrid ISO images
- package lists
- filesystem customization
- build caching
- Git repository architecture
- generated versus source files
- SHA-256 artifact verification
- VM-based operating-system testing
- debugging build failures

---

## 19. Result

**YorOS v0.1.0 Genesis was successfully built and boot-tested.**

It became the known-good foundation from which subsequent YorOS engineering could proceed.