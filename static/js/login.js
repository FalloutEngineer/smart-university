const App = {
    methods:{
        async auth(){
            const data = {
                login: this.login,
                password: this.password
            }
            const res = fetch('/auth/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const status = (await res).status;
            if(status != 400){
                const resp = await (await res).json()
                const token = resp.token;

                document.cookie = `token=${token};`;

                window.location.href = '/manage';
            }
            else{
                alert('Невірні дані');
            }
        }
    },
}

Vue.createApp(App).mount('#login-page');
