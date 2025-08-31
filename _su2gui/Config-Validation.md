---
title: Config Validation
permalink: /su2gui/Config-Validation/
---

Validate your SU2 configuration against a JSON Schema to catch errors early and ensure consistency. SU2GUI provides both a graphical workflow and a Python API for validating `.cfg` or `.json` configurations.

This page shows how to validate, interpret errors, and fix common issues.

---

## What it does

- Parses a SU2 `.cfg` file (or `.json`) and converts to structured data
- Checks keys and value types against the schema (e.g., `JsonSchema.json`)
- Reports missing/extra keys, wrong data types, malformed markers, etc.
- Integrates with SU2GUI to update the in‑memory configuration after validation

Schema files in the repo:

- `JsonSchema.json` — default schema used by the GUI and helpers
- `su2_validation_schema.json` — an additional schema snapshot you can compare against for cross-parameter realtions.

---

## Validate from the GUI

Use the Schema/Validation tools directly inside SU2GUI.

Steps:

1. Open SU2GUI and load or configure your case.
2. Open the schema manager/validation dialog (the GUI provides an entry to validate the current configuration).
3. Click “Validate Configuration” to check your current settings against the schema.
4. Review the results list and fix flagged items.
5. Re‑validate until status shows “Valid”.

![Validation Dialog](../../su2gui_files/User_guide/validation/validation-dialog.png)

> Tip: The GUI can also export the current schema if you need to review or share it.

---

## Validate from Python (CLI/API)

You can validate programmatically using the helpers in `core/config_validator.py`.

### Validate a single config file

```python
from core.config_validator import validate_su2_config_file

result = validate_su2_config_file("path/to/config.cfg", schema_file_path="JsonSchema.json")

if result["valid"]:
    print("Config is valid!")
else:
    print("Config has errors:")
    for err in result["errors"]:
        print(" -", err)
```

Returns a dict like:

```python
{
  "valid": True | False,
  "errors": ["..."],          # flattened, readable messages
  "config_data": {...},        # parsed config (when available)
  "message": "..."            # optional extra info
}
```

### Integrate with your current workflow

`check_config_with_existing_workflow()` validates `config.cfg` in the active case directory and, when valid, updates `state.jsonData` for downstream steps (markers, export, solver, etc.).

```python
from core.config_validator import check_config_with_existing_workflow

result = check_config_with_existing_workflow("config.cfg")
print("Valid:", result["valid"])  # errors printed via logger when invalid
```

### Convert `.cfg` to JSON

If you just need the conversion:

```python
from core.config_validator import convert_cfg_to_json

data = convert_cfg_to_json("path/to/config.cfg")
print(len(data), "keys parsed")
```

---

## Understanding common errors

- Missing required key
  - The schema expects a parameter that’s not present in your config.
  - Fix: Add the key to your `.cfg` (or adjust the chosen model so the key becomes optional).

- Wrong type (e.g., string vs number)
  - Value type doesn’t match the schema.
  - Fix: Update the value in the GUI or `.cfg` to the correct type.

- Malformed marker arrays
  - Marker lists like `MARKER_INLET`, `MARKER_OUTLET`, `MARKER_ISOTHERMAL`, etc., must follow the expected shapes.
  - The tool applies “shape correction” internally (e.g., padding missing numeric slots) but correct your file for clarity.

- Unknown/extra keys
  - Keys outside the schema are flagged.
  - Fix: Remove outdated parameters or align with your SU2 version.

<!-- ![Errors List](../../su2gui_files/User_guide/validation/errors-list.png) -->

---

## Where the schema lives

- By default, the validator uses `JsonSchema.json` at the repository root.
- You can pass a custom path to `validate_su2_config_file()` if using a different schema.

---

## Tips and best practices

- Validate early: Run a quick validation after major changes.
- Keep schema in sync: If you customize, store your schema alongside the case or profile.
- Re‑export after fixes: If you fixed markers or types, re‑export the config (`.cfg`/`.json`) to keep files consistent.
- Log context: Keep the console log when sharing issues; it contains line numbers and parameter names.

---

## Troubleshooting

- “Schema file not found”
  - Ensure `JsonSchema.json` exists at the repo root or pass the correct path.

- “jsonschema module missing”
  - Install dependencies: `pip install -r requirements.txt`.

- Validation always fails for markers
  - Check formatting: markers must follow SU2 conventions (names in quotes when needed, numeric tuples with parentheses).

- GUI validation not updating
  - Make sure you’ve saved changes in the GUI and re‑validated. Restart SU2GUI if state got out of sync.
