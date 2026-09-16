import test from "node:test";
import assert from "node:assert/strict";
import { classes, stations, getClassById, getStationById } from "./data.js";

test("all four classes have the expected seven-station routes", () => {
  assert.deepEqual(classes["1a"].route, [1, 3, 5, 7, 2, 4, 6]);
  assert.deepEqual(classes["1b"].route, [2, 4, 6, 1, 3, 5, 7]);
  assert.deepEqual(classes["1h"].route, [3, 5, 7, 2, 4, 6, 1]);
  assert.deepEqual(classes["1el"].route, [4, 6, 1, 3, 5, 7, 2]);
  for (const classData of Object.values(classes)) {
    assert.equal(classData.route.length, 7);
    assert.equal(new Set(classData.route).size, 7);
  }
});

test("all station references resolve to editable data", () => {
  assert.equal(Object.keys(stations).length, 7);
  for (const classData of Object.values(classes)) {
    for (const id of classData.route) assert.ok(getStationById(id));
  }
  assert.equal(getClassById("1a").name, "1.a");
  assert.equal(getClassById("missing"), null);
  assert.equal(getStationById(99), null);
});
