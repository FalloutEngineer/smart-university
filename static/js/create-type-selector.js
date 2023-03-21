const typeSelect = document.getElementById("type");
const hidden = 'hidden';

const items = {
    faculty: document.getElementById('faculty'),
    floor: document.getElementById('floor'),
    pulpit: document.getElementById('pulpit'),
}

const show = {
    'all': [items.faculty, items.floor, items.pulpit],
    'room': [items.faculty, items.floor, items.pulpit],
    'pulpit':[items.faculty, items.floor],
    'floor':[items.faculty],
    'faculty':[]
}

typeSelect.addEventListener("change", (e)=>{
    onChange(e.target.value)
});

function onChange(value){
    
    const arr = show[value];
    console.log(arr);
    console.log(value);
    if(arr){
        show["all"].forEach(item =>{
            item.parentElement.classList.add(hidden);
        });
        arr.forEach(item =>{
            item.parentElement.classList.remove(hidden);
        })
    }
}