const mazeV = $("#maze");

const width = 15;
const height = 15;

const start = { x: 5, y: 14 };
const goal = { x: 2, y: 7 };

const maze = [];

//create maze
for (let i = 0; i < height; i++) { // row
    const row = [];
    for (let j = 0; j < width; j++) { // column
        row.push({
            x: j,
            y: i,
            id: `${j}${i}`,
            isBlock: j % 2 == 0 && i % 2 == 0,
        });
    }
    maze.unshift(row);
}

//create maze view
maze.forEach(r => {
    const rowV = $("<div/>", {
        "class": "row"
    });
    r.forEach(c => {
        const box = $("<div/>", {
            "id": c.id,
            "class": "box"
        });
        box.append(`<p></p>`)
        if (c.isBlock) {
            box.css("background-color", "grey");
        };
        if ((c.x == start.x && c.y == start.y) || (c.x == goal.x && c.y == goal.y)) { // mark start and finish
            box.css("background-color", "red");
        }
        rowV.append(box);
    });
    mazeV.append(rowV);
});

/** path finding */
const visited = [];
const path = [];
let DFSFound = false;
async function DFS(s, g) {
    if (!(s.x == g.x && s.y == g.y)) { //not the goal, continue
        const startId = getId(s.x, s.y);
        visited.push(startId);
        if (!(s.x == start.x && s.y == start.y)) {
            path.push(startId);
        }
        const neighbors = getNeighbors(s.x, s.y);
        for (let iN = 0; iN < neighbors.length; iN++) {
            let n = neighbors[iN];
            if (!DFSFound && !visited.includes(getId(n.x, n.y))) {
                DFS(n, g);
            }
        }
    } else {
        DFSFound = true;
    }
}

async function animatePath(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const theBox = $(`#${id}`);
    theBox.css("background-color", "aqua");
}

const getId = (x, y) => `${x}${y}`;

/**
 * return [{x,y}]
 */
function getNeighbors(x, y) {
    const neighbors = [];
    for (a = -1; a < 2; a++) {
        for (b = -1; b < 2; b++) {
            if (!(a == 0 && b == 0)) {
                const nX = x + a;
                const nY = y + b;
                if ((nX >= 0 && nX < width) && (nY >= 0 && nY < height)) {
                    const node = maze[nY][nX];
                    const realNode = maze[node.y][node.x];
                    if (!realNode.isBlock) {
                        neighbors.push({ x: nX, y: nY });
                    }
                }
            }
        }
    }
    console.log(`neighbors of ${x},${y} is ${neighbors.map(e => JSON.stringify(e)).join(",")}`)
    return neighbors;
}

(async () => {
    DFS(start, goal);
    for await (p of path) {
        await animatePath(p);
    }
})();