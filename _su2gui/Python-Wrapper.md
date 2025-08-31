---
title: Python Wrapper
permalink: /su2gui/Python-Wrapper/
---


SU2GUI can generate small Python scripts that run SU2 through its Python bindings (pysu2). This is useful for:

- Launching simulations programmatically (single or MPI)
- Sharing a reproducible “runner” alongside your config
- Applying custom, position-based wall temperatures on a boundary

This page explains the custom dynamic wrapper and how to generate, run, and troubleshoot it.

---

## What gets generated
When you export from SU2GUI, the following files are written into your case folder:

- `config.json` — JSON version of your SU2 configuration
- `config.cfg` — SU2 configuration file
- `run_su2.py` — Custom temperature wrapper for a selected Wall marker

Your case folder lives under:

- `<repo>/user/<case_name>/`

The generated wrapper script runs SU2 using the exported `config.cfg` with pysu2, supporting both serial and MPI execution.Typical flow inside the script:

  ```
1. `config_file = 'config.cfg'`
2. Create `driver = pysu2.CSinglezoneDriver(config_file, 1, MPI.COMM_WORLD)`
3. `driver.Preprocess(0)` → `driver.Run()` → `driver.Postproces`
```

---

## Dynamic wall temperature wrapper (run_su2.py)

This wrapper applies a custom, position-based wall temperature to a selected boundary marker before running the solver.

It:

1. Loads your mesh and configuration with `pysu2.CSinglezoneDriver`
2. Finds the chosen Wall `MARKER`
3. Iterates over marker vertices and evaluates a user expression using the point’s coordinates `(x, y, z)`
4. Sets `SU2Driver.SetMarkerCustomTemperature(MarkerID, i_vertex, WallTemp)` for each vertex
5. Starts the solver

Supported variables in the temperature expression:

- Coordinates: `x`, `y`, `z`
- Math: `sin`, `cos`, `tan`, `log`, `sqrt`, `exp`, `pi`, `abs`, `fabs`

Example expression:

```text
560.0 - 260.0*sin(x*pi/4)
```

> Note: This wrapper currently uses a position-based (spatial) expression. Time‑varying/CHT variants are not enabled in the GUI.

### How to generate from the GUI

1. Go to the Boundaries tab and select a Wall marker.
2. Enable “Custom Temperature”.
3. Enter your temperature formula (e.g., `560.0 - 260.0*sin(x*pi/4)`).
4. Click the button to “Generate Python Wrapper”.

This writes `run_su2_dynamic.py` and updates `config.cfg` to include the needed markers (e.g., `MARKER_ISOTHERMAL`, `MARKER_PYTHON_CUSTOM`) for that boundary.

![Dynamic Temperature UI](../../su2gui_files/User_guide/Python-Wrapper/dynamic temp ui.png)
### How to run

- Serial:

```bash
python run_su2.py
```

- MPI (example with 4 ranks):

```bash
mpirun -np 4 python run_su2.py
```

> Tip: Start with a small number of ranks to validate your expression and setup.

---

## Requirements

- SU2 installed and on PATH (see [Install / Update SU2](../Install-SU2/))
- `pysu2` importable (enabled by conda install or source build with `-Denable-pywrapper=true`)
- `mpi4py` if you plan to run MPI

On successful environment setup, the installer adds:

- `SU2_HOME` → install directory
- `SU2_RUN` → `${SU2_HOME}/bin`
- `PATH` and `PYTHONPATH` augmented with `SU2_RUN`

Open a new terminal and verify:

```bash
SU2_CFD --help
python -c "import SU2; print('SU2 module OK')"
```

---

## Tips and best practices

- Start simple: Test your wrapper serially first.
- Validate boundary names: Ensure the marker name in the GUI matches your mesh boundary.
- Keep expressions safe: Use provided functions (`sin`, `cos`, `sqrt`, etc.) and variables (`x`, `y`, `z`).
- Version control: Commit `config.cfg` and your dynamic wrapper for reproducibility.

---

## Troubleshooting

- `ImportError: No module named pysu2`
  - Ensure SU2 was installed with the Python wrapper enabled, or use the conda package. Re‑open a new terminal so environment changes apply.

- `Error: Configuration file config.cfg not found`
  - Run the wrapper from your case folder, or update the path in the script.

- `MarkerName not found` / temperature not applied
  - Double‑check the selected wall boundary name matches the mesh marker.

- MPI issues
  - Verify `mpirun` (or `mpiexec`) is available. Confirm `mpi4py` is installed in the same Python environment.

---

## Where to find the files

Your exports live in:

```
<repo>/user/<case_name>/
  ├─ config.json
  ├─ config.cfg
  └─ run_su2_dynamic.py
```
