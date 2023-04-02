const App = {
    data(){
        return{
            items: []
        }
    },
    methods:{
        deleteItem: async function (item) {
            
            if(item){
                if(confirm(`Ви дійно хочете видалити факультет ${item.replace(/%20/g, " ")}?`)){
                    await fetch('/faculties/' + item.replace(/%20/g, " "), {
                        method: 'DELETE',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                    }).then(res =>{
                        return res.json();
                    }).then(data =>{
                        if(data.message){
                            alert(data.message);
                            window.location.href = "/faculty-list";
                        }else{
                            alert("Об'єкт успішно видалено");
                            window.location.href = "/faculty-list";
                        }
                    })
                }
                
            }else{
                alert('Помилка');
            }
        }
    }
}

Vue.createApp(App).mount('#dash-body');