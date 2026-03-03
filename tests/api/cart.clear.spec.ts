import { test, expect } from "@playwright/test";

test.describe.configure({mode: "serial"});

async function sleep(ms:number) {
    return new Promise((r) => setTimeout(r,ms));
}

