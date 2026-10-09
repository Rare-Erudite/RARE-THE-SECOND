# RARE 045 HANDOFF

RARE 045 is the current consolidated RARE release candidate. It includes the protected self-development core, model/provider adapters, conversations/memory, documents/research, tools/device control, RARE assistant, multi-agent orchestration, authenticated peer bridge, recovery/checkpoints/rollback, validation/repair, responsive Flutter workspaces, live voice interaction, checked-in icon assets and native platform preparation/build scripts.

Current local model: `qwen2.5-coder:7b` via Ollama. No paid API key is required and the system does not silently download models.

Development/testing intentionally does not require Gmail login. Devices are paired through local RARE Core endpoints and tokens. The later account/login layer can be added without replacing the device command protocol.

Release verification must include backend regression, provider execution, capability end-to-end checks, clean-room extraction, and actual Flutter Windows/Android build/runtime checks on the target machine.

## Current corrections

RARE 045 includes the corrected Windows Flutter document-path call, complete Windows/Android platform scaffolding, deliberate Android identity and permissions, and a conservative fast-intent/response-efficiency path. Ambiguous requests still use the configured real model.
