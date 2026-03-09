import { test, expect } from "@playwright/test";

test.describe("Shopify Product JSON API", () => {
  test("GET /products/<handle>.js returns product data and variants", async ({
    request,
  }) => {
    const productsRes = await request.get(
      "/collections/all/products.json?limit=10"
    );
    expect(
      productsRes.status(),
      "Expected collection products JSON to return 200."
    ).toBe(200);

    const productsJson = await productsRes.json();
    expect(
      Array.isArray(productsJson.products),
      "Expected products array."
    ).toBeTruthy();
    expect(
      productsJson.products.length,
      "Expected at least one product."
    ).toBeGreaterThan(0);

    const product = productsJson.products[0];
    const handle: string = product.handle;

    expect(typeof handle, "Expected products handle to be a string.").toBe(
      "string"
    );
    expect(handle.length, "Expected non-empty product handle.").toBeGreaterThan(
      0
    );

    // 2) Fetch the product JSON by handle
    const productRes = await request.get(`/products/${handle}.js`);
    expect(
      productRes.status(),
      `Expected /products/${handle}.js to return 200.`
    ).toBe(200);
    const productJson = await productRes.json();

    // 3) Assert core keys exist
    expect(productJson).toHaveProperty("id");
    expect(productJson).toHaveProperty("title");
    expect(productJson).toHaveProperty("handle");
    expect(productJson).toHaveProperty("variants");

    expect(typeof productJson.id, "Expected product id to exist.").toBe("number");
    expect(typeof productJson.title, "Expected product title to be a string.").toBe("string");
    expect(productJson.handle, "Expected returned handle to match requested handle.").toBe(handle);
    expect(Array.isArray(productJson.variants), "Expected variants to be an array.").toBeTruthy();
    expect(productJson.variants.length, "Expected at least one variant.").toBeGreaterThan(0);
  });
});
