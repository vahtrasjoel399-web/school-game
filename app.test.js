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

test("every station has Russian and Estonian content", () => {
  for (const station of Object.values(stations)) {
    for (const field of ["name", "description", "time", "equipment"]) {
      assert.equal(typeof station[field].ru, "string");
      assert.equal(typeof station[field].et, "string");
      assert.ok(station[field].ru.length > 0);
      assert.ok(station[field].et.length > 0);
    }
    assert.ok(station.details.ru.length > 0);
    assert.ok(station.details.et.length > 0);
    assert.ok(["status", "counter", "measurement", "duration"].includes(station.result.type));
  }
});

test("stations use the scoring type required by their task", () => {
  assert.equal(stations[2].result.type, "counter");
  assert.deepEqual(stations[2].result.steps, [1, 3]);
  assert.equal(stations[3].result.type, "counter");
  assert.equal(stations[4].result.type, "measurement");
  assert.equal(stations[5].result.type, "duration");
  assert.equal(stations[6].result.type, "duration");
});

test("station media uses photos instead of videos", () => {
  for (const station of Object.values(stations)) assert.equal("video" in station, false);
  assert.equal(stations[7].photo, "/assets/station-7.png");
});
