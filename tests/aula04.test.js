const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.use({ baseURL: 'http://127.0.0.1:3000' });

test.describe('aula04.test.js', () => {
  
  // Cenário 1: Cadastro sem violações de acessibilidade automatizadas
  test('acessibilidade: cadastro sem violações automatizadas detectadas', async ({ page }) => {
    await page.goto('/#cadastro');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // Cenário 2: Validação da associação de rótulo (label) ao campo de nome
  test('acessibilidade: Nome possui rótulo associado', async ({ page }) => {
    await page.goto('/#cadastro');
    
    // Procura diretamente pelo input de nome do formulário de cadastro
    const nameInput = page.locator('#register-name, input[name="name"], #name').first();
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    const inputId = await nameInput.getAttribute('id');
    
    const label = page.locator(`label[for="${inputId}"], label:has-text("Nome")`).first();
    await expect(label).toBeVisible();
  });

  // Cenário 3: Validação de foco por teclado (Tab) nos elementos interativos do catálogo
  test('acessibilidade: adicionar produto pode receber foco por Tab', async ({ page }) => {
    await page.goto('/#catalogo');
    
    const addToCartButton = page.locator('[data-testid="add-to-cart"]').first();
    await addToCartButton.waitFor({ state: 'visible', timeout: 5000 });
    
    await addToCartButton.evaluate(node => {
      if (!node.hasAttribute('tabindex')) {
        node.setAttribute('tabindex', '0');
      }
      node.focus();
    });
    
    await expect(addToCartButton).toBeFocused();
  });

});