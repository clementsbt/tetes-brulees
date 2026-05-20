import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check title
  await expect(page).toHaveTitle(/Têtes/)
  
  // Check main elements
  await expect(page.getByText('Têtes Brûlées')).toBeVisible()
})

test('navigation links work', async ({ page }) => {
  await page.goto('/')
  
  // Click on a nav link
  await page.click('text=Sorties club')
  await expect(page).toHaveURL(/sorties-club/)
})