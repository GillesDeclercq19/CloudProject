 
 
# Opdracht 

De opdracht voor het vak Cloud Infrastructure vereist dat men een eigen project oplevert en mondeling verdedigd. Het project omvat een gecontaineriseerde applicatie met ten minste 3 services, getest met Docker-Compose op een lokale machine. De cloudinfrastructuur wordt via Terraform/OpenTofu opgezet, inclusief worker nodes en de Control Plane. Ansible wordt gebruikt voor het beheer van de infrastructuur. De applicatie wordt eerst lokaal met Minikube getest en vervolgens op een live cluster uitgerold. Deployment omvat twee omgevingen (test en productie) met behulp van een helm chart. Monitoring van het cluster wordt uitgevoerd met tools zoals Prometheus/Grafana, Zabbix, of Flowmon.

# Applicatie

Mijn applicatie houdt scores bij van een game. De applicatie bestaat uit javascript, html en css. De frontend toont een tabel van een aantal personen met hun score. De backend is gemaakt in node.js en de database die ik gebruik is mongo, daar worden alle scores opgeslagen.

![Alt text](https://i.imgur.com/LTd06hQ.png "Optional title")

# Docker

## Containers

Ik heb de applicatie frontend en backend gescheiden en hiervan 2 DockerFiles gemaakt.

**Backend:**

 ![Alt text](https://i.imgur.com/tCApPds.png "Optional title")

FROM node: Betekent dat de basisimage voor deze container Node.js is.

WORKDIR /backend: Workdirectory ingesteld op /backend. Op deze locatie zullen instructies worden uitgevoerd.

COPY /backend/ ./: Dit kopieert alle backend bestanden naar  de backend directory van de Docker-container.

RUN npm install: Installeert in de Docker-container alle packages die in package.json in de backend zijn gegeven.

EXPOSE 3000: Opent poort 3000 in de Docker-container.

CMD ["npm", "start"]: Commando dat word uitgevoerd wanneer de Docker-container wordt gestart. De backend wordt gestart via npm start.

**Frontend:**

  ![Alt text](https://i.imgur.com/YqbGeU6.png "Optional title")

FROM nginx: Betekent dat de basisimage voor deze container nginx is.


COPY /frontend/ /usr/share/nginx/html/: Dit kopieert alle frontend bestanden zoals js, css en html naar nginx directory in de container.


EXPOSE 80: Open poort 80 in de Docker-container.

### Building
Frontend en backend worden gebuild via buildx. Ik gebruik buildx om zo ervoor te zorgen dat mijn applicatie kan runnen op alle CPU’s, aangezien mijn VM cloud processor AMD is, werkte de applicatie eerst niet op andere processoren. Ook met het commando push ik de laatste build naar Dockerhub. Hiervoor moest ik wel eerst docker login, docker tag en docker push uitvoeren op mijn cloud VM. Zo werd mijn eerste backend en frontend gepusht naar DockerHub. Later kon ik dan nieuwere versies pushen.
DockerHub profile: https://hub.docker.com/u/gillesdeclercq19

  ![Alt text](https://i.imgur.com/sGsxhMy.png "Optional title")

Voor mijn backend ziet dit ook hetzelfde eruit.
Commando:

![Alt text](https://i.imgur.com/jAyvNqn.png "Optional title")


# Docker-Compose
Hiermee kan ik gemakkelijk via docker-compose up, mijn applicatie deployen op mijn cloud-vm. Hierbij word de DockerFile van zowel backend en frontend tegelijk opgestart maar ook een mongo container.

![Alt text](https://i.imgur.com/RRh1ay1.png "Optional title")
 
# Cloudinfrastructuur
## Terraform
Cluster & nodes worden aangemaakt via Terraform & Linode. Eerst heb ik een Main.tf, variables.tf en een terraform.tfvars gecreëerd. Al andere bestanden werden gecreëerd door terraform apply. 

![Alt text](https://i.imgur.com/Geu8v45.png "Optional title")


**Main.tf**

 ![Alt text](https://i.imgur.com/jDtgIbg.png "Optional title")

Voor variables.tf moest ik de linode API token meegegeven zodat Terraform & Linode met elkaar kunnen communiceren. Deze variabelen worden dat uitgevoerd in de main.tf. Al deze files zijn via een tutorial linode-terraform tutorial aangemaakt maar de versies van linode en terraform waren verouderd dus vooral deze aangepast.
Tutorial: https://www.linode.com/docs/products/compute/kubernetes/guides/deploy-cluster-using-terraform/

**Variables.tf**

  ![Alt text](https://i.imgur.com/zaNruLy.png "Optional title")

**Terraform.tfvars**

  ![Alt text](https://i.imgur.com/aBN6hGV.png "Optional title")

Daarna opbouwen Terraform init, plan and apply.

**De infrastructuur wordt gecreëerd.** 

   ![Alt text](https://i.imgur.com/Geu8v45.png "Optional title")

**Connectie met LKE-cluster** 
 ![Alt text](https://i.imgur.com/P4XT6ss.png "Optional title")

Deze commando’s worden uitgevoerd zodat kubeconfig weet dat het moet gebruik maken van de terraform aangemaakte cluster. Als je deze niet uitvoert zou je deze errors krijgen:

 ![Alt text](https://i.imgur.com/XtPkzYX.png "Optional title") 

**Werking testen**

3 nodes zijn gecreëerd

 ![Alt text](https://i.imgur.com/cEIxcR8.png "Optional title") 

# Management
## Ansible
Hosts file maken om communicatie met ansible mogelijk te maken met de nodes (/etc/ansible/hosts).
Ik had via terraform geen paswoord meegegeven voor mijn nodes dus moest ik eerst via node-shell commando in mijn nodes gaan en daarin een gebruiken ubuntu maken en deze sudo-rechten geven. Dan heb ik een sshkey gecreëerd op mijn cloud VM en deze dan kopieert naar mijn nodes. Dan was communicatie mogelijk.

**Zonder playbook:**

 ![Alt text](https://i.imgur.com/cO5sX6b.png "Optional title")

 ![Alt text](https://i.imgur.com/7KOKVJF.png "Optional title")

**Via ansible play-book**

**Playbooks:**

**sshd-playbook.yaml**

 ![Alt text](https://i.imgur.com/22H1fGT.png "Optional title")

Voor ik mijn sshd-playbook.yaml heb uitgevoerd was de standaardpoort nog 22. Ik heb een playbook gemaakt die de basis security instellingen voor ssh automatisch instelt.

 ![Alt text](https://i.imgur.com/H2jRqYk.png "Optional title") 

 ![Alt text](https://i.imgur.com/A7VEykp.png "Optional title")

 ![Alt text](https://i.imgur.com/9JoUs32.png "Optional title")

**Ufw-playbook.yaml**

  ![Alt text](https://i.imgur.com/PxFC5VL.png "Optional title")
  
Dit playbook installeert een simpele firewall en opent de poorten op de nodes die worden gebruikt voor mijn applicatie.

**Update-playbook.yaml**

  ![Alt text](https://i.imgur.com/YshlhJ0.png "Optional title")

Dit playbook update en upgrade de installeerde packages op de nodes.

**Automatic-update-playbook.yaml**

![Alt text](https://i.imgur.com/xpENTrt.png "Optional title")
 

Dit playbook zorgt ervoor dat de updates automatisch gebeuren.

# Cluster en orchestratie
## Minikube
De applicatie wordt eerst lokaal op de VM getest via Minikube.
Opstarten minikube, momenteel draait minikube op de node. Er is nog geen pod of service momenteel.

![Alt text](https://i.imgur.com/5G17AWj.png "Optional title")

Aanmaken van files om applicatie te laten draaien via minikube.

 ![Alt text](https://i.imgur.com/30rMEJg.png "Optional title")

In terminal script uitvoeren.

**Chmod a+x script.sh**

**./script.sh**

 ![Alt text](https://i.imgur.com/XX1zUcK.png "Optional title") 

De deployments en services zijn gecreëerd. 

 ![Alt text](https://i.imgur.com/CU8Nn9h.png "Optional title")
 
Kijken of de database is geseed in de backend. Curl werkt ook dus de backend, frontend en db draait lokaal.
 
  ![Alt text](https://i.imgur.com/BFd2jUh.png "Optional title")
 
Minikube stop
 ![Alt text](https://i.imgur.com/hkvGURt.png "Optional title")

## Applicatie deployment

 ![Alt text](https://i.imgur.com/bdxuw8K.png "Optional title")

De applicatie heeft een backend, frontend en een database (mongo). Elk van deze heeft een deployment file en een service file. In de deployment files van backend en front-end worden er 3 replica’s gecreëerd.  1 voor elke node. Er word maar 1 mongo replica gecreëerd.
De deployment en services worden opgestart via een script:

 ![Alt text](https://i.imgur.com/KOQUzmt.png "Optional title") 

Als dit script wordt uitgevoerd worden deze gecreëerd.   

  ![Alt text](https://i.imgur.com/KOQUzmt.png "Optional title") 

Deze kunnen ook snel verwijderden worden via een ander script:

  ![Alt text](https://i.imgur.com/9HFIRll.png "Optional title")  

Na dit script worden alle deployments en services verwijderd. 

  ![Alt text](https://i.imgur.com/AUC8EPQ.png "Optional title") 

Wanneer de deployments en services zijn gecreëerd kan men nagaan of deze draaien.

**Deployments:**

   ![Alt text](https://i.imgur.com/amK1GXG.png "Optional title") 

**Services:**

   ![Alt text](https://i.imgur.com/LgRAbuB.png "Optional title") 

Nu kun je testen of de website online draait door naar de EXTERNAL-IP te gaan van de front-end. 




# Environments en deployment
**Structuur:**

 ![Alt text](https://i.imgur.com/YCmrMpE.png "Optional title") 

Er moeten twee omgevingen gecreëerd worden namelijk een production en een test. Voor elk heb ik een values file gemaakt.
In de production-values file zit dit bijvoorbeeld:

 ![Alt text](https://i.imgur.com/yP3MskY.png "Optional title") 
 
De backend bij mij is een LoadBalancer en geen ClusterIP. In de gewone javascript wordt de value backend-service als connectie string letterlijk overgenomen waardoor er geen communicatie mogelijk is, dit komt door client sided rendering. 
Hier worden er 2 frontends, 2 backends en 1 mongo pod gestart en hun services. Deze waarden worden toegepast in de backend, frontend en mongo.yaml die zich in de templates directory bevinden. Bijvoorbeeld backend.yaml:

 ![Alt text](https://i.imgur.com/fk3ZDXm.png "Optional title") 
 
Na het aanmaken van de value files, maak ik een namespace voor production en test. Daarin installeer ik dan de passende deployment. Na installatie worden de pods en services gecreëerd. 

  ![Alt text](https://i.imgur.com/okUL2Ka.png "Optional title") 
 
Daarna heb ik mijn frontend en backend gelinkt aan een dns.

![Alt text](https://i.imgur.com/k6OBsyZ.png "Optional title") 
 





## Grafana
Maak een nieuwe namespace voor monitoring van de cluster.

 ![Alt text](https://i.imgur.com/GVdeNdO.png "Optional title") 

Ik maakte een nieuwe map aan in Helm genaamd lke-monitor en heb daarin een values.yaml gecreëerd. 

 ![Alt text](https://i.imgur.com/ArOjkBa.png "Optional title") 
 
 
**Values.yaml file:**

 ![Alt text](https://i.imgur.com/KKKIt2z.png)

In cli een adminpassword meegeven.

 ![Alt text](https://i.imgur.com/7dFasNA.png)

Installeren van grafana en prometheus

 ![Alt text](https://i.imgur.com/uSFDYFN.png)

Pods zijn gecreëerd. 

![Alt text](https://i.imgur.com/wDeiFoW.png)

Services zijn aangemaakt.

 ![Alt text](https://i.imgur.com/zcQYLhX.png)

Port forwarden van prometheus, alertmanager en grafana naar lokaal.

 ![Alt text](https://i.imgur.com/owAOyKf.png) 
 
 
Op grafana inloggen met juiste credentials, daarna een dashboard creëren  met een passende template voor kubernetes clusters te monitoren. Na het saven kun je de nodes gegevens volgen op het dashboard.

![Alt text](https://i.imgur.com/LViES7p.png)
 



