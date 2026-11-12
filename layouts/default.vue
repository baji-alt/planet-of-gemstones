<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main id="main" class="flex-1" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
    <MobileCtaBar />
    <WhatsAppFloat />
    <CartDrawer />
  </div>
</template>
