const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div>
    <h1>Renewable Energy Tracker</h1>

    <input
      id="source"
      type="text"
      placeholder="Energy source"
    />

    <input
      id="energy"
      type="number"
      placeholder="Energy generated (kWh)"
    />

    <button id="save">Save</button>

    <p id="message"></p>

    <h2>Saved Energy Data</h2>
    <div id="energyList"></div>
  </div>
`;

async function loadData() {
  try {
    const response = await fetch("http://localhost:5000/api/energy");
    const data = await response.json();

    const energyList =
      document.querySelector<HTMLDivElement>("#energyList")!;

    energyList.innerHTML = "";

    data.forEach((item: any) => {
      const div = document.createElement("div");

      div.textContent = `${item.source} - ${item.generated} kWh`;

      energyList.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

document
  .querySelector<HTMLButtonElement>("#save")!
  .addEventListener("click", async () => {
    const source =
      document.querySelector<HTMLInputElement>("#source")!.value;

    const generated = Number(
      document.querySelector<HTMLInputElement>("#energy")!.value
    );

    const message =
      document.querySelector<HTMLParagraphElement>("#message")!;

    try {
      const response = await fetch(
        "http://localhost:5000/api/energy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source,
            generated,
          }),
        }
      );

      const result = await response.json();

      message.textContent = result.message;

      document.querySelector<HTMLInputElement>("#source")!.value = "";
      document.querySelector<HTMLInputElement>("#energy")!.value = "";

      loadData();
    } catch (error) {
      console.error(error);
      message.textContent = "Failed to save energy data";
    }
  });

loadData();