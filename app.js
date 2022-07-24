const express = require("express");
let axios = require("axios").default;

const app = express();
//api credentials

CHAPA_SECRET_KEY = "XXxXXXXXXXX555555555"; //get this from Chapa

let config = {
  headers: {
    Authorization: "Bearer " + CHAPA_SECRET_KEY,
  },
};

app.post("/order", async (req, res) => {
  //payment initiation

  try {
    //TODO: populate from DB
    let tx_ref = "tx-myecommerce12345." + Date.now();
    let result = await axios.postForm(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: "300",
        currency: "ETB",
        email: "aman@gmail.com",
        first_name: "Abebe",
        last_name: "Bikila",
        tx_ref: tx_ref,
        callback_url: "http://localhost:3001/api/success?tx_ref=" + tx_ref,
        "customization[title]": "I love e-commerce",
        "customization[description]": "It is time to pay",
      },
      config
    );

    console.log(result.data);

    //returning back the checkout url to Frontend

    res.send(result.data);
  } catch (error) {
    console.log(error.data);
    res.send("error message " + error);
  }
});

app.get("/api/success", async (req, res) => {
  //payment verification

  console.log(
    "executed when payment is successful-redirected by chapa to this url"
  );

  try {
    let result = await axios.get(
      "https://api.chapa.co/v1/transaction/verify/" + req.query.tx_ref,
      config
    );

    console.log("Result: " + result.data);
    //TODO: save transaction
    res.send(" payment transaction result " + JSON.stringify(result.data));
  } catch (error) {
    console.log("something happened " + error);
    res.send(" something happened " + error);
  }
});
app.listen(3001, () => console.log("app running on port 3001"));

/*
  chapa Testing Card
Card number: 4200 0000 0000 0000
cvv: 123
Expiry: "12/34"
*/
