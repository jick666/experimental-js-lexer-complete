#!/usr/bin/env node
/**
 * Provision a **Projects v2** board with the canonical “Todo / In Progress / Done”
 * single-select field. Works for **user-owned** or **repo-owned** projects.
 *
 * Env:
 *   • GITHUB_REPOSITORY  owner/repo         (always present in Actions)
 *   • TOKEN              PAT-classic with project:write scope
 *   • PROJECT_NAME       optional – defaults to "Experimental Lexer"
 */

import process from 'node:process';
import { graphql } from '@octokit/graphql';

const repoFull  = process.env.GITHUB_REPOSITORY;
const token     = process.env.TOKEN;
const boardName = process.env.PROJECT_NAME || 'Experimental Lexer';

if (!repoFull || !token) {
  console.warn('setup-project-v2: missing GITHUB_REPOSITORY or TOKEN – skipping.');
  process.exit(0);
}

const [owner, repo] = repoFull.split('/');
const gh = graphql.defaults({
  headers: { authorization: `bearer ${token}` }
});

/* ─── 1. does a board with this name already exist? ─────────────────────── */
const existing = await gh(`
  query ($owner:String!,$repo:String!,$name:String!) {
    repository(owner:$owner,name:$repo) {
      projectsV2(first:20) { nodes { id title number } }
    }
  }`, { owner, repo });

let board = existing.repository.projectsV2.nodes
              .find(p => p.title === boardName);

/* ─── 2. create one if necessary ────────────────────────────────────────── */
if (!board) {
  const res = await gh(`
    mutation ($repoId:ID!,$title:String!) {
      createProjectV2(input:{repositoryId:$repoId,title:$title}) {
        projectV2 { id title number }
      }
    }`, { repoId: (await gh(`query{repository(owner:$owner,name:$repo){id}}`, { owner, repo }))
                      .repository.id,
          title: boardName });

  board = res.createProjectV2.projectV2;
  console.log(`Created Projects v2 board “${board.title}” (URL: https://github.com/${owner}/${repo}/projects/${board.number})`);
} else {
  console.log(`Projects v2 board “${board.title}” already exists (#${board.number})`);
}

/* ─── 3. make sure Status field has Todo / In Progress / Done ───────────── */
const { node: proj } = await gh(`
  query ($id:ID!) {
    node(id:$id) { ... on ProjectV2 {
      fields(first:20){
        nodes{
          ... on ProjectV2SingleSelectField { id name options { id name } }
        }
      }
    }}
  }`, { id: board.id });

let statusField = proj.fields.nodes.find(f => f.name === 'Status');
if (!statusField) {
  const res = await gh(`
    mutation ($projectId:ID!){
      addProjectV2Field(input:{
        projectId:$projectId,
        name:"Status",
        dataType:SINGLE_SELECT
      }){ field { ... on ProjectV2SingleSelectField { id } } }
    }`, { projectId: board.id });
  statusField = res.addProjectV2Field.field;
}

const need = ['Todo','In Progress','Done'];
const have = new Set(statusField.options.map(o => o.name));
for (const label of need.filter(l => !have.has(l))) {
  await gh(`
    mutation ($fieldId:ID!,$name:String!){
      createProjectV2SingleSelectFieldOption(input:{
        fieldId:$fieldId,
        name:$name
      }){ option { id } }
    }`, { fieldId: statusField.id, name: label });
  console.log(`  ↳ added “${label}” option`);
}

console.log('Setup complete ✔');
