(global as any).getCSSRules = () =>
    (document.styleSheets[0] as any).cssRules[0].cssText;