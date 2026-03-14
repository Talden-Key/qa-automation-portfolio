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

    // 4) Assert first variant has basic availability-related fields
    const firstVariant = productJson.variants[0];

    expect(firstVariant).toHaveProperty("id");
    expect(firstVariant).toHaveProperty("title");
    expect(firstVariant).toHaveProperty("available");

    expect(typeof firstVariant.id, "Expected variant id to be a number.").toBe("number");
    expect(typeof firstVariant.title, "Expected variant title to be a string.").toBe("string");
    expect(typeof firstVariant.available, "Expected variant available to be boolean.").toBe("boolean");
  });
  test.describe("Collection products JSON API", () => {
    test("GET /collections/all/products.json returns a products[] payload", async ({ request }) => {
      const response = await request.get("/collections/all/products.json?limit=10");

      expect(
        response.status(),
        "Expected /collections/all/products.json to return HTTP 200."
      ).toBe(200);
      const body = await response.json();

      expect(body).toHaveProperty("products");
      expect(Array.isArray(body.products),
      "Expected products to be an array."
    ).toBeTruthy();

    expect(
      body.products.length,
      "Expected at least one product in the collection payload."
    ).toBeGreaterThan(0);

    // Light contract checks on the first product
    const firstProduct = body.products[0];

    expect(firstProduct).toHaveProperty("id");
    expect(firstProduct).toHaveProperty("title");
    expect(firstProduct).toHaveProperty("handle");
    expect(firstProduct).toHaveProperty("variant");

    expect(typeof firstProduct.id).toBe("number");
    expect(typeof firstProduct.title).toBe("string");
    expect(typeof firstProduct.handle).toBe("string");
    expect(Array.isArray(firstProduct.variants)).toBeTruthy();
    })
  })
});
