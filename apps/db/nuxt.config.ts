import { existsSync } from 'node:fs';
import { proxyConfig } from './server/config/proxy';

const LOCAL_LAYER = '/media/beingmomen/Code/personal/Temp/my-base-layer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const layerExtends: any = existsSync(LOCAL_LAYER)
  ? [LOCAL_LAYER]
  : [['github:beingmomen/base-layer', { auth: process.env.GIGET_AUTH, install: true }]];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  extends: layerExtends,

  imports: {
    dirs: ['composables/**']
  },

  runtimeConfig: {
    proxyConfig
  },

  devServer: {
    port: Number(process.env.NUXT_DEV_SERVER_PORT) || 9122
  },

  compatibilityDate: '2025-01-01'

});
