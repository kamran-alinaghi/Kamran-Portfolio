import * as Styles from "./StyleData.js";
import * as DataFormat from "./DataFormat.js";
import { Table } from "./TableElement.js";

const tableD = new DataFormat.TableDataSet();
tableD.AddRow(["Invoice #1", "% of total budget", "% Invoiced Previously", "% on this invoice", "Cost on this invoice", "10% Holdback", "GST","Invoice"]);
tableD.AddRow(["Basement Walls", "", "", "", "", "", "", ""]);
tableD.AddRow(["Main Floor", "", "", "", "", "", "", ""]);
tableD.AddRow(["Main Walls", "", "", "", "", "", "", ""]);
tableD.AddRow(["Upper Floor", "", "", "", "", "", "", ""]);
tableD.AddRow(["Upper Walls", "", "", "", "", "", "", ""]);
tableD.AddRow(["Roof", "", "", "", "", "", "", ""]);
tableD.AddRow(["Stairs", "", "", "", "", "", "", ""]);
tableD.AddRow(["Seismic", "", "", "", "", "", "", ""]);
tableD.AddRow(["Windows", "", "", "", "", "", "", ""]);
tableD.AddRow(["Backframe", "", "", "", "", "", "", ""]);
tableD.AddRow(["Decks", "", "", "", "", "", "", ""]);
tableD.AddRow(["Drops", "", "", "", "", "", "", ""]);

const tableD2 = new DataFormat.TableDataSet();
tableD2.AddRow(["Invoice #2", "% of total budget", "% Invoiced Previously", "% on this invoice", "Cost on this invoice", "10% Holdback", "GST", "Invoice"]);
tableD2.AddRow(["Basement Walls", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Main Floor", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Main Walls", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Upper Floor", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Upper Walls", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Roof", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Stairs", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Seismic", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Windows", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Backframe", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Decks", "", "", "", "", "", "", ""]);
tableD2.AddRow(["Drops", "", "", "", "", "", "", ""]);

const elem = new Table("", tableD);

const root = document.getElementById("root");
const addButton = document.getElementById("addButton");
addButton.onclick = function () { return AddButton(); };
const el = Styles.tableStyle + elem.ToHtmlObject();
root.innerHTML = el;

function AddButton() {
    const elem2 = new Table("", tableD2);
    root.innerHTML += elem2.ToHtmlObject();
}