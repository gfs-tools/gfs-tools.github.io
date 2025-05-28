async function refresh() {
    const table = document.getElementById("tableSelect").value;
    const xVars = Array.from(document.querySelectorAll("#xVars input:checked")).map(cb => cb.value);
    const yVars = Array.from(document.querySelectorAll("#yVars input:checked")).map(cb => cb.value);
    const groupBy = Array.from(document.querySelectorAll("#groupBy input:checked")).map(cb => cb.value);

    const res = await fetch("http://localhost:5000/run_analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, x_vars: xVars, y_vars: yVars, group_by: groupBy })
    });
    const data = await res.json();
    const previewRow = document.getElementById("previewRow");
    previewRow.innerHTML = `<img src="\${data.image_url}" alt="Trend Image">`;
}

function scrollLeft() {
    document.getElementById("previewRow").scrollBy({ left: -200, behavior: "smooth" });
}

function scrollRight() {
    document.getElementById("previewRow").scrollBy({ left: 200, behavior: "smooth" });
}
