
function registerTippiesForBuildingAndFloor(building_id, floor_id) {
    let tippy_data = getData(building_id, floor_id);
    // console.log(tippy_data);

    for (const tippy_id of Object.keys(tippy_data)) {
        const tippyObject = tippy_data[tippy_id];
        tippy(
            tippyObject.id,
            {
                content: `${tippyObject.classroom} ${tippyObject.content} ${tippyObject.amount}`,
                placement: tippyObject.placement,
                animation: tippyObject.animation
            }
        );
        // console.log(tippyObject);
    }
}


