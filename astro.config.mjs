// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { existsSync } from 'node:fs';

// Carga la configuración local; las variables del entorno del hosting tienen prioridad.
if (existsSync('.env')) process.loadEnvFile('.env');

// El dominio definitivo se define UNA sola vez, con la variable de entorno SITE_URL
// (por ejemplo https://tu-dominio.com.ar). Ver README.
const rawSite = process.env.SITE_URL?.trim().replace(/\/+$/, '');
const isGithubPages = process.env.DEPLOY_TARGET === 'github-pages';
const [repositoryOwner, repositoryName] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSite = repositoryName?.toLowerCase() === `${repositoryOwner}.github.io`.toLowerCase();
const githubPagesSite = repositoryOwner ? `https://${repositoryOwner}.github.io` : 'http://localhost:4321';
const site = rawSite || (isGithubPages ? githubPagesSite : 'http://localhost:4321');
const base = isGithubPages && repositoryName && !isUserSite ? `/${repositoryName}/` : '/';

export default defineConfig({
  site,
  base,
  output: 'static', // todo el contenido público se genera de forma estática
  ...(!isGithubPages ? { adapter: vercel() } : {}), // Adaptador para despliegues no estáticos
  trailingSlash: 'never',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
