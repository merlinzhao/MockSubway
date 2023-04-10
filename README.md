# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command


Criteras

POST /card
number - unique identification of the card
amount - the amount of money to be added to the pre-paid card
returns confirmation of the card creation
If the card already exists, the amount should be added to the balance of the card.

e.x repsonse 
POST /card
{
"number": "1234",
"amount": 10.0
}

curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": 10.0}' http://localhost:3000/card
curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": -2.75}' http://localhost:3000/card


POST /station/[station]/enter
card_number - unique identification of the card being used to pay for the ride
returns the amount left in the card after paying for the ride

POST /station/Houston/enter
{
"card_number": "1234"
}

Response:
{
"amount": 7.25
}


POST /station/[station]/exit
card_number - unique identification of the card being used to pay for the ride
returns the amount left in the card after paying for the ride

POST /station/23rd/exit
{
"card_number": "1234"
}
Response:
{
"amount": 7.25
}