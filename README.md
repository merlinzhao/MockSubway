# Mock Subway API
A mock subway system for Parker

Node 16
Docker 20
PostgresSQL hosted by AWS

Steps to run this project locally (without Docker):

1. Run `npm install` command to install dependencies
2. Setup/verify database settings inside `data-source.ts` file
3. Run `npm start` command

### Build Docker Image
```docker build -t my-node-app .```

### Run Docker Container
Node app will run on port 3000 on host machine

```docker run -p 3000:3000 my-node-app```

### Database
The database `mock_subway` is hosted in AWS.
``` type: "postgres",
    host: "mock-subway-instance.cvl5bfciu1ri.us-east-1.rds.amazonaws.com",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "mock_subway"
```


## Criteras
## Challenge 1
### POST /train-line

stations - each station (or stop) on the train line
    You can assume each station stop is a unique name. e.g. “14th” on the “1 train" in the example below refers to the same stop as “14th” on the “E train”.
name - of the train line
returns confirmation of the line creation
The lines should be saved to the database. 

Add the E train with stations "Spring", "West 4th", "14th","23rd", "34th", "42nd", "50th" - fare to ride is $2.75

```curl -X POST -H "Content-Type: application/json" -d '{"name": "E", "stations": ["Spring", "West 4th", "14th","23rd", "34th", "42nd", "50th"], "fare": 2.75}' http://localhost:3000/train-line```

Add the 1 train with stations "WTC","Chambers","Franklin","Canal", "Houston", "Christopher", "14th", "24th" - fare to ride is $2.75

```curl -X POST -H "Content-Type: application/json" -d '{"name": "1", "stations": ["WTC","Chambers","Franklin","Canal", "Houston", "Christopher", "14th", "24th"], "fare": 2.75}' http://localhost:3000/train-line```


**Example input:**
POST /train-line
{
"stations": ["Canal", "Houston", "Christopher", "14th"],
"name": "1"
}


### GET /route?origin=[origin]&destination=[destination]

origin - station
destination - station
returns the optimal station list from the origin station to the destination station
The optimal station list is the fewest stations possible. Note: there is no penalty for changing trains.

**Example input:**

Route from Houston station to 23rd station
GET /route?origin=Houston&destination=23rd

```curl -X GET "http://localhost:3000/routeTrip?origin=Houston&destination=23rd"```

**Reponse:**
```{"route": ["Houston","Christopher","14th","23rd"]}```


## Challenge 2

### POST /card
number - unique identification of the card
amount - the amount of money to be added to the pre-paid card
returns confirmation of the card creation
If the card already exists, the amount should be added to the balance of the card.

**Example input:**
POST /card
{
"number": "1234",
"amount": 10.0
}

```curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": 10.0}' "http://localhost:3000/card"```


### POST /station/[station]/enter
card_number - unique identification of the card being used to pay for the ride
returns the amount left in the card after paying for the ride

```curl -X POST -H "Content-Type: application/json" -d '{"card_number": "1234"}' http://localhost:3000/station/Houston/enter```

**Example input:**
POST /station/Houston/enter
{
"card_number": "1234"
}

**Response:**
```{"amount":7.25}```


### POST /station/[station]/exit
card_number - unique identification of the card being used to pay for the ride
returns the amount left in the card after paying for the ride

```curl -X POST -H "Content-Type: application/json" -d '{"card_number": "1234"}' http://localhost:3000/station/Houston/exit```

Example input:
POST /station/23rd/exit
{
"card_number": "1234"
}
**Response:**
```{"amount": 7.25}```


## OTHER SAMPLE INPUTS
### Trainlines

**GET - all trainlines**

```curl -X GET "http://localhost:3000/trainlines/"```

**GET - one trainline**

```curl -X GET "http://localhost:3000/trainlines/E"```

**POST - create a new trainline**

```curl -X POST -H "Content-Type: application/json" -d '{"name": "1"}' "http://localhost:3000/trainlines"```

### Stations
**POST - create new trainlines**

```curl -X POST -H "Content-Type: application/json" -d '{"name": "1", "stations": ["WTC","Chambers","Franklin","Canal", "Houston", "Christopher", "14th", "24th"], "fare": 2.75}' http://localhost:3000/train-line```
```curl -X POST -H "Content-Type: application/json" -d '{"name": "E", "stations": ["Spring", "West 4th", "14th", "23rd", "34th", "42nd", "50th"], "fare": 2.75}' http://localhost:3000/train-line```

**POST - enter a station**

```curl -X POST -H "Content-Type: application/json" -d '{"card_number": "1234"}' http://localhost:3000/station/Houston/enter```

**POST - exit a station**

```curl -X POST -H "Content-Type: application/json" -d '{"card_number": "1234"}' http://localhost:3000/station/Houston/exit```


**POST - Create or update card**

```curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": 10.0}' "http://localhost:3000/card"```

### Cards

**GET - all cards**

```curl -X GET "http://localhost:3000/card"```

**GET - card by id**

```curl -X GET "http://localhost:3000/card/1234"```

**POST - new card or add balance**

```curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": 10.0}' "http://localhost:3000/card"```

### ROUTING

**GET - route from origin to destination stations**

```curl -X GET "http://localhost:3000/routeTrip?origin=Houston&destination=23rd"```