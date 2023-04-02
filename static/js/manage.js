const App = {
    data(){
        return{
            facultyHidden: true,
            floorHidden: true,
            pulpitHidden: true,
            nameHidden: true,
            capacityHidden: true,
            typeHidden: true,
            descriptionHidden: true,
            assistantHidden: true,
            imagesHidden: true,
            svgHidden: true,
            buildingHidden: true,
            co2Hidden: true,
            temperatureHidden: true,
            colorHidden: true,
            // backgroundHidden: true,
            addressHidden: true,

            nameType: "text",

            dataReady: false,
            types: ["rooms", "pulpits", "faculties", "floors", "buildings"],
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
            buildings: [],


            images: [],

            svgLink: "",

            currentFloors: [],
            currentPulpits: [],
            currentBuildings: [],

            selectedType: "",
            selectedFaculty: "",
            selectedFloor: "",
            selectedPulpit: "",
            selectedRoom: "",
            selectedBuilding: "",

            name: "",
            number: 0,

            capacity: 0,
            selectedRoomType: "",
            description: "",
            assistant: ""
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
        await fetch('/buildings/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        }).then(res =>{
            return res.json();
        }).then(data=>{
            this.buildings = data;
        });
        this.dataReady = true;
    },
    methods:{
        handleFileUpload(e) {
            this.images = e.target.files;
        },
        handleSvgUpload(e){
            this.svg = e.target.files[0];
        },
        // handleBackgroundUpload(e){
        //     this.background = e.target.files[0];
        // },
        async createItem(){
            switch (this.selectedType) {
                case 'rooms':
                    if(this.number != "" && this.selectedFaculty != "" && this.selectedFloor != ""&& this.selectedPulpit != ""){

                        // const data = await response.json();

                        // if(data.url){
                        //     console.log(data.url);
                        // }


                        const formData = new FormData();

                        formData.append('number', this.number);
                        formData.append('floor', this.selectedFloor);
                        formData.append('faculty', this.selectedFaculty);
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


                        await fetch('/rooms/', {
                            method: 'POST',
                            body: formData
                            // body: JSON.stringify({
                            //     number: this.number,
                            //     floor: this.selectedFloor,
                            //     faculty: this.selectedFaculty,
                            //     capacity: this.capacity,
                            //     type: this.selectedRoomType,
                            //     images: this.images,
                            //     description: this.description,
                            //     assistant: this.assistant,
                            //     pulpits: [this.selectedPulpit],
                            //     co2: [],
                            //     temperature: [],
                            //     co2_history: [],
                            //     temperature_history: []
                            // })
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
                    if(this.number !== "" && this.selectedFaculty !== "" && this.selectedBuilding !== ""){
                        await fetch('/floors/', {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                number: this.number,
                                faculty: this.selectedFaculty,
                                rooms: [],
                                building: this.selectedBuilding,
                                co2SensorURL: this.co2SensorURL,
                                temperatureSensorURL: this.temperatureSensorURL,
                                floorColor: this.floorColor,
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
                    case 'buildings':
                        if(this.name != ""){

                        const formData = new FormData();

                        formData.append('name', this.name);
                        formData.append('svg', this.svg);
                        formData.append('floors[]', []);
                        formData.append('address', this.address);
                        // formData.append('background', this.background);

                            await fetch('/buildings/', {
                                method: 'POST',
                                body: formData
                                // body: JSON.stringify({
                                //     name: this.name,
                                //     svg: this.svg,
                                //     floors: []
                                // })
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
                    this.capacityHidden = false;
                    this.typeHidden = false;
                    this.descriptionHidden = false;
                    this.assistantHidden = false;
                    this.imagesHidden = false;
                    this.svgHidden = true;
                    this.buildingHidden = true;
                    this.co2Hidden = true;
                    this.temperatureHidden = true;
                    this.colorHidden = true;
                    // this.backgroundHidden = true;
                    this.addressHidden = true;
                }
                if(this.selectedType =="pulpits"){
                    this.facultyHidden = false;
                    this.floorHidden = true;
                    this.pulpitHidden = true;
                    this.nameType = "text";
                    this.capacityHidden = true;
                    this.typeHidden = true;
                    this.descriptionHidden = true;
                    this.assistantHidden = true;
                    this.imagesHidden = true;
                    this.svgHidden = true;
                    this.buildingHidden = true;
                    this.co2Hidden = true;
                    this.temperatureHidden = true;
                    this.colorHidden = true;
                    // this.backgroundHidden = true;
                    this.addressHidden = true;
                }
                if(this.selectedType =="faculties"){
                    this.facultyHidden = true;
                    this.floorHidden = true;
                    this.pulpitHidden = true;
                    this.nameType = "text";
                    this.capacityHidden = true;
                    this.typeHidden = true;
                    this.descriptionHidden = true;
                    this.assistantHidden = true;
                    this.imagesHidden = true;
                    this.svgHidden = true;
                    this.buildingHidden = true;
                    this.co2Hidden = true;
                    this.temperatureHidden = true;
                    this.colorHidden = true;
                    // this.backgroundHidden = true;
                    this.addressHidden = true;
                }
                if(this.selectedType =="floors"){
                    this.facultyHidden = false;
                    this.floorHidden = true;
                    this.pulpitHidden = true;
                    this.nameType = "number";
                    this.capacityHidden = true;
                    this.typeHidden = true;
                    this.descriptionHidden = true;
                    this.assistantHidden = true;
                    this.imagesHidden = true;
                    this.svgHidden = true;
                    this.buildingHidden = false;
                    this.co2Hidden = false;
                    this.temperatureHidden = false;
                    this.colorHidden = false;
                    // this.backgroundHidden = true;
                    this.addressHidden = true;
                }
                if(this.selectedType =="buildings"){
                    this.facultyHidden = true;
                    this.floorHidden = true;
                    this.pulpitHidden = true;
                    this.nameType = "text";
                    this.capacityHidden = true;
                    this.typeHidden = true;
                    this.descriptionHidden = true;
                    this.assistantHidden = true;
                    this.imagesHidden = true;
                    this.svgHidden = false;
                    this.buildingHidden = true;
                    this.co2Hidden = true;
                    this.temperatureHidden = true;
                    this.colorHidden = true;
                    // this.backgroundHidden = false;
                    this.addressHidden = false;
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