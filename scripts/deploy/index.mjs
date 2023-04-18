#!/usr/bin/env zx
await $`rm -rf /www/wwwroot/chatgpt-0x.1zhizu.com`
await $`mv /data/chatgpt/current/apps/web/dist /www/wwwroot/chatgpt-0x.1zhizu.com`

await $`rm -rf /www/wwwroot/admin-chatgpt-0x.1zhizu.com`
await $`mv /data/chatgpt/current/apps/admin/dist /www/wwwroot/admin-chatgpt-0x.1zhizu.com`

await $`pm2 reload chatgpt-0x-server`
