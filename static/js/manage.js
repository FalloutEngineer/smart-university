const App = {
    data(){
        return{
            facultyHidden: true,
            floorHidden: true,
            pulpitHidden: true,
            nameHidden: true,
            nameType: "text",

            dataReady: false,
            types: ["rooms", "pulpits", "faculties", "floors"],
            typeItems:{
                "rooms":["faculty", "floor", "pulpit"],
                "pulpits":["faculty"],
                "faculties":[],
                "floors":["faculty"],
            },
            faculties: [],
            floors: [],
            pulpits: [],

            currentFloors: [],
            currentPulpits: [],

            selectedType: "",
            selectedFaculty: "",
            selectedFloor: "",
            selectedPulpit: "",
            selectedRoom: "",

            name: "",
            number: 0,
        }
    },
    async mounted(){
        await fetch('/faculties/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        }).then(res =>{
            return res.json();
        }).then(data=>{
            this.faculties = data;
        });
        await fetch('/pulpits/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        }).then(res =>{
            return res.json();
        }).then(data=>{
            this.pulpits = data;
        });
        await fetch('/floors/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        }).then(res =>{
            return res.json();
        }).then(data=>{
            this.floors = data;
        });
        this.dataReady = true;
    },
    methods:{
        async createItem(){
            switch (this.selectedType) {
                case 'rooms':
                    if(this.number != "" && this.selectedFaculty != "" && this.selectedFloor != ""&& this.selectedPulpit != ""){
                        await fetch('/rooms/', {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                number: this.number,
                                floor: this.selectedFloor,
                                faculty: this.selectedFaculty,
                                capacity: "0",
                                type: "Room",
                                photo_links: [],
                                description: "",
                                assistant: "John Doe",
                                pulpits: [this.selectedPulpit],
                                co2: [],
                                temperature: [],
                                co2_history: [],
                                temperature_history: []
                            })
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
                  break;
                case 'pulpits':
                    if(this.name != "" && this.selectedFaculty != ""){
                        await fetch('/pulpits/', {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: this.name,
                                faculty: this.selectedFaculty,
                                rooms: []
                            })
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
                    break;
                case 'faculties':
                    if(this.name !== ""){
                        await fetch('/faculties/', {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: this.name,
                                floors: [],
                                pulpits: []
                            })
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
                  break;
                case 'floors':
                    if(this.number !== "" && this.selectedFaculty !== ""){
                        await fetch('/floors/', {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                number: this.number,
                                faculty: this.selectedFaculty,
                                rooms: []
                            })
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
                    break;
                default:
                  alert('Виникла помилка');
              }
        },
        changeType(e){
            if(this.types.includes(this.selectedType)){
                this.nameHidden = false;
                if(this.selectedType =="rooms"){
                    this.facultyHidden = false;
                    this.floorHidden = false;
                    this.pulpitHidden = false;
                    this.nameType = "number";
                }
                if(this.selectedType =="pulpits"){
                    this.facultyHidden = false;
                    this.floorHidden = true;
                    this.pulpitHidden = true;
                    this.nameType = "text";
                }
                if(this.selectedType =="faculties"){
                    this.facultyHidden = true;
                    this.floorHidden = true;
                    this.pulpitHidden = true;
                    this.nameType = "text";
                }
                if(this.selectedType =="floors"){
                    this.facultyHidden = false;
                    this.floorHidden = true;
                    this.pulpitHidden = true;
                    this.nameType = "number";
                }
            }
        },
        onValuesChange(e){

            const id = e.target.id;

            switch (id){
                case 'faculties':
                    this.currentFloors = this.floors.filter(floor => floor.faculty == this.selectedFaculty);
                    this.currentPulpits = this.pulpits.filter(pulpit => pulpit.faculty == this.selectedFaculty);
                    break;
                case 'floors':
                    break;
                case 'pulpits':
                    break;
                default:
                    alert('Виникла помилка');
            }
        },
    }
}

Vue.createApp(App).mount('#dash-body');