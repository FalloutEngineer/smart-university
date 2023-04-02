const getData = (building_id, floor_id) => {
    let result;
    $.ajax({
        dataType: "json",
        url: '/js/test.json',
        async: false,
        success: (data) => {
            result = data;
        }
    });

    return result[`building${building_id}`][`floor${floor_id}`]
}

