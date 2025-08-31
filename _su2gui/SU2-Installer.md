---
title: Install / Update SU2
permalink: /su2gui/SU2-Installer/
---


This guide walks you through installing or updating SU2 for use with SU2GUI. It covers installing pre-compiled binaries (recommended), plus environment setup, verification, and troubleshooting tips.

SU2GUI ships with a simple Installation Wizard you can run from the app. You can also install SU2 with conda or build it from source if you need custom options.

> Tested SU2 release: v8.2.0

---

## Before you begin

- Operating systems: Windows 10/11, macOS, or Linux (WSL is supported for Linux workflows on Windows)
- Python: 3.8+
- Disk space: 2–5 GB (more for source builds)
- Network: Reliable internet for downloads


If you're launching the SU2GUI installer UI from source, install the GUI dependencies first:

```bash
pip install -r requirements.txt
```

---

## Start the Installation Wizard

There are two ways to open the installer UI:

1) From SU2GUI

- Open SU2GUI and click the “Install / Update SU2” button in the top toolbar to open the Installation Wizard dialog.

2) Directly from the installer module via CLI

```bash
python install_su2.py
```

This opens the “SU2 Installation Wizard” dialog with all options in one place.

![SU2 Installation Wizard](../../su2gui_files/User_guide/SU2-Installer/SU2%20Insallation%20Wizard.png)

---

## Choose an installation mode

In the wizard’s “Installation Mode” selector, pick “Pre‑compiled Binaries (Recommended)”: 

### 1) Pre‑compiled Binaries (Recommended)

- Best for most users—fast and simple.
- The wizard detects your platform (Windows/macOS/Linux) and downloads the matching archive.
- Optional: Enable MPI to fetch an “-mpi” build where available.

Steps in the wizard:

1. Set the Installation Directory (default is a folder named `SU2_RUN` in your home directory or active virtual environment).
2. Pick “Pre-compiled Binaries (Recommended)”.
3. Click Install.

The wizard will download `SU2-v8.2.0-<platform>.zip`, extract it to your chosen directory, and configure your environment.

---

## Environment setup (done automatically)

After a successful install, the wizard adds these environment variables for you:

- `SU2_HOME` → the chosen install directory
- `SU2_RUN` → the `bin` folder inside `SU2_HOME`
- `PATH` is updated to include `SU2_RUN`
- `PYTHONPATH` is updated to include `SU2_RUN`

Where they’re written:

- Windows: `%USERPROFILE%\.su2_env.bat`
- Linux/macOS: your shell rc file (e.g., `~/.bashrc`, `~/.zshrc`)

To activate immediately:

- Windows (PowerShell or CMD):

```bat
%USERPROFILE%\.su2_env.bat
```

- Linux/macOS:

```bash
source ~/.bashrc   # or your shell’s rc file
```

Opening a new terminal also picks up the changes automatically.

---

## Verify your installation

Open a new terminal and check that SU2 is on your PATH.

- Check executables:

```bash
SU2_CFD --help
```

On Windows, `SU2_CFD.exe --help` also works.

- Check the Python wrapper (if built/installed):

```bash
python -c "import SU2, sys; print('SU2 module:', SU2.__file__)"
```

If both succeed, you’re good to go.

---

## Using SU2 with SU2GUI

SU2GUI detects your SU2 install via the environment variables above. If needed, you can set or update the SU2 path from within the GUI settings. Once set, you can run cases directly and monitor results in real time.

For case management details, see the guide on [Manage Cases](../Manage-Cases/). For plotting and geometry views, see [Result Analysis](../Result-Analysis/).

---

## Updating or uninstalling

- Update: Re‑open the Installation Wizard and run the same mode again with your existing install directory.
- Uninstall: Close SU2GUI, delete the install directory, and remove the SU2 block from your shell rc file (or delete `%USERPROFILE%\.su2_env.bat` on Windows).

---

## Troubleshooting

- Permission denied when installing
  - Choose a directory you own (the default `SU2_RUN` under your home works well).

- Commands not found after install
  - Open a new terminal or re‑source your rc file. On Windows, run `%USERPROFILE%\.su2_env.bat`.

- MPI not detected
  - Ensure an MPI implementation is installed and on PATH. For binaries, pick the “-mpi” variant.

- GUI cannot find SU2
  - Verify `SU2_CFD --help` works in a new terminal. Then restart SU2GUI so it picks up the environment.

---

## Notes for WSL and macOS

- WSL: Install Linux binaries inside your WSL distribution. Use SU2GUI on Windows or inside WSL depending on your workflow. File paths should live within the WSL filesystem for best performance.
- Apple Silicon (M1/M2): The wizard picks the correct macOS build. For source builds, prefer native toolchains and ensure Python is arm64.

---

## Where things get installed

By default, the installer suggests a folder named `SU2_RUN` inside your home directory or active virtual environment. Inside it, `bin/` contains the SU2 executables and the Python wrapper when enabled. The installer sets `SU2_HOME` to this folder and `SU2_RUN` to `SU2_HOME/bin`.
