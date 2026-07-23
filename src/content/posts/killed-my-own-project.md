---
title: "A Sufferer of Killed Projects Gets His Own Project Killed"
description: "I started building a sandbox for coding agents. Google announced its alternative the next day."
date: "2026-07-23"
tags: ["agents", "infrastructure", "sandboxing"]
---

There is a particular kind of comedy in spending a day building infrastructure
only to watch Google announce the same category of product the next morning.

On April 22, I made the first commits to
[cloud-sandbox](https://github.com/alyosha31/cloud-sandbox). On April 23, at
Google Cloud Next ’26, Google announced
[GKE Agent Sandbox](https://cloud.google.com/blog/products/containers-kubernetes/whats-new-in-gke-at-next26).

For someone already wary of projects disappearing into the graveyard, this
felt like a new achievement: getting my own project killed before it had really
lived.

## Why I built it

Agents can write code, call tools, install packages, and manipulate files.
That is useful right up until the generated program hangs forever, deletes
something important, or runs code that should never have shared a machine with
the application in the first place.

I wanted a small service that put a hard boundary between an agent and the code
it executes. The interface should be boring: send code over HTTP, run it
somewhere disposable, and get structured output back. Longer tasks should be
able to keep a session, a working directory, and an environment between calls.

The prototype grew into two paths:

- a stateless `/exec` endpoint for one-off programs;
- persistent `/sessions` with their own workspace and Python environment.

The stateless path was deliberately plain:

```bash
curl -X POST http://localhost:8080/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "print(\"hello from the sandbox\")",
    "timeout_seconds": 10
  }'
```

Commands run in subprocesses with timeouts and captured output. I also added
connectors for Google Cloud Storage, BigQuery, and Firestore, plus Kubernetes
manifests intended to run the service under gVisor.

> [!NOTE]
> The repository is a prototype and a way to understand the boundary. It is not
> presented as a production-grade multi-tenant security system.

It is still a prototype, not a production security boundary. The current
service can host multiple sessions inside one container; a stronger deployment
would give each session its own sandboxed pod and enforce limits outside the
process. That gap was part of what I wanted to understand by building it.

## Then Google shipped the category

Google’s announcement described almost exactly the production-shaped version
of the problem: isolated environments for agents to execute untrusted code and
tools, built on GKE and gVisor, with fast startup and enough scale to create
hundreds of sandboxes per second.

My first reaction was predictable: well, there goes the project.

But a managed product does not make the underlying problem uninteresting. It
changes where the interesting work begins. Once provisioning, isolation, and
lifecycle management are available as infrastructure, the questions move
upward: what state should survive, which tools should an agent receive, how do
we observe failures, and how do we evaluate whether the agent did the right
thing rather than merely finishing?

## So, was it killed?

Not really.

Google announcing an agent sandbox one day after my first commit was less a
funeral than unusually fast validation. I had picked a real problem. I had also
underestimated how much separates a useful local prototype from a production
control plane: scheduling, tenancy, pooling, quotas, observability, policy, and
the endless unglamorous work around failure.

That is precisely why building the smaller version was worthwhile. Managed
infrastructure can save me from operating every layer, but it cannot replace
understanding the layer. The next project will be better because I now know
where the easy demo ends and the systems problem starts.

If anything, Google did not kill my project. It gave me a roadmap—and impeccable
comic timing.
