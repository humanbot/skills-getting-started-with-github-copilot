// @jest-environment jsdom

import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        "Chess Club": {
          description: "Learn strategies and compete in chess tournaments",
          schedule: "Fridays, 3:30 PM - 5:00 PM",
          max_participants: 12,
          participants: ["michael@mergington.edu"]
        }
      })
    })
  );
  document.body.innerHTML = `
    <div id="activities-list"></div>
    <select id="activity"></select>
    <form id="signup-form">
      <input id="email" />
      <button type="submit">Sign Up</button>
    </form>
    <div id="message" class="hidden"></div>
  `;
});

afterEach(() => {
  jest.clearAllMocks();
});

test("fetchActivities populates activities and participants", async () => {
  // Load the app.js script
  await import("../src/static/app.js");
  // Wait for DOM update
  await new Promise(r => setTimeout(r, 10));
  expect(document.querySelector("#activities-list").textContent).toContain("Chess Club");
  expect(document.querySelector("#activities-list").textContent).toContain("michael@mergington.edu");
});

test("signup form triggers fetch and shows message", async () => {
  // Setup fetch for signup
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        message: "Signed up test@mergington.edu for Chess Club"
      }),
      ok: true
    })
  );
  await import("../src/static/app.js");
  document.getElementById("email").value = "test@mergington.edu";
  document.getElementById("activity").innerHTML = '<option value="Chess Club">Chess Club</option>';
  fireEvent.submit(document.getElementById("signup-form"));
  await new Promise(r => setTimeout(r, 10));
  expect(document.getElementById("message").textContent).toContain("Signed up test@mergington.edu for Chess Club");
});
