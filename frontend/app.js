
document.addEventListener("DOMContentLoaded", () => {
    const tableSelect = document.getElementById("table-select");
    const xVars = document.getElementById("x-vars");
    const yVars = document.getElementById("y-vars");
    const groupBy = document.getElementById("group-by");
    const galleryImages = document.getElementById("gallery-images");

    fetch("/api/tables")
        .then(res => res.json())
        .then(data => {
            data.forEach(table => {
                const option = document.createElement("option");
                option.value = table;
                option.textContent = table;
                tableSelect.appendChild(option);
            });
        });

    tableSelect.addEventListener("change", () => {
        fetch(`/api/columns?table=${tableSelect.value}`)
            .then(res => res.json())
            .then(data => {
                xVars.innerHTML = "";
                yVars.innerHTML = "";
                groupBy.innerHTML = "";
                data.inputs.forEach(col => {
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.value = col;
                    xVars.appendChild(input);
                    xVars.appendChild(document.createTextNode(col));
                    xVars.appendChild(document.createElement("br"));
                });
                data.outputs.forEach(col => {
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.value = col;
                    yVars.appendChild(input);
                    yVars.appendChild(document.createTextNode(col));
                    yVars.appendChild(document.createElement("br"));
                });
                data.groups.forEach(col => {
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.value = col;
                    groupBy.appendChild(input);
                    groupBy.appendChild(document.createTextNode(col));
                    groupBy.appendChild(document.createElement("br"));
                });
            });
    });

    document.getElementById("refresh-btn").addEventListener("click", () => {
        const xVals = Array.from(xVars.querySelectorAll("input:checked")).map(i => i.value);
        const yVals = Array.from(yVars.querySelectorAll("input:checked")).map(i => i.value);
        const groupVals = Array.from(groupBy.querySelectorAll("input:checked")).map(i => i.value);

        fetch("/api/images", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                table: tableSelect.value,
                x_vars: xVals,
                y_vars: yVals,
                group_by: groupVals
            })
        })
        .then(res => res.json())
        .then(data => {
            galleryImages.innerHTML = "";
            data.images.forEach(url => {
                const img = document.createElement("img");
                img.src = url;
                galleryImages.appendChild(img);
            });
        });
    });
});
