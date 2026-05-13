# Celem Command Metadata Platform RFC

## Status

Proposed.

This document defines the target architecture for evolving the Celem plugin command catalog from Markdown-seeded rows into a structured metadata platform. It is a planning document for CelemSite, CelemBackend, and plugin repositories. It does not replace current runtime behavior until the migration plan is implemented.

## Current Platform Alignment

The current ecosystem already has useful foundations that should be reused instead of replaced:

- CelemCore exposes attribute-based commands through `CommandAttribute`, `CommandAliasAttribute`, `CommandGroupAttribute`, and `CommandGroupAliasAttribute`.
- CelemCore command metadata already includes command name, group, aliases, language, `adminOnly`, required permissions, usage, description, parameters, and `[Remainder]` behavior.
- CelemCore localization already supports player/server language resolution and shared JSON translation resources.
- CelemBackend already exposes a public Supabase Edge Function named `command-catalog`.
- CelemBackend already has read-heavy Edge Function cache and IP rate-limit helpers that can be reused for command metadata APIs.
- CelemSite already has an Angular command catalog feature that can evolve from a flat DTO to a richer structured API model.

The target architecture should therefore migrate the source of truth and storage model without discarding the existing command implementation model.

## 1. Ecosystem Overview

The Celem ecosystem should separate human documentation from machine-readable metadata.

Markdown remains the human documentation layer. It is still the right format for explanations, command risk notes, screenshots, examples, troubleshooting, and developer context. It should not remain the machine source of truth because Markdown is presentation-oriented, hard to validate consistently, weak for automation, and fragile for synchronization.

Structured JSON becomes the official machine-readable source of truth. Every plugin that exposes commands should publish a `commands.json` file validated by `commands.schema.json`. Supabase should store both the raw manifest for auditability and normalized rows for API, search, filtering, analytics, autocomplete, and future AI retrieval.

The architecture has these layers:

- Human documentation: `README.md`, `docs/user/*.md`, `docs/developer/*.md`.
- Structured source of truth: `commands.json`.
- Contract validation: `commands.schema.json`.
- Synchronization: GitHub Actions and a protected Supabase sync endpoint.
- Central platform: Supabase Postgres, Edge Functions, cache tables, search indexes, and future vector indexes.
- Frontend consumption: CelemSite Angular command catalog and future launcher or in-game clients.

The target state is a metadata platform, not a Markdown parser.

## 2. Repository Structure

Recommended plugin repository structure:

```text
PluginRepository/
|-- README.md
|-- CHANGELOG.md
|-- commands.json
|-- commands.schema.json
|-- docs/
|   |-- user/
|   |   `-- commands.md
|   `-- developer/
|       `-- command-model.md
`-- src/
```

Responsibilities:

- `README.md`: human overview, installation notes, high-level command links, and support information.
- `CHANGELOG.md`: versioned human-readable change history.
- `commands.json`: canonical structured command metadata for machines.
- `commands.schema.json`: local validation schema or wrapper that references the ecosystem schema URL.
- `docs/user/commands.md`: user-facing explanations, risk notes, and longer examples.
- `docs/developer/command-model.md`: CelemCore command mapping, implementation notes, and permission rationale.
- `src/`: C# implementation using CelemCore command attributes and services.

Each plugin owns its own manifest. CelemBackend owns central ingestion and normalization. CelemSite consumes the public API.

## 3. Structured Command Metadata Specification

Stable command IDs are mandatory. Command text, aliases, descriptions, translations, examples, categories, and permission display text can change. Telemetry, embeddings, relationships, documentation links, autocomplete history, and API consumers need a permanent identifier that survives those changes.

Recommended command ID format:

```text
<plugin-slug>.<domain>.<action>
```

Examples:

```text
celem-bank.account.balance
celem-store.shop.claim
celem-zones.zone.create
```

The final metadata model must include:

- `schema_version`: manifest contract version.
- `plugin.id`: stable plugin slug.
- `plugin.name`: display name.
- `plugin.version`: plugin version at sync time.
- `commands[].id`: stable command ID.
- `commands[].status`: `active`, `deprecated`, `removed`, or `hidden`.
- `commands[].category`: enum-backed category.
- `commands[].command`: canonical visible command text.
- `commands[].aliases`: alternate command inputs.
- `commands[].tags`: normalized search and discovery tags.
- `commands[].permissions`: structured permission model.
- `commands[].parameters`: structured parameter metadata.
- `commands[].usage`: canonical usage text.
- `commands[].examples`: structured examples.
- `commands[].translations`: translated descriptions, usage, and examples.
- `commands[].relationships`: related commands, replacements, requirements, conflicts, and see-also links.
- `commands[].source`: source and documentation paths.
- `commands[].ai`: future AI and semantic search metadata.

Example `commands.json`:

```json
{
  "schema_version": "1.0.0",
  "plugin": {
    "id": "celem-bank",
    "name": "CelemBank",
    "version": "1.5.0",
    "repository": "https://github.com/example/CelemBank"
  },
  "commands": [
    {
      "id": "celem-bank.account.balance",
      "status": "active",
      "category": "player",
      "command": ".bank balance",
      "aliases": [".bank ba"],
      "tags": ["economy", "balance", "account"],
      "permissions": {
        "visibility": "public",
        "admin_only": false,
        "required_permissions": ["basic"],
        "conditional": [
          {
            "when": "target_player_argument_present",
            "requires_admin": true
          }
        ]
      },
      "parameters": [
        {
          "name": "player",
          "type": "PlayerData",
          "required": false,
          "remainder": true,
          "description": "Optional target player. Requires admin."
        }
      ],
      "usage": ".bank balance [player...]",
      "examples": [
        {
          "input": ".bank balance",
          "description": "Show your own balance."
        },
        {
          "input": ".bank balance Luan",
          "description": "Admin-only target lookup."
        }
      ],
      "translations": {
        "en": {
          "description": "Shows the current balance for the sender or, for admins, another player.",
          "usage": ".bank balance [player...]"
        },
        "pt-BR": {
          "description": "Mostra o saldo atual do jogador ou, para administradores, de outro jogador.",
          "usage": ".banco saldo [player...]"
        }
      },
      "relationships": [
        {
          "type": "related",
          "command_id": "celem-bank.account.deposit"
        },
        {
          "type": "requires_plugin",
          "plugin_id": "celem-core"
        }
      ],
      "source": {
        "path": "Commanding/BankCommands.cs",
        "docs": "docs/user/commands.md"
      },
      "ai": {
        "summary": "Use this command to inspect bank currency balances.",
        "intent_phrases": ["check balance", "view money", "bank account"],
        "risk_level": "low"
      }
    }
  ]
}
```

## 4. JSON Schema Design

JSON plus JSON Schema should be the long-term standard. YAML can remain a migration input, but JSON should be the canonical file format.

JSON Schema is preferable because it supports deterministic validation, IDE autocomplete, schema-aware editors, generated TypeScript/C# types, strict CI checks, stable machine contracts, and ecosystem-wide compatibility rules. It is also easier for GitHub Actions, Supabase sync tooling, API generators, and AI indexing pipelines to consume without ambiguity.

Use JSON Schema draft 2020-12 with:

- `$schema` and `$id` for explicit identity.
- `$defs` for reusable contract fragments.
- `required` for mandatory fields.
- `enum` for stable categories, statuses, relationships, and permission visibility.
- `pattern` for stable IDs and slugs.
- `additionalProperties: false` for stable core objects.
- Explicit extension fields such as `ai` or `x_*` for experimental metadata.

Example `commands.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://celem.dev/schemas/commands.schema.json",
  "title": "Celem Commands Metadata",
  "type": "object",
  "required": ["schema_version", "plugin", "commands"],
  "additionalProperties": false,
  "properties": {
    "schema_version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "plugin": {
      "$ref": "#/$defs/plugin"
    },
    "commands": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/command"
      }
    }
  },
  "$defs": {
    "plugin": {
      "type": "object",
      "required": ["id", "name", "version"],
      "additionalProperties": false,
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "version": {
          "type": "string",
          "minLength": 1
        },
        "repository": {
          "type": "string",
          "format": "uri"
        }
      }
    },
    "command": {
      "type": "object",
      "required": ["id", "status", "category", "command", "permissions", "parameters", "usage", "examples", "translations"],
      "additionalProperties": false,
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-z0-9-]+\\.[a-z0-9-]+\\.[a-z0-9-]+$"
        },
        "status": {
          "enum": ["active", "deprecated", "removed", "hidden"]
        },
        "category": {
          "enum": ["player", "admin", "economy", "logistics", "store", "zone", "progression", "utility", "diagnostic"]
        },
        "command": {
          "type": "string",
          "pattern": "^\\.[^\\n\\r]+$"
        },
        "aliases": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": []
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[a-z0-9-]+$"
          },
          "default": []
        },
        "permissions": {
          "$ref": "#/$defs/permissions"
        },
        "parameters": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/parameter"
          }
        },
        "usage": {
          "type": "string"
        },
        "examples": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/example"
          }
        },
        "translations": {
          "$ref": "#/$defs/translations"
        },
        "relationships": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/relationship"
          },
          "default": []
        },
        "source": {
          "type": "object"
        },
        "ai": {
          "type": "object"
        }
      }
    },
    "permissions": {
      "type": "object",
      "required": ["visibility", "admin_only", "required_permissions"],
      "additionalProperties": false,
      "properties": {
        "visibility": {
          "enum": ["public", "admin", "hidden"]
        },
        "admin_only": {
          "type": "boolean"
        },
        "required_permissions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "conditional": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "default": []
        }
      }
    },
    "parameter": {
      "type": "object",
      "required": ["name", "type", "required"],
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string"
        },
        "type": {
          "enum": ["string", "int", "float", "double", "bool", "PlayerData", "PrefabGUID", "enum", "float2", "float3", "float4"]
        },
        "required": {
          "type": "boolean"
        },
        "remainder": {
          "type": "boolean",
          "default": false
        },
        "description": {
          "type": "string"
        },
        "allowed_values": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "example": {
      "type": "object",
      "required": ["input"],
      "additionalProperties": false,
      "properties": {
        "input": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      }
    },
    "translations": {
      "type": "object",
      "propertyNames": {
        "enum": ["en", "pt-BR", "fr", "de", "ru", "es", "zh-CN", "zh-TW", "ja", "ko"]
      },
      "additionalProperties": {
        "type": "object",
        "required": ["description"],
        "additionalProperties": false,
        "properties": {
          "description": {
            "type": "string"
          },
          "usage": {
            "type": "string"
          },
          "examples": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/example"
            }
          }
        }
      }
    },
    "relationship": {
      "type": "object",
      "required": ["type"],
      "additionalProperties": false,
      "properties": {
        "type": {
          "enum": ["related", "requires_plugin", "replaces", "replaced_by", "conflicts_with", "see_also"]
        },
        "command_id": {
          "type": "string"
        },
        "plugin_id": {
          "type": "string"
        }
      }
    }
  }
}
```

Schema evolution strategy:

- `1.x`: additive fields only.
- `2.x`: breaking changes allowed with explicit migration tooling.
- Old schemas remain hosted permanently.
- CI validates each manifest against its declared `schema_version`.
- Supabase stores the original raw JSON and the normalized current projection.
- Migration scripts transform older manifests into the current normalized database model.

## 5. Translation Architecture

Command identity should not be translated. Stable command IDs are language-neutral. Canonical command text should remain stable per implementation, while localized aliases can expose language-specific input.

Descriptions, usage text, examples, AI summaries, warnings, and frontend labels can be translated.

Initial language keys:

- `en`
- `pt-BR`
- `fr`
- `de`
- `ru`
- `es`
- `zh-CN`
- `zh-TW`
- `ja`
- `ko`

CelemCore currently supports additional languages in its `Language` enum. The schema should allow controlled expansion when the ecosystem is ready to expose those locales.

Fallback order:

1. Requested locale.
2. Base language when applicable.
3. Plugin default locale.
4. Ecosystem default `en`.

The frontend should show fallback content without pretending it is fully translated.

## 6. Supabase Architecture

The current flat `command_catalog` table is useful as a bootstrap path, but it should be replaced by normalized metadata tables.

Recommended tables:

```sql
create table public.plugins (
  id text primary key,
  name text not null,
  version text not null,
  repository_url text,
  updated_at timestamptz not null default now()
);

create table public.command_manifests (
  id uuid primary key default gen_random_uuid(),
  plugin_id text not null references public.plugins(id) on delete cascade,
  schema_version text not null,
  plugin_version text not null,
  source_commit text not null,
  raw_json jsonb not null,
  synced_at timestamptz not null default now(),
  unique (plugin_id, source_commit)
);

create table public.commands (
  id text primary key,
  plugin_id text not null references public.plugins(id) on delete cascade,
  category text not null,
  command text not null,
  status text not null,
  usage text not null,
  permission_visibility text not null,
  admin_only boolean not null default false,
  required_permissions text[] not null default '{}',
  tags text[] not null default '{}',
  source_path text,
  docs_path text,
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(command,'') || ' ' || coalesce(usage,'') || ' ' || array_to_string(tags, ' '))
  ) stored,
  updated_at timestamptz not null default now()
);

create table public.command_aliases (
  id uuid primary key default gen_random_uuid(),
  command_id text not null references public.commands(id) on delete cascade,
  alias text not null,
  language text,
  unique (command_id, alias, language)
);

create table public.command_parameters (
  id uuid primary key default gen_random_uuid(),
  command_id text not null references public.commands(id) on delete cascade,
  name text not null,
  type text not null,
  required boolean not null,
  remainder boolean not null default false,
  position integer not null,
  description text,
  unique (command_id, position)
);

create table public.command_translations (
  command_id text not null references public.commands(id) on delete cascade,
  language text not null,
  description text not null,
  usage text,
  examples jsonb not null default '[]'::jsonb,
  ai_summary text,
  primary key (command_id, language)
);

create table public.command_relationships (
  id uuid primary key default gen_random_uuid(),
  source_command_id text not null references public.commands(id) on delete cascade,
  relationship_type text not null,
  target_command_id text references public.commands(id),
  target_plugin_id text references public.plugins(id),
  unique (source_command_id, relationship_type, target_command_id, target_plugin_id)
);

create index ix_commands_plugin_category on public.commands (plugin_id, category);
create index ix_commands_status_category on public.commands (status, category);
create index ix_commands_tags on public.commands using gin (tags);
create index ix_commands_search_vector on public.commands using gin (search_vector);
create index ix_command_translations_language on public.command_translations (language);
```

Security recommendations:

- Prefer Edge Functions for public read APIs.
- Keep sync writes behind a protected endpoint using server-side secrets.
- Enable RLS for exposed tables.
- Add explicit grants when using the Data API.
- Avoid exposing raw sync tables directly to anonymous clients.

Supabase has announced that new tables in the public schema will require explicit grants for Data API exposure as that platform default rolls out. Migrations for this architecture should therefore include both RLS and intentional grants.

## 7. Semantic Search and AI Preparation

The metadata model should prepare for semantic search without requiring embeddings on day one.

Sync-time enrichment should build:

- normalized command text
- aliases
- tags
- categories
- permission profile
- parameter names and types
- examples
- translated descriptions
- relationship graph
- AI summary
- risk level
- source path and docs path

Search tiers:

1. Exact command and alias lookup.
2. Prefix autocomplete.
3. Filtered full-text search with Postgres `tsvector`.
4. Tag and relationship expansion.
5. Vector similarity with `pgvector`.
6. AI assistant responses backed by retrieved command IDs.

Future embedding table:

```sql
create extension if not exists vector;

create table public.command_embeddings (
  command_id text primary key references public.commands(id) on delete cascade,
  embedding_model text not null,
  content_hash text not null,
  embedding vector(1536) not null,
  updated_at timestamptz not null default now()
);
```

Embeddings should be generated from stable, normalized text built from command, aliases, category, tags, examples, parameter names, descriptions, and AI summary.

## 8. API Architecture

Public endpoints should be versioned and cacheable.

Recommended endpoint strategy:

```text
GET /functions/v1/commands
GET /functions/v1/commands/{id}
GET /functions/v1/plugins/{pluginId}/commands
GET /functions/v1/commands/search?q=balance&language=pt-BR
GET /functions/v1/commands/semantic?q=how do I check my money
GET /functions/v1/commands/autocomplete?prefix=.bank
GET /functions/v1/commands/{id}/related
```

Recommended filters:

- `plugin`
- `category`
- `language`
- `status`
- `permission`
- `tag`
- `q`
- `page`
- `pageSize`
- `sort`

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "celem-bank.account.balance",
        "pluginId": "celem-bank",
        "command": ".bank balance",
        "aliases": [".bank ba"],
        "category": "player",
        "description": "Shows the current balance.",
        "usage": ".bank balance [player...]",
        "tags": ["economy", "balance"],
        "permissions": {
          "visibility": "public",
          "adminOnly": false,
          "requiredPermissions": ["basic"]
        }
      }
    ],
    "page": 1,
    "pageSize": 25,
    "total": 1
  },
  "errors": []
}
```

API versioning:

- Function namespace version: `/v1`.
- Manifest contract version: `schema_version`.
- Response contract version: optional `apiVersion` in the envelope.

## 9. GitHub Actions Synchronization

Recommended flow:

```text
GitHub Push
  |
  v
Checkout
  |
  v
Validate commands.schema.json
  |
  v
Validate commands.json
  |
  v
Run compatibility checks
  |
  v
Transform manifest
  |
  v
Sync Supabase
  |
  v
Refresh cache or mark stale
```

Example workflow:

```yaml
name: Sync Command Metadata

on:
  push:
    branches: [main]
    paths:
      - commands.json
      - commands.schema.json
      - .github/workflows/sync-commands.yml

jobs:
  validate-and-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm install -g ajv-cli

      - name: Validate schema
        run: ajv compile -s commands.schema.json --spec=draft2020

      - name: Validate commands
        run: ajv validate -s commands.schema.json -d commands.json --spec=draft2020 --strict=true

      - name: Sync Supabase
        env:
          CELEM_SYNC_ENDPOINT: ${{ secrets.CELEM_SYNC_ENDPOINT }}
          CELEM_SYNC_TOKEN: ${{ secrets.CELEM_SYNC_TOKEN }}
          GITHUB_SHA: ${{ github.sha }}
        run: |
          curl -fsS -X POST "$CELEM_SYNC_ENDPOINT" \
            -H "Authorization: Bearer $CELEM_SYNC_TOKEN" \
            -H "Content-Type: application/json" \
            -H "X-Celem-Source-Commit: $GITHUB_SHA" \
            -d @commands.json
```

The sync endpoint should be idempotent by `(plugin_id, source_commit)` and should upsert current command rows by stable command ID.

## 10. Frontend Architecture

CelemSite should evolve from the flat `CommandCatalogItem` shape toward a typed API model generated from the metadata API contract.

Recommended Angular flow:

```text
Angular route
  |
  v
CommandCatalogService
  |
  v
Query/cache layer
  |
  v
Supabase Edge Function API
  |
  v
Normalized Supabase tables
```

Frontend recommendations:

- Keep the current local fallback during migration.
- Add API filters for plugin, category, permission, language, tag, and status.
- Add command ID based routes for deep links.
- Add autocomplete endpoint consumption.
- Add related-command display.
- Show fallback locale state when translated content is unavailable.
- Use cache headers and Cloudflare or edge cache for public read-heavy responses.
- Consider TanStack Query if the site adds more API-backed resources; otherwise Angular services and signals are enough for the current single-feature shape.

UX recommendations:

- Search across command, alias, tag, description, usage, and examples.
- Filter by plugin, category, permission, language, and status.
- Show admin and destructive-risk badges.
- Preserve stable command ID in links.
- Provide copy buttons for command examples.
- Avoid exposing hidden commands unless an authenticated admin API is introduced later.

## 11. Future Ecosystem Vision

This architecture enables:

- plugin marketplace metadata
- launcher command discovery
- in-game autocomplete
- in-game command assistant
- AI command helper
- semantic search
- related-command recommendations
- command telemetry and analytics
- plugin dependency graphs
- public ecosystem APIs
- generated documentation
- safer admin command surfacing

The core advantage is that every consumer speaks to the same stable metadata model instead of scraping human documentation.

## Migration Strategy

1. Keep the current Markdown-seeded catalog as the legacy baseline.
2. Add `commands.json` and `commands.schema.json` to one pilot plugin.
3. Validate manifests in CI without changing runtime behavior.
4. Add a protected Supabase sync endpoint that stores raw manifest JSON.
5. Normalize manifest rows into the new command tables.
6. Update CelemSite to consume the new API while keeping the current fallback.
7. Migrate remaining plugins.
8. Deprecate `commands.yml` and Markdown parsing.
9. Remove Markdown parsing after all active plugins publish valid JSON.

## Best Practices

- Never use command text as identity.
- Keep command IDs stable forever.
- Treat aliases as mutable.
- Treat translations as metadata, not identity.
- Keep core schema objects strict.
- Use extension fields for experimental AI metadata.
- Store raw manifest JSON for audit and future reprocessing.
- Normalize data for filtering, indexing, relationships, and analytics.
- Use Postgres full-text search before adding vector search.
- Use vector search for intent matching, not exact command dispatch.
- Keep public APIs read-only and cacheable.
- Keep sync writes protected by server-side secrets.

## Technical Tradeoffs

JSON over YAML: less comfortable for hand editing, but stronger for validation, generated types, CI, IDE autocomplete, Supabase sync, and AI indexing.

Normalized tables over one JSONB table: more schema work, but better filtering, constraints, joins, search indexes, relationship queries, and analytics.

Edge Functions over direct Data API: more code, but better caching, rate limits, response shaping, security boundaries, and versioning.

Stable IDs over command strings: more upfront discipline, but required for telemetry, relationships, embeddings, AI retrieval, and long-term API compatibility.

## Implementation Notes for This Repository

The current CelemSite command catalog still consumes `https://oaivdxyvlqyrrickkldl.supabase.co/functions/v1/command-catalog` and falls back to local seeded rows. This RFC documents the target platform architecture; implementation should happen in separate task branches for backend schema, sync automation, plugin manifests, and Angular API model changes.

## Sources Verified

- Supabase Edge Functions documentation: `https://supabase.com/docs/guides/functions`
- Supabase API security and RLS documentation: `https://supabase.com/docs/guides/api/securing-your-api`
- Supabase full-text search documentation: `https://supabase.com/docs/guides/database/full-text-search`
- Supabase pgvector documentation: `https://supabase.com/docs/guides/database/extensions/pgvector`
- Supabase changelog note on explicit Data API grants: `https://supabase.com/changelog?tags=security`
- JSON Schema draft 2020-12: `https://json-schema.org/draft/2020-12`
