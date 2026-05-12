export default defineNitroPlugin(() => {
  process.on('unhandledRejection', (err: any) => {
    if (err?.code === 'EPIPE' || err?.message?.includes('EPIPE')) {
      // Client disconnected mid-response — safe to ignore
      return
    }
    console.error('[unhandledRejection]', err)
  })
})
