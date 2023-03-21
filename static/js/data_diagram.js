
function dataForDiagram(building_id, floor_id) {
    const rooms = getData(building_id, floor_id);
    

let diagram_data = [];

    for (const room of Object.keys(rooms)) {
            // console.log(room);


        if (rooms[room].amount != "") {
            diagram_data.push({
                "classroom" : rooms[room].classroom,
                "amount" : rooms[room].amount,
            });
        }
    
    }
    return diagram_data;
}


