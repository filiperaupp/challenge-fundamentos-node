import fs from "fs";
import { parse } from "csv-parse";

const csvPath = new URL("./tasks.csv", import.meta.url);

function saveTask(data) {
  const [title, description] = data;

  fetch("http://localhost:3333/tasks", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  }).then((res) => {
    res.text().then((data) => {
      console.log(title, description);
    });
  });
}

function readCSV() {
  fs.createReadStream(csvPath)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (row) => {
      saveTask(row);
    });
}

async function slowRead() {
  const parsedRows = fs.createReadStream(csvPath)
    .pipe(parse({ delimiter: ",", from_line: 2 }));

    for await (const row of parsedRows) {
      saveTask(row)
      await delay(500)
    }

}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

readCSV();
// slowRead()
