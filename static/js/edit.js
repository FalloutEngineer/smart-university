const App = {
    data(){
        return{

            nameType: "number",

            dataReady: false,
            types: ["rooms", "pulpits", "faculties", "floors"],
            typeItems:{
                "rooms":["faculty", "floor", "pulpit"],
                "pulpits":["faculty"],
                "faculties":[],
                "floors":["faculty"],
            },
            roomTypes: [
                'Аудиторія',
                'Лабораторія',
                "Комп'ютерна аудиторія",
                "Кафедра",
                "Приміщення"
            ],
            faculties: [],
            floors: [],
            pulpits: [],
            images: [],

            currentFloors: [],
            currentPulpits: [],

            number: 0,

            capacity: 0,
            selectedRoomType: "",
            description: "",
            assistant: ""
        }
    },
    async mounted(){
        if(item){
            this.number = item.number;
            this.capacity = item.capacity;
            this.selectedRoomType = item.type;
            this.assistant = item.assistant;
            this.pulpits = item.pulpits;
            this.description = item.description;
        }else{
            alert("Виникла помилка, не вдалось завантажити інформацію про кімнату")
        }
    },
    methods:{
        handleFileUpload(e) {
            this.images = e.target.files;
          },
        async updateItem(){
            if(this.number != "", this.selectedRoomType != ""){

                const formData = new FormData();

                        formData.append('number', this.number);
                        formData.append('capacity', this.capacity);
                        formData.append('type', this.selectedRoomType);

                        for (let i = 0; i < this.images.length; i++) {
                            formData.append('images', this.images[i]);
                        }

                        formData.append('description', this.description);
                        formData.append('assistant', this.assistant);
                        formData.append('pulpits[]', this.selectedPulpit);
                        formData.append('co2[]', []);
                        formData.append('temperature[]', []);
                        formData.append('co2_history[]', []);
                        formData.append('temperature_history[]', []);

                        console.log(formData);


                        await fetch('/rooms/' + item.number, {
                            method: 'PATCH',
                            body: formData
                        }).then(res =>{
                            return res.json();
                        }).then(data =>{
                            if(data.message){
                                alert(data.message);
                            }else{
                                alert("Об'єкт успішно створено");
                            }
                        })
                    }else{
                        alert("Будь ласка заповніть всі поля");
                    }

            //     await fetch('/rooms/' + item.number, {
            //         method: 'PATCH',
            //         headers:{
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             number: this.number,
            //             capacity: this.capacity,
            //             type: this.selectedRoomType,
            //             // photo_links: [],
            //             description: this.description,
            //             assistant: this.assistant,
            //             // co2: [],
            //             // temperature: [],
            //             // co2_history: [],
            //             // temperature_history: []
            //         })
            //     }).then(res =>{
            //         return res.json();
            //     }).then(data =>{
            //         if(data.message){
            //             alert(data.message);
            //         }else{
            //             alert("Об'єкт успішно змінено");
            //         }
            //     })
            // }else{
            //     alert("Будь ласка заповніть всі поля");
            // }
        },
    }
}

Vue.createApp(App).mount('#dash-body');
