import path from 'node:path'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

function vercelApiDevPlugin(): Plugin {
  return {
    name: 'vercel-api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next()
        }

        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
        const pathname = parsedUrl.pathname

        let routeModule = ''
        let pathId = ''

        if (pathname === '/api/products') {
          routeModule = './api/products.ts'
        } else if (pathname.startsWith('/api/products/')) {
          routeModule = './api/products.ts'
          pathId = decodeURIComponent(pathname.replace('/api/products/', ''))
        } else if (pathname === '/api/orders') {
          routeModule = './api/orders.ts'
        } else if (pathname.startsWith('/api/orders/')) {
          routeModule = './api/orders.ts'
          pathId = decodeURIComponent(pathname.replace('/api/orders/', ''))
        } else if (pathname === '/api/health') {
          routeModule = './api/health.ts'
        } else if (pathname === '/api/reset') {
          routeModule = './api/reset.ts'
        }

        if (!routeModule) {
          return next()
        }

        try {
          const mod = await server.ssrLoadModule(routeModule)
          const handler = mod.default

          // Collect body if POST / PUT
          let body = {}
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const chunks: Buffer[] = []
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
            }
            const rawBody = Buffer.concat(chunks).toString('utf-8')
            if (rawBody) {
              try {
                body = JSON.parse(rawBody)
              } catch {
                body = rawBody
              }
            }
          }

          // Mock VercelRequest and VercelResponse
          const queryParams: Record<string, string> = {}
          parsedUrl.searchParams.forEach((val, key) => {
            queryParams[key] = val
          })
          if (pathId) {
            queryParams.id = pathId
          }

          const vercelReq = Object.assign(req, {
            query: queryParams,
            body,
            cookies: {},
          })

          const vercelRes = Object.assign(res, {
            status(code: number) {
              res.statusCode = code
              return vercelRes
            },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return vercelRes
            },
            send(data: any) {
              res.end(data)
              return vercelRes
            },
          })

          await handler(vercelReq, vercelRes)
        } catch (err) {
          console.error('[Vite Dev API Handler Error]:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vercelApiDevPlugin(),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
