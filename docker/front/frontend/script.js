let page = 1;
let max = 10;

const start =  async () => {
   
        const main = document.getElementsByClassName("main")[0];
        const data = await fetch();
       if (data == undefined){
        const probleem = document.createElement("h1");
        probleem.innerHTML = "Probleem met server, kan niet fetchen data!"
        main.appendChild(probleem)
       } else{

        console.log(data);
        const scores = document.createElement("p");
        scores.innerHTML = "scores"
        const name = document.createElement("p");
        name.innerHTML = "name"
        main.appendChild(scores)
        main.appendChild(name)

        data.scores.forEach(score => {
          const x = document.createElement("p");
          x.innerHTML = score.score
          const y = document.createElement("p");
          y.innerHTML = score.name
          main.appendChild(x)
          main.appendChild(y)
        });
       }
    
}; 

const fetch = async () => {
  try {
    const config = {
      params: {
        'page': page,
        'limit': max,
      },
    };

    // Assuming EXTERNAL-IP is the external IP of your LoadBalancer service
    const baseURL = 'http://gilles-cloud.dawaladeny.eu:3000';

    const response = await axios.get(`${baseURL}/api/v1/scores`, config);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener('DOMContentLoaded', start);