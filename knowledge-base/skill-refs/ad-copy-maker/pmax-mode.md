# PMax text mode

`/ad-copy-maker pmax` turns the advisory text gaps from `/pmax-optimizer assets` into reviewed
Performance Max text assets. It owns text only. Images, video, listing groups, audience signals and
asset automation settings stay outside this skill.

## Input

The newest `created/pmax-ops/creative-brief-YYYY-MM-DD.md` is the handoff. Parse it before composing:

```bash
node .claude/skills/ad-copy-maker/scripts/pmax.js \
  --brief=created/pmax-ops/creative-brief-YYYY-MM-DD.md \
  --out=context/analysis/ad-copy/runs/<date>-<n>/evidence/pmax-brief.json
```

The output is either `state: ready` with one requirement per asset group that has a text gap, or
`state: skip` with a reason and `command: /pmax-optimizer assets`. A missing brief, or a brief that
contains only image or video gaps, is a clean SKIP. It is never an empty composition and never an
error disguised as a result.

The brief identifies campaigns, asset-group names, theme anchors and missing types. Resolve each
asset-group ID from the fresh PMax inventory before delivery. Do not guess an ID from a name.

## Composition

Use the shared angle, temperature, evidence and quality references in `composition.md`,
`headline-catalog.md`, `description-catalog.md` and `quality-checklists.md`. PMax has no relevance
anchor, pin or search combination. Select an offer angle per asset group and compose only the text
the brief requests. Every concrete claim carries its named evidence marker.

The finished `composition.json` uses this shape:

```jsonc
{
  "run": {
    "id": "YYYY-MM-DD-N",
    "date": "YYYY-MM-DD",
    "mode": "pmax",
    "deliveryMode": "api | paste",
    "path": "context/analysis/ad-copy/runs/YYYY-MM-DD-N/"
  },
  "brief": {
    "source": "created/pmax-ops/creative-brief-YYYY-MM-DD.md",
    "date": "YYYY-MM-DD"
  },
  "assetGroups": [{
    "campaignId": "<id>",
    "campaignName": "<name>",
    "assetGroupId": "<id>",
    "assetGroupName": "<name>",
    "theme": "<brief theme>",
    "existingCounts": { "HEADLINE": 3, "LONG_HEADLINE": 1, "DESCRIPTION": 2 },
    "assets": [{
      "fieldType": "HEADLINE | LONG_HEADLINE | DESCRIPTION",
      "text": "<reviewed text>",
      "action": "add | replace",
      "replaceLink": "customers/<customer>/assetGroupAssets/<group>~<asset>~<field type>",
      "angle": "<angle>",
      "subAngle": "<sub-angle>",
      "evidence": "<named marker>"
    }]
  }]
}
```

`replaceLink` is required only for `replace`. `existingCounts` is the fresh count before this run;
the validator combines it with every add and refuses a final set outside the required bounds.

## Text rules

Google's official [Performance Max asset requirements](https://developers.google.com/google-ads/api/performance-max/asset-requirements)
are the source for every number in this table:

| Field type | Character rule | Minimum per asset group | Maximum per asset group |
|---|---:|---:|---:|
| `HEADLINE` | 30 | 3 | 15 |
| `LONG_HEADLINE` | 90 | 1 | 5 |
| `DESCRIPTION` | 90; at least one in the final set must be 60 or fewer | 2 | 5 |

The character rule uses the same NFC + `Intl.Segmenter` grapheme counter as search composition.
The brief supplies existing counts, not the text of retained live descriptions. When at least one
existing description stays linked, the validator treats the accepted live set as satisfying the
60-character rule. When no existing description stays linked, the run supplies the complete final
set and the validator requires at least one proposed description of 60 characters or fewer. This
keeps a missing-text brief usable without guessing the live copy, while a newly supplied or fully
replaced set cannot omit the required short description.
Validate before generating the artifact or serializing API operations:

```bash
node .claude/skills/ad-copy-maker/scripts/pmax.js --composition=<run>/composition.json
```

Any missing count, missing ID, unsupported field type, duplicate text, missing angle/evidence tag,
over-limit asset, missing required short description in a fully supplied set, below-minimum final
set or above-maximum final set refuses the run with the asset group and field type named.

## Review

Generate the normal review shell:

```bash
node .claude/skills/ad-copy-maker/scripts/review-html.js --composition=<run>/composition.json
```

The detail pane is a paste sheet per asset group. It shows field type, text, angle and evidence,
the shared grapheme-based character meter, and a copy button. It states the API-or-paste choice.
Search result previews do not appear in PMax mode because PMax serves across several surfaces.

## Delivery

PMax offers exactly two mechanisms:

```bash
# local review artifact and paste record; never opens the account
node .claude/skills/ad-copy-maker/scripts/deliver.js \
  --composition=<run>/composition.json --mode=paste

# Contamination Freeze, then server-side validation
node .claude/skills/ad-copy-maker/scripts/deliver.js \
  --composition=<run>/composition.json --mode=api
```

`csv-create` and `csv-overwrite` are refused because Google Ads Editor has no asset-group text CSV.

Google Ads API text assets are immutable. The API serializer therefore writes an add as
`Asset create → AssetGroupAsset create`, and a replacement as
`Asset create → AssetGroupAsset create → old AssetGroupAsset remove`. The new asset receives a
unique temporary negative resource ID and is defined before the link refers to it. The whole list
goes through `GoogleAdsService.Mutate` as one atomic, dependent-ordered request. Sources:
[Google Ads API v24 AssetGroupAssetOperation](https://developers.google.com/google-ads/api/reference/rpc/v24/AssetGroupAssetOperation)
and [mutate best practices](https://developers.google.com/google-ads/api/docs/mutating/best-practices).

The minimum-count guard runs before the account opens. A replacement link must address the same
customer, asset group and field type as the new link. The API path uses the same review approval,
Contamination Freeze and `validate_only: true` gates as search. Paste mode opens no account and
writes no cluster map; PMax asset groups are not search testing clusters.
