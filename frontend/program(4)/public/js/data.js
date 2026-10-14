const treeDiagramData = {
    name: "方剂",
    children: [
        {
            name: "方剂A",
            children: [
                { name: "组成药材A1", children: [{ name: "炮制器皿X" }, { name: "炮制器皿Y" }] },
                { name: "组成药材A2", children: [{ name: "炮制器皿Z" }] }
            ]
        },
        {
            name: "方剂B",
            children: [
                { name: "组成药材B1", children: [{ name: "炮制器皿W" }] }
            ]
        }
    ]
};

const radialChartData = {
    name: "核心药材",
    children: [
        {
            name: "人参",
            children: [
                { name: "医籍记载", children: [{ name: "伤寒杂病论" }, { name: "本草纲目" }] },
                { name: "功效分类", children: [{ name: "补气", value: 10 }, { name: "安神", value: 5 }] },
                { name: "炮制工具", children: [{ name: "研钵" }, { name: "玉制药杵" }] }
            ]
        },
        {
            name: "灵芝",
            children: [
                { name: "医籍记载", children: [{ name: "神农本草经" }] },
                { name: "功效分类", children: [{ name: "滋补", value: 8 }, { name: "扶正", value: 7 }] },
                { name: "炮制工具", children: [{ name: "药刀" }] }
            ]
        }
    ]
};