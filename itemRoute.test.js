const request = require("supertest");

const app = require("./app");
let db = require("./fakeDb");

const testItem = { name: "testItem", price: 100 };

beforeEach(function () {
  db.items.push(testItem);
});

afterEach(function () {
  db.items = [];
});

/** GET /items - returns {items: {...}} */
describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get(`/items`);
    expect(resp.body).toEqual({ items: [{ name: "testItem", price: 100 }] });
  });
});

/** POST /items - create an item from data; return {added: {...}} */
describe("POST /items", function () {
  it("Creates a new item", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "blanket",
        price: 4.00,
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      added: {
        name: "blanket",
        price: 4.00,
      }
    });
  });
});

/** GET /items/[name] - return data about one item: {name:, price:} */
describe("GET /items/:name", function () {
  it("Gets a single item", async function () {
    const resp = await request(app).get(`/items/${testItem.name}`);

    expect(resp.body).toEqual({ name: "testItem", price: 100 });
  });

  it("Not Found.", async function() {
    const resp = await request(app).get(`/items/not-here`);
    expect(resp.statusCode).toEqual(404);
  });
});


/** PATCH /items/[name] - update an item; return {updated: {...}} */
describe("PATCH /items/:name", function () {
  it("Updates a single item", async function () {
    const resp = await request(app)
      .patch(`/items/${testItem.name}`)
      .send({
        name: "testItemUpdated",
        price: 500,
      });
    expect(resp.body).toEqual({
      updated: { name: "testItemUpdated", price: 500 }
    });
  });

  it("Not found.", async function() {
    const resp = await request(app).patch(`/items/not-here`);
    expect(resp.statusCode).toEqual(404);
  });
});

/** DELETE /items/[name] - deletes an item, returns: {message: "Deleted"}*/
describe("DELETE /items/:name", function () {
  it("Deletes a single item", async function () {
    const resp = await request(app)
      .delete(`/items/${testItem.name}`);
    expect(resp.body).toEqual({ message: "Deleted" });
    expect(db.items.length).toEqual(0);
  });
});